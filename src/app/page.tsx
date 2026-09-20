import { Button } from "@/components/ui/button";
import { Activity, MapPin, Camera, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* HERO SECTION */}
      <section className="w-full relative overflow-hidden py-20 lg:py-32 bg-background border-b border-border/40">
        {/* Abstract Grid Visual (Option C) placed absolutely behind/beside */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)',
               backgroundSize: '40px 40px',
               maskImage: 'radial-gradient(ellipse at 80% 50%, black 40%, transparent 70%)'
             }}>
          {/* Animated Markers */}
          <div className="absolute top-[20%] right-[15%] h-3 w-3 bg-primary rounded-full animate-ping" />
          <div className="absolute top-[40%] right-[25%] h-2 w-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[60%] right-[10%] h-4 w-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-[30%] right-[35%] h-2 w-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="max-w-3xl space-y-8">
            <Badge variant="outline" className="text-primary border-primary/30 tracking-widest uppercase bg-primary/10 px-4 py-1.5 font-bold">
              Civic Intelligence
            </Badge>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-foreground uppercase leading-[1.1]">
              Your city has a problem.<br />
              <span className="text-muted-foreground">You just have to show us.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl font-light leading-relaxed">
              CivicFix turns photos of everyday civic problems into structured, trackable reports using AI.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 pt-4">
              <Link href="/report">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 rounded-md shadow-lg shadow-primary/20 hover:-translate-y-1 transition-transform">
                  <Camera className="mr-3 h-5 w-5" />
                  Report a Problem
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 rounded-md bg-background/50 backdrop-blur-sm border-border hover:bg-muted/50">
                  <Activity className="mr-3 h-5 w-5" />
                  View Community Impact
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE IMPACT STRIP */}
      <section className="w-full bg-muted/20 border-b border-border/40 backdrop-blur-md">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left divide-x divide-border/50">
              <div className="px-4">
                <div className="text-4xl font-black text-foreground">127</div>
                <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-2">Reports</div>
              </div>
              <div className="px-4">
                <div className="text-4xl font-black text-primary">83</div>
                <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-2">Resolved</div>
              </div>
              <div className="px-4">
                <div className="text-4xl font-black text-foreground">65%</div>
                <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-2">Resolution Rate</div>
              </div>
              <div className="px-4">
                <div className="text-4xl font-black text-foreground">2.4<span className="text-2xl text-muted-foreground ml-1">d</span></div>
                <div className="text-xs font-bold tracking-widest text-muted-foreground uppercase mt-2">Avg. Resolution</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold opacity-60">
              * DEMO / SAMPLE DATA
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="w-full py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="relative border-l-2 border-border/40 pl-8 pb-12">
              <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-background border-4 border-primary"></div>
              <h2 className="text-4xl font-black text-muted-foreground/30 mb-2 font-mono">01</h2>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Show</h3>
              <p className="text-muted-foreground text-lg">Point your camera at the problem.</p>
            </div>
            <div className="relative border-l-2 border-border/40 pl-8 pb-12">
              <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-background border-4 border-primary"></div>
              <h2 className="text-4xl font-black text-muted-foreground/30 mb-2 font-mono">02</h2>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Understand</h3>
              <p className="text-muted-foreground text-lg">AI identifies the issue and structures the report.</p>
            </div>
            <div className="relative border-l-2 border-transparent pl-8 pb-12">
              <div className="absolute -left-[10px] top-0 h-6 w-6 rounded-full bg-background border-4 border-primary"></div>
              <h2 className="text-4xl font-black text-muted-foreground/30 mb-2 font-mono">03</h2>
              <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">Act</h3>
              <p className="text-muted-foreground text-lg">Verify, submit and track it.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI ANALYSIS VISUAL SHOWCASE */}
      <section className="w-full py-24 bg-muted/10 border-y border-border/40 overflow-hidden">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Mock Image Frame */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border/50 bg-muted shadow-2xl">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=800')" }} />
              {/* Scanning reticle animation overlay */}
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary/50 shadow-[0_0_15px_rgba(var(--primary),1)] animate-[pulse_2s_ease-in-out_infinite]" />
              <div className="absolute top-4 left-4 right-4 bottom-4 border border-primary/30 border-dashed rounded-lg" />
            </div>

            {/* Right: AI Analysis Readout */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <Activity className="text-primary h-6 w-6" />
                <h3 className="text-2xl font-bold tracking-widest uppercase">AI Analysis</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-6 font-mono text-sm">
                <div className="bg-background/50 border border-border/50 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-muted-foreground mb-1 text-xs">CATEGORY</div>
                  <div className="text-foreground text-lg font-bold">Waste</div>
                </div>
                <div className="bg-background/50 border border-border/50 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-muted-foreground mb-1 text-xs">SEVERITY</div>
                  <div className="text-destructive font-bold text-lg flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4" /> HIGH
                  </div>
                </div>
                <div className="bg-background/50 border border-border/50 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-muted-foreground mb-1 text-xs">CONFIDENCE</div>
                  <div className="text-primary font-bold text-lg">94%</div>
                </div>
                <div className="bg-background/50 border border-border/50 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-muted-foreground mb-1 text-xs">RECOMMENDED ACTION</div>
                  <div className="text-foreground font-bold">Municipal waste collection</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REPORT CARD */}
      <section className="w-full py-24 bg-background">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center">
           <h2 className="text-3xl font-bold tracking-tight text-center mb-12 uppercase">The Final Report</h2>
           
           <Card className="w-full max-w-lg bg-card border-border/50 shadow-xl overflow-hidden rounded-xl">
             <div className="h-2 w-full bg-destructive" />
             <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <Badge variant="destructive" className="uppercase font-bold tracking-wider text-[10px] px-2 py-1 bg-destructive/20 text-destructive border-transparent">High Severity</Badge>
                  <div className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">CF-8A42F</div>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-foreground">Roadside waste accumulation</h3>
                
                <div className="flex items-center gap-2 text-muted-foreground mb-6 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  Yamuna Vihar, Delhi
                </div>
                
                <p className="text-muted-foreground text-base leading-relaxed mb-8 border-l-2 border-border/50 pl-4 italic">
                  &quot;Large accumulation of mixed waste visible along the roadside.&quot;
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                   <div className="text-xs text-muted-foreground font-mono">
                     AI CONFIDENCE: <span className="text-foreground">94%</span>
                   </div>
                   <div className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-foreground">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      In Progress
                   </div>
                </div>
             </CardContent>
           </Card>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-8 border-t border-border/40 bg-background mt-auto">
        <div className="container px-4 mx-auto text-center text-muted-foreground text-sm font-medium">
          <p>© {new Date().getFullYear()} CivicFix. Tech for a Better Tomorrow.</p>
        </div>
      </footer>
    </div>
  );
}
