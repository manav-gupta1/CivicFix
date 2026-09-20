"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2, MapPin, CheckCircle2, RefreshCw, ArrowRight, CheckCircle, Navigation, PencilLine } from "lucide-react";
import { processImageAction, submitReportAction } from "@/app/actions";
import { useRouter } from "next/navigation";

type Step = "UPLOAD" | "ANALYZING" | "REVIEW" | "LOCATION" | "SUBMITTING" | "SUCCESS";

export default function ReportPage() {
  const [step, setStep] = useState<Step>("UPLOAD");
  const [image, setImage] = useState<string | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analysis, setAnalysis] = useState<any>(null);
  const [location, setLocation] = useState<string>("");
  const [isLocating, setIsLocating] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [createdReportId, setCreatedReportId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      analyzeUploadedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
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
      setStep("LOCATION"); // allow retry
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      {step !== "SUCCESS" && (
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Report a Problem</h1>
          <p className="text-muted-foreground mt-2">Help us identify and fix civic issues in your neighborhood.</p>
        </div>
      )}

      {step === "UPLOAD" && (
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Upload Photo</CardTitle>
            <CardDescription>Take a picture or upload an image of the issue.</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="border-2 border-dashed rounded-xl p-16 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="rounded-full bg-primary/10 p-5 mb-6 group-hover:scale-110 transition-transform">
                <Upload className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Click or drag image to upload</h3>
              <p className="text-muted-foreground">Supported formats: JPG, PNG, WEBP</p>
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </CardContent>
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
        <Card className="overflow-hidden border-border shadow-md">
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
          <CardContent className="p-6 space-y-8">
            {analysis.confidence === 0 && (
              <div className="bg-muted/50 p-4 rounded-lg border text-sm flex items-start gap-3">
                 <div className="mt-0.5"><RefreshCw className="h-4 w-4 text-muted-foreground"/></div>
                 <p className="text-muted-foreground">We couldn&apos;t analyze this image automatically. Please describe the issue manually below.</p>
              </div>
            )}
          
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
        <Card className="shadow-md">
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
              disabled={isLocating}
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
                  placeholder="e.g., Connaught Place, Delhi" 
                  className="pl-9 h-12"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
            <Button variant="ghost" onClick={() => setStep("REVIEW")}>Back</Button>
            <Button size="lg" onClick={submitReport} disabled={!location}>
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
             <div className="h-24 w-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <CheckCircle className="h-12 w-12 text-primary" />
             </div>
             <h2 className="text-3xl font-bold text-center">Report Submitted</h2>
             <p className="text-muted-foreground mt-2 text-center max-w-sm">
               Your report has been added to CivicFix and routed to the responsible team.
             </p>
          </div>
          <CardContent className="p-8">
            <div className="bg-muted/30 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-4">
                <span className="text-muted-foreground font-medium">CivicFix ID</span>
                <span className="font-mono font-bold">{createdReportId}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">{analysis?.category?.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <Badge variant={analysis?.severity === 'high' ? 'destructive' : analysis?.severity === 'medium' ? 'default' : 'secondary'} className="uppercase mt-1">
                    {analysis?.severity}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium flex items-center mt-1"><MapPin className="h-3 w-3 mr-1 text-primary"/> {location}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-8 pt-0 flex justify-center">
             <Button size="lg" className="w-full h-14 text-lg" onClick={() => router.push(`/reports/${createdReportId}`)}>
               Track Report Progress <ArrowRight className="ml-2 h-5 w-5" />
             </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
