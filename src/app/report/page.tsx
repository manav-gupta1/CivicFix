"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, CheckCircle2, RefreshCw, ArrowRight, CheckCircle, Navigation, PencilLine, AlertCircle, Copy, Info, X } from "lucide-react";
import { processImageAction, submitReportAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { compressImage } from "@/lib/imageUtils";

type Step = "UPLOAD" | "PREVIEW" | "ANALYZING" | "REVIEW" | "LOCATION" | "SUBMITTING" | "SUCCESS";

export default function ReportPage() {
  const [step, setStep] = useState<Step>("UPLOAD");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraFlow, setIsCameraFlow] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analysis, setAnalysis] = useState<any>(null);
  const [location, setLocation] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [createdReportId, setCreatedReportId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Only show onboarding to first-time users
    const hasSeenOnboarding = localStorage.getItem("civicfix-onboarded");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("civicfix-onboarded", "true");
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isCamera: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsCameraFlow(isCamera);
      setStep("PREVIEW");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsCameraFlow(false);
      setStep("PREVIEW");
    }
  };

  const processFile = async (file: File) => {
    setUploadError(null);
    const { base64, error } = await compressImage(file);
    
    if (error) {
      setUploadError(error);
      return;
    }
    
    setImage(base64);
    analyzeUploadedImage(base64);
  }

  const analyzeUploadedImage = async (base64Img: string) => {
    setStep("ANALYZING");
    setLoadingStage(0);
    
    // Simulate staged loading sequence visually
    const interval = setInterval(() => {
      setLoadingStage(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          return 3;
        }
        return prev + 1;
      });
    }, 800);

    const result = await processImageAction(base64Img);
    clearInterval(interval);

    if (result.success) {
      setAnalysis(result.data);
    } else {
      setAnalysis({
        category: "other",
        severity: "medium",
        title: "",
        description: "",
        recommended_action: "",
        confidence: 0
      });
    }
    setStep("REVIEW");
  };

  const loadDemoReport = () => {
    setUploadError(null);
    setImage("https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=800");
    setAnalysis({
      category: "waste",
      severity: "high",
      title: "Roadside garbage accumulation",
      description: "A significant accumulation of mixed waste is visible beside the road.",
      recommended_action: "Request municipal waste collection and cleanup.",
      confidence: 0.94
    });
    setStep("REVIEW");
  };

  const getLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
          setIsLocating(false);
        },
        () => {
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const submitReport = async () => {
    if (isSubmitting) return; // prevent double submit
    
    setIsSubmitting(true);
    setStep("SUBMITTING");
    const result = await submitReportAction({
      title: analysis.title || "Civic Issue Reported",
      category: analysis.category,
      severity: analysis.severity,
      description: analysis.description,
      recommended_action: analysis.recommended_action,
      confidence: analysis.confidence,
      image_url: image || "", 
      location_text: location || "Location not provided"
    });

    if (result.success && result.data) {
      setCreatedReportId(result.data.id);
      setStep("SUCCESS");
    } else {
      setIsSubmitting(false);
      setStep("LOCATION"); // allow retry
    }
  };

  const copyToClipboard = () => {
    if (createdReportId) {
      navigator.clipboard.writeText(createdReportId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      {showOnboarding && step === "UPLOAD" && (
        <div className="mb-8 bg-primary/5 border border-primary/20 rounded-xl p-6 relative animate-in fade-in slide-in-from-top-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={dismissOnboarding}
          >
            <X className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold mb-2 text-foreground">Welcome to CivicFix! 👋</h2>
          <p className="text-muted-foreground mb-4 text-sm">Help improve your neighborhood in 3 simple steps:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-medium">
            <div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">1</span> Snap a photo</div>
            <div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">2</span> AI extracts details</div>
            <div className="flex items-center gap-2"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary">3</span> Submit & Track</div>
          </div>
        </div>
      )}

      {step !== "SUCCESS" && (
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Report a Problem</h1>
          <p className="text-muted-foreground mt-2">Help us identify and fix civic issues in your neighborhood.</p>
        </div>
      )}

      {step === "UPLOAD" && (
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Report a Problem</CardTitle>
            <CardDescription>Capture the issue directly or upload a photo.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
              <div 
                className="flex-1 border-2 border-dashed rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => cameraInputRef.current?.click()}
              >
                <div className="rounded-full bg-primary/10 p-4 mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">📷</span>
                </div>
                <h3 className="font-semibold text-xl mb-2">Take a Photo</h3>
                <p className="text-muted-foreground text-sm">Capture the issue now</p>
                
                <input 
                  type="file" 
                  className="hidden" 
                  ref={cameraInputRef} 
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => handleFileSelect(e, true)}
                />
              </div>

              <div className="hidden sm:flex items-center justify-center text-muted-foreground font-medium uppercase text-sm">
                or
              </div>
              <div className="sm:hidden flex items-center justify-center text-muted-foreground font-medium uppercase text-sm my-2">
                or
              </div>

              <div 
                className="flex-1 border-2 border-dashed rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="rounded-full bg-primary/10 p-4 mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🖼️</span>
                </div>
                <h3 className="font-semibold text-xl mb-2">Upload Image</h3>
                <p className="text-muted-foreground text-sm">Choose from your device</p>
                
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, false)}
                />
              </div>
            </div>
            
            {uploadError && (
              <div className="mt-6 flex items-center p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20 max-w-sm mx-auto">
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="font-medium text-left">{uploadError}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4 bg-muted/20">
             <Button variant="link" onClick={loadDemoReport} className="text-muted-foreground hover:text-primary">
               Try Demo Report
             </Button>
          </CardFooter>
        </Card>
      )}

      {step === "PREVIEW" && (
        <Card className="border-border shadow-sm overflow-hidden animate-in fade-in duration-300">
          <CardHeader>
            <CardTitle>Image Preview</CardTitle>
            <CardDescription>Review your photo before analyzing.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 border-y">
            <div className="bg-muted">
              {previewUrl && <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-[60vh] object-contain" />}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between p-6 bg-muted/20">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={() => {
                if (isCameraFlow) {
                  cameraInputRef.current?.click();
                } else {
                  fileInputRef.current?.click();
                }
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Retake
            </Button>
            <Button 
              size="lg" 
              className="w-full sm:w-auto"
              onClick={() => {
                if (selectedFile) {
                  processFile(selectedFile);
                }
              }}
            >
              Use Photo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === "ANALYZING" && (
        <Card className="border-border shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-64 bg-muted">
              {image && <img src={image} alt="Upload preview" className="w-full h-full object-cover opacity-30 blur-sm" />}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm p-8">
                <h3 className="text-2xl font-bold mb-8">Analyzing your report...</h3>
                
                <div className="w-full max-w-sm space-y-4">
                  <div className={`flex items-center space-x-3 transition-opacity duration-500 ${loadingStage >= 0 ? 'opacity-100' : 'opacity-40'}`}>
                    {loadingStage > 0 ? <CheckCircle2 className="text-primary h-5 w-5" /> : <Loader2 className="animate-spin text-primary h-5 w-5" />}
                    <span className={loadingStage > 0 ? 'text-foreground' : 'text-primary font-medium'}>Image received</span>
                  </div>
                  <div className={`flex items-center space-x-3 transition-opacity duration-500 ${loadingStage >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                    {loadingStage > 1 ? <CheckCircle2 className="text-primary h-5 w-5" /> : loadingStage === 1 ? <Loader2 className="animate-spin text-primary h-5 w-5" /> : <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />}
                    <span className={loadingStage > 1 ? 'text-foreground' : loadingStage === 1 ? 'text-primary font-medium' : 'text-muted-foreground'}>Identifying issue</span>
                  </div>
                  <div className={`flex items-center space-x-3 transition-opacity duration-500 ${loadingStage >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                    {loadingStage > 2 ? <CheckCircle2 className="text-primary h-5 w-5" /> : loadingStage === 2 ? <Loader2 className="animate-spin text-primary h-5 w-5" /> : <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />}
                    <span className={loadingStage > 2 ? 'text-foreground' : loadingStage === 2 ? 'text-primary font-medium' : 'text-muted-foreground'}>Assessing severity</span>
                  </div>
                  <div className={`flex items-center space-x-3 transition-opacity duration-500 ${loadingStage >= 3 ? 'opacity-100' : 'opacity-40'}`}>
                     {loadingStage === 3 ? <Loader2 className="animate-spin text-primary h-5 w-5" /> : <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />}
                    <span className={loadingStage === 3 ? 'text-primary font-medium' : 'text-muted-foreground'}>Preparing report</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "REVIEW" && analysis && (
        <Card className="overflow-hidden border-border shadow-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-primary/5 p-4 border-b flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">AI Analysis Complete</span>
            </div>
            {analysis.confidence > 0 ? (
              <Badge variant="outline" className="bg-background border-primary/20 text-primary">
                AI Confidence: {Math.round(analysis.confidence * 100)}%
              </Badge>
            ) : (
               <Badge variant="outline" className="bg-background">
                Manual Entry
              </Badge>
            )}
          </div>
          <CardContent className="p-6 space-y-6">
            {analysis.confidence === 0 && (
              <div className="bg-muted/50 p-4 rounded-lg border text-sm flex items-start gap-3">
                 <div className="mt-0.5"><RefreshCw className="h-4 w-4 text-muted-foreground"/></div>
                 <p className="text-muted-foreground">We couldn&apos;t analyze this image automatically. Please describe the issue manually below.</p>
              </div>
            )}

            <div className="bg-muted/30 p-3 rounded-lg border border-primary/10 flex items-start gap-3 text-sm">
               <div className="mt-0.5"><Info className="h-4 w-4 text-primary"/></div>
               <div className="text-muted-foreground leading-relaxed">
                 <strong className="text-foreground">AI-assisted reporting:</strong> CivicFix uses AI to identify and structure civic issues. Please review and edit the generated information below before submitting.
               </div>
            </div>
          
            <div className="flex flex-col sm:flex-row gap-6">
              {image && (
                <div className="w-full sm:w-1/3">
                  <div className="relative group rounded-lg overflow-hidden border">
                    <img src={image} alt="Preview" className="w-full h-32 sm:h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" onClick={() => setStep("UPLOAD")}>
                        <RefreshCw className="mr-2 h-4 w-4" /> Replace
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              <div className="w-full sm:w-2/3 space-y-5">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground flex items-center gap-1.5"><PencilLine className="h-3 w-3" /> Title</Label>
                  <Input 
                    value={analysis.title} 
                    onChange={e => setAnalysis({...analysis, title: e.target.value})}
                    className="font-semibold text-lg border-transparent hover:border-input focus-visible:border-input bg-muted/30 hover:bg-transparent"
                    placeholder="Enter issue title"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground">Category</Label>
                    <Select value={analysis.category} onValueChange={v => setAnalysis({...analysis, category: v})}>
                      <SelectTrigger className="border-transparent hover:border-input bg-muted/30 hover:bg-transparent capitalize">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="waste">Waste</SelectItem>
                        <SelectItem value="pothole">Pothole</SelectItem>
                        <SelectItem value="road_damage">Road Damage</SelectItem>
                        <SelectItem value="streetlight">Streetlight</SelectItem>
                        <SelectItem value="drainage">Drainage</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-muted-foreground">Severity</Label>
                    <Select value={analysis.severity} onValueChange={v => setAnalysis({...analysis, severity: v})}>
                      <SelectTrigger className="border-transparent hover:border-input bg-muted/30 hover:bg-transparent uppercase">
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">LOW</SelectItem>
                        <SelectItem value="medium">MEDIUM</SelectItem>
                        <SelectItem value="high">HIGH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-muted-foreground flex items-center gap-1.5"><PencilLine className="h-3 w-3" /> Description</Label>
                  <Textarea 
                    value={analysis.description}
                    onChange={e => setAnalysis({...analysis, description: e.target.value})}
                    className="resize-none h-24 border-transparent hover:border-input focus-visible:border-input bg-muted/30 hover:bg-transparent"
                    placeholder="Describe the issue..."
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/20 border-t p-6 flex justify-between">
            <Button variant="ghost" onClick={() => setStep("UPLOAD")}>Cancel</Button>
            <Button size="lg" onClick={() => setStep("LOCATION")}>
              Confirm & Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === "LOCATION" && (
        <Card className="shadow-md animate-in slide-in-from-right-4 duration-300">
          <CardHeader>
            <CardTitle>Where is this issue?</CardTitle>
            <CardDescription>Provide the location so authorities can find and resolve it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <Button 
              size="lg" 
              className="w-full h-16 text-lg rounded-xl flex items-center justify-center gap-3 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary shadow-none border-primary/20 border"
              variant="outline"
              onClick={getLocation}
              disabled={isLocating || isSubmitting}
            >
              {isLocating ? <Loader2 className="animate-spin h-5 w-5" /> : <Navigation className="h-5 w-5" />}
              {isLocating ? "Locating..." : "Use my current location"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or enter manually</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Location Address</Label>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="e.g., Yamuna Vihar, Delhi" 
                  className="pl-9 h-12"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
            <Button variant="ghost" onClick={() => setStep("REVIEW")} disabled={isSubmitting}>Back</Button>
            <Button size="lg" onClick={submitReport} disabled={!location || isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Submit Report
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === "SUBMITTING" && (
        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="pt-24 pb-24 flex flex-col items-center text-center">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Submitting Report...</h3>
            <p className="text-muted-foreground">Securing your report in the CivicFix database.</p>
          </CardContent>
        </Card>
      )}

      {step === "SUCCESS" && (
        <Card className="border-primary/20 shadow-lg overflow-hidden animate-in fade-in zoom-in duration-500">
          <div className="bg-primary/5 py-12 flex flex-col items-center justify-center border-b border-primary/10">
             <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
                <CheckCircle className="h-12 w-12 text-primary relative z-10" />
             </div>
             <h2 className="text-3xl font-bold text-center">Report Submitted</h2>
             <p className="text-muted-foreground mt-2 text-center max-w-sm">
               Your civic report has been successfully recorded.
             </p>
          </div>
          <CardContent className="p-8">
            <div className="bg-muted/30 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-muted-foreground font-medium">CivicFix ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg">{createdReportId}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyToClipboard} title="Copy ID">
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="pt-2">
                 <h4 className="font-semibold text-lg">{analysis?.title}</h4>
                 <div className="flex items-center gap-2 mt-2">
                   <Badge variant="outline" className="capitalize">{analysis?.category?.replace('_', ' ')}</Badge>
                   <Badge variant={analysis?.severity === 'high' ? 'destructive' : analysis?.severity === 'medium' ? 'default' : 'secondary'} className="uppercase">
                      {analysis?.severity}
                   </Badge>
                 </div>
              </div>
              <div className="pt-2">
                <p className="font-medium flex items-center mt-1 text-muted-foreground"><MapPin className="h-4 w-4 mr-1.5 text-primary"/> {location}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-8 pt-0 flex justify-center">
             <Button size="lg" className="w-full h-14 text-lg" onClick={() => router.push(`/reports/${createdReportId}`)}>
               Track Report <ArrowRight className="ml-2 h-5 w-5" />
             </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
