import { fetchReportByIdAction } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ReportTrackingPage({ params }: { params: { id: string } }) {
  const report = await fetchReportByIdAction(params.id);

  if (!report) {
    // Empty / Not Found State
    return (
      <div className="container mx-auto max-w-4xl px-4 py-24 text-center">
        <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
        <h1 className="text-3xl font-bold tracking-tight mb-2">Report Not Found</h1>
        <p className="text-muted-foreground mb-8">The report you are looking for does not exist or has been removed.</p>
        <Link href="/dashboard">
          <Button size="lg">Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const statuses = [
    { id: 'submitted', label: 'Submitted', desc: 'Report received' },
    { id: 'assigned', label: 'Assigned', desc: 'Sent to responsible team' },
    { id: 'in_progress', label: 'In Progress', desc: 'Resolution underway' },
    { id: 'resolved', label: 'Resolved', desc: 'Awaiting completion' }
  ];

  const currentStatusIndex = statuses.findIndex(s => s.id === report.status);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{report.title}</h1>
          <p className="text-muted-foreground mt-1 flex items-center">
            <span className="font-mono text-sm bg-muted px-2 py-1 rounded mr-3">ID: {report.id}</span>
            <Calendar className="h-4 w-4 mr-1" /> {new Date(report.created_at).toLocaleDateString()}
          </p>
        </div>
        <Badge 
          variant={report.status === 'resolved' ? 'default' : 'secondary'} 
          className={`text-lg px-4 py-1.5 capitalize ${report.status === 'resolved' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
        >
          {report.status.replace('_', ' ')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg">Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {report.image_url ? (
                <img 
                  src={report.image_url} 
                  alt="Reported issue" 
                  className="w-full h-64 object-cover rounded-xl border"
                />
              ) : (
                <div className="w-full h-32 bg-muted rounded-xl border flex items-center justify-center text-muted-foreground">
                  No image provided
                </div>
              )}
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{report.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Category</h4>
                  <p className="capitalize font-medium flex items-center"><Activity className="h-4 w-4 mr-2 text-primary" /> {report.category.replace('_', ' ')}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Severity</h4>
                  <Badge variant={report.severity === 'high' ? 'destructive' : report.severity === 'medium' ? 'default' : 'secondary'} className="uppercase">
                    {report.severity}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg">Location</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-start bg-muted/20 p-4 rounded-lg border border-muted/50">
                <div className="bg-background p-2 rounded-full shadow-sm mr-4 mt-0.5">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{report.location_text}</p>
                  <p className="text-sm text-muted-foreground mt-1 font-mono">
                    {report.latitude && report.longitude ? `Coordinates: ${report.latitude}, ${report.longitude}` : 'Manual Entry / Approx'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-lg">Resolution Timeline</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="relative border-l-2 border-muted ml-4 space-y-8 py-2">
                {statuses.map((status, index) => {
                  const isCompleted = index < currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const isPending = index > currentStatusIndex;
                  
                  return (
                    <div key={status.id} className="flex items-start">
                      <div className={`absolute -left-[11px] h-5 w-5 rounded-full flex items-center justify-center bg-background border-2 ${isCompleted ? 'border-primary text-primary' : isCurrent ? 'border-blue-500 text-blue-500' : 'border-muted text-muted-foreground'}`}>
                        {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : isCurrent ? <Clock className="h-3 w-3 animate-pulse" /> : <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />}
                      </div>
                      <div className={`ml-6 -mt-1 ${isPending ? 'opacity-50' : ''}`}>
                        <h4 className={`font-semibold ${isCurrent ? 'text-blue-600 dark:text-blue-400' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {status.label}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-0.5">{status.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">AI Confidence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-primary">{Math.round(report.confidence * 100)}%</span>
                <Badge variant="outline" className="border-primary/30 text-primary">High Accuracy</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                CivicFix AI assessed this report&apos;s validity and details prior to submission.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
