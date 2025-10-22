import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { UploadSection } from "@/components/UploadSection";
import { ResultsSection } from "@/components/ResultsSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Analysis {
  objects: string[];
  tags: string[];
  caption: string;
  faces: string[];
}

interface ImageResult {
  file: File;
  preview: string;
  analysis: Analysis | null;
  isAnalyzing: boolean;
}

const Index = () => {
  const [results, setResults] = useState<ImageResult[]>([]);
  const uploadRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    uploadRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const analyzeImage = async (file: File, index: number) => {
    try {
      const base64Image = await convertToBase64(file);

      const { data, error } = await supabase.functions.invoke("analyze-image", {
        body: { imageData: base64Image },
      });

      if (error) throw error;

      setResults((prev) =>
        prev.map((result, i) =>
          i === index
            ? { ...result, analysis: data.analysis, isAnalyzing: false }
            : result
        )
      );

      toast.success(`Analysis complete for ${file.name}`);
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast.error(`Failed to analyze ${file.name}`);
      
      setResults((prev) =>
        prev.map((result, i) =>
          i === index ? { ...result, isAnalyzing: false } : result
        )
      );
    }
  };

  const handleImageSelect = async (files: File[]) => {
    const newResults: ImageResult[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      analysis: null,
      isAnalyzing: true,
    }));

    setResults((prev) => [...prev, ...newResults]);
    toast.success(`${files.length} image${files.length > 1 ? "s" : ""} uploaded`);

    // Start analyzing each image
    const startIndex = results.length;
    files.forEach((file, i) => {
      analyzeImage(file, startIndex + i);
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero onGetStarted={handleGetStarted} />
      <div ref={uploadRef}>
        <UploadSection onImageSelect={handleImageSelect} />
      </div>
      <ResultsSection results={results} />
    </div>
  );
};

export default Index;
