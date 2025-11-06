import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import heroImage from "@/assets/hero-vision-ai.jpg";
import { exportDocumentationToPDF } from "@/lib/exportPDF";
import { useToast } from "@/hooks/use-toast";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  const { toast } = useToast();

  const handleExportPDF = async () => {
    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we create your documentation.",
      });
      await exportDocumentationToPDF();
      toast({
        title: "Success!",
        description: "Documentation exported to PDF successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export documentation. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                AI-Powered Vision Technology
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
                Vision AI
              </span>
              <br />
              <span className="text-foreground">Analyze Images</span>
              <br />
              <span className="text-foreground">With Intelligence</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl">
              Upload images and videos to unlock powerful AI-driven object detection, 
              face recognition, intelligent tagging, and automated caption generation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-foreground font-semibold px-8 py-6 text-lg rounded-xl shadow-glow transition-all hover:shadow-[0_0_50px_hsl(189_95%_52%_/_0.4)] hover:scale-105"
              >
                Get Started
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-primary/30 hover:bg-primary/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
              >
                Learn More
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleExportPDF}
                className="border-2 border-secondary/30 hover:bg-secondary/10 px-8 py-6 text-lg rounded-xl backdrop-blur-sm group"
              >
                <FileDown className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Export Docs
              </Button>
            </div>

            <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Fast</div>
                <div className="text-sm text-muted-foreground">Processing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">Smart</div>
                <div className="text-sm text-muted-foreground">AI Tags</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-primary/20">
              <img 
                src={heroImage} 
                alt="AI Vision Technology visualization with neural networks and data streams" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-card border border-primary/30 rounded-lg p-4 shadow-lg backdrop-blur-sm animate-float">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-medium">Object Detection</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card border border-secondary/30 rounded-lg p-4 shadow-lg backdrop-blur-sm animate-float delay-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" />
                <span className="text-sm font-medium">Face Recognition</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
