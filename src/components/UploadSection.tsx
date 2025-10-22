import { useState, useCallback } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface UploadSectionProps {
  onImageSelect: (files: File[]) => void;
}

export const UploadSection = ({ onImageSelect }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/")
    );

    if (files.length === 0) {
      toast.error("Please upload image files only");
      return;
    }

    onImageSelect(files);
  }, [onImageSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    
    if (files.length > 0) {
      onImageSelect(files);
    }
  }, [onImageSelect]);

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Upload Your <span className="text-primary">Images</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Drag and drop your images or click to browse
          </p>
        </div>

        <Card
          className={`border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? "border-primary bg-primary/5 scale-105"
              : "border-border hover:border-primary/50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <label className="block cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
            
            <div className="p-16 text-center">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                  <div className="relative bg-primary/10 p-8 rounded-full border border-primary/30">
                    <Upload className="w-16 h-16 text-primary" />
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-semibold mb-2">
                Drop your images here
              </h3>
              <p className="text-muted-foreground mb-6">
                or click to browse from your device
              </p>

              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/30 hover:bg-primary/10"
              >
                <ImageIcon className="mr-2 h-5 w-5" />
                Select Images
              </Button>

              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Batch Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Fast Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span>Secure Upload</span>
                </div>
              </div>
            </div>
          </label>
        </Card>
      </div>
    </section>
  );
};
