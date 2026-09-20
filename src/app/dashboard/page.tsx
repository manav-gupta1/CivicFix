import { fetchReportsAction } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Activity, CheckCircle2, Clock, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const reports = await fetchReportsAction();
  
  if (reports.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-24 text-center">
        <Activity className="h-16 w-16 text-primary mx-auto mb-6 opacity-80" />
        <h1 className="text-3xl font-bold tracking-tight mb-2">Community Impact</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Community data will appear here as reports are submitted. Be the first to report an issue!
        </p>
        <Link href="/report">
          <Button size="lg">Report an Issue</Button>
        </Link>
      </div>
    );
  }

  const total = reports.length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  
  // Group by category
  const categories = reports.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 animate-in fade-in duration-500">
      <div className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight">Civic Impact Dashboard</h1>
        <p className="text-muted-foreground mt-2">Real-time overview of community issues and resolutions.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="shadow-sm border-none bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Total Reports</CardTitle>
            <Activity className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-primary">{total}</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Issues logged to date</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-none bg-green-50 dark:bg-green-950/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Resolved</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-green-600">{resolved}</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Successfully fixed</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Resolution Rate</CardTitle>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold">{resolutionRate}%</div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Of all reported issues</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Avg. Resolution</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold">2.4<span className="text-2xl font-bold text-muted-foreground ml-1">days</span></div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Average time to fix</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {reports.slice(0, 5).map(report => (
                  <Link href={`/reports/${report.id}`} key={report.id} className="block group">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-card hover:bg-muted/30 transition-colors">
                      <div className="flex items-start gap-5">
                        {report.image_url ? (
                          <img src={report.image_url} alt="" className="w-20 h-20 rounded-lg object-cover hidden sm:block border shadow-sm" />
                        ) : (
                          <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center hidden sm:flex border shadow-sm">
                             <AlertCircle className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{report.title}</h4>
                          <div className="flex items-center text-sm text-muted-foreground mt-1.5 font-medium">
                            <MapPin className="h-4 w-4 mr-1.5 text-primary" /> {report.location_text}
                          </div>
                          <div className="flex items-center gap-3 mt-3">
                            <Badge variant="outline" className="text-xs capitalize font-semibold tracking-wide bg-background">{report.category.replace('_', ' ')}</Badge>
                            <span className="text-xs text-muted-foreground">{new Date(report.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={report.status === 'resolved' ? 'default' : report.status === 'in_progress' ? 'secondary' : 'outline'} 
                             className={`capitalize mt-4 sm:mt-0 text-sm px-3 py-1 ${report.status === 'resolved' ? 'bg-green-600 hover:bg-green-700 text-white border-transparent' : 'border-muted-foreground/30'}`}>
                        {report.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle>Issues by Category</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                {Object.entries(categories).sort((a,b) => b[1] - a[1]).map(([category, count]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize font-semibold">{category.replace('_', ' ')}</span>
                      <span className="font-bold text-muted-foreground">{count}</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-out" 
                        style={{ width: `${(count / total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
