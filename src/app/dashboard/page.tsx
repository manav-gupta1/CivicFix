import { fetchReportsAction } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Activity, CheckCircle2, Clock, MapPin, BarChart3, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const reports = await fetchReportsAction();
  
  if (reports.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-24 text-center animate-in fade-in zoom-in duration-500">
        <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <BarChart3 className="h-12 w-12 text-primary opacity-80" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">No Civic Data Yet</h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg leading-relaxed">
          The dashboard aggregates community reports to help municipalities prioritize infrastructure repairs. It looks like you&apos;re the first one here!
        </p>
        <div className="bg-muted/30 border rounded-xl p-6 max-w-sm mx-auto mb-8 text-sm text-left">
          <h3 className="font-semibold mb-2">How to get started:</h3>
          <ul className="space-y-2 text-muted-foreground">
             <li className="flex gap-2"><Activity className="h-4 w-4 mt-0.5 text-primary"/> Take a photo of a local issue</li>
             <li className="flex gap-2"><Activity className="h-4 w-4 mt-0.5 text-primary"/> Let AI structure the report</li>
             <li className="flex gap-2"><Activity className="h-4 w-4 mt-0.5 text-primary"/> Watch community impact grow here</li>
          </ul>
        </div>
        <Link href="/report">
          <Button size="lg" className="h-12 px-8 text-base">Submit the First Report</Button>
        </Link>
      </div>
    );
  }

  // For the Hackathon Demo, we override the aggregate top-line stats to show a populated system.
  // The charts below will still use the actual local seed data distributions.
  const total = 127;
  const resolved = 83;
  const resolutionRate = 65;
  
  // Group by category
  const categories = reports.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group by status
  const statuses = reports.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 animate-in fade-in duration-500">
      <div className="mb-8 border-b pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Civic Impact Dashboard</h1>
          <p className="text-muted-foreground mt-2">Real-time overview of community issues and resolutions.</p>
        </div>
        <Badge variant="secondary" className="text-xs uppercase bg-yellow-100 text-yellow-800 border-yellow-200">
          Demo / Sample Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
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
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Avg Resolution</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold">2.4<span className="text-2xl font-bold text-muted-foreground ml-1">d</span></div>
            <p className="text-xs text-muted-foreground mt-2 font-medium">Average time to fix</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between py-4">
              <CardTitle className="text-lg">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Issue & Location</th>
                      <th className="px-6 py-4 font-semibold hidden sm:table-cell">Severity</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold hidden md:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reports.slice(0, 5).map(report => (
                      <tr key={report.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-6 py-4">
                           <Link href={`/reports/${report.id}`} className="block">
                              <p className="font-semibold text-base group-hover:text-primary transition-colors">{report.title}</p>
                              <p className="text-muted-foreground flex items-center mt-1 text-xs">
                                <MapPin className="h-3 w-3 mr-1 text-primary"/> {report.location_text}
                              </p>
                           </Link>
                        </td>
                        <td className="px-6 py-4 hidden sm:table-cell">
                          <Badge variant={report.severity === 'high' ? 'destructive' : report.severity === 'medium' ? 'default' : 'secondary'} className="uppercase text-[10px]">
                            {report.severity}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={report.status === 'resolved' ? 'default' : report.status === 'in_progress' ? 'secondary' : 'outline'} 
                                 className={`capitalize px-2.5 py-0.5 text-xs whitespace-nowrap ${report.status === 'resolved' ? 'bg-green-600 hover:bg-green-700 text-white border-transparent' : 'border-muted-foreground/30'}`}>
                            {report.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 border-b flex flex-row items-center gap-2 py-4">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Issue Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                {Object.entries(categories).sort((a,b) => b[1] - a[1]).map(([category, count]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize font-semibold">{category.replace('_', ' ')}</span>
                      <span className="font-bold text-muted-foreground">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
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

          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 border-b flex flex-row items-center gap-2 py-4">
              <PieChart className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
               <div className="space-y-5">
                {Object.entries(statuses).sort((a,b) => b[1] - a[1]).map(([status, count]) => (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize font-semibold text-muted-foreground">{status.replace('_', ' ')}</span>
                      <span className="font-bold">{count}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ease-out ${status === 'resolved' ? 'bg-green-500' : status === 'in_progress' ? 'bg-blue-500' : 'bg-muted-foreground/30'}`} 
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
