import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, MapPin, Camera } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 lg:py-32 xl:py-40 bg-gradient-to-b from-primary/5 to-background relative overflow-hidden">
        {/* Abstract background shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Spot it.<br className="sm:hidden"/> Report it.<br className="sm:hidden"/> <span className="text-primary">Fix it.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-[42rem] mx-auto font-medium">
              Turn everyday civic problems into actionable reports in seconds. CivicFix uses AI to understand what you see, organize the issue, and help move it toward resolution.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-12 justify-center items-center">
            <Link href="/report">
              <Button size="lg" className="w-full sm:w-auto text-xl px-10 h-16 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out">
                Report a Problem
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-16 rounded-full hover:bg-muted transition-colors">
                View Community Impact
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="w-full py-20 bg-background">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">How CivicFix Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Camera className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">1. Snap a Photo</h3>
              <p className="text-muted-foreground">Take a picture of the civic issue—potholes, waste, broken lights.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">2. AI Analysis</h3>
              <p className="text-muted-foreground">Our AI instantly categorizes the issue and assesses its severity.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">3. Track Resolution</h3>
              <p className="text-muted-foreground">Submit with a tap and follow the progress until it&apos;s fixed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="w-full py-20 bg-muted/40">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-8">Supported Issues</h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
            {['Garbage & Waste', 'Potholes', 'Road Damage', 'Broken Streetlights', 'Blocked Drainage'].map(cat => (
              <div key={cat} className="px-6 py-3 rounded-full bg-background border shadow-sm font-medium">
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full py-8 border-t bg-background mt-auto">
        <div className="container px-4 mx-auto text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} CivicFix. Built for the Tech for a Better Tomorrow Hackathon.</p>
        </div>
      </footer>
    </div>
  );
}
