import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Eye, Tag, MessageSquare, Users } from "lucide-react";

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

interface ResultsSectionProps {
  results: ImageResult[];
}

export const ResultsSection = ({ results }: ResultsSectionProps) => {
  if (results.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-bold mb-4">
          Analysis <span className="text-primary">Results</span>
        </h2>
        <p className="text-xl text-muted-foreground">
          AI-powered insights from your images
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.map((result, index) => (
          <Card key={index} className="overflow-hidden border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
            <div className="relative aspect-video overflow-hidden bg-muted">
              <img
                src={result.preview}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {result.isAnalyzing && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
              )}
            </div>

            <CardHeader>
              <CardTitle className="text-lg truncate">{result.file.name}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {result.analysis ? (
                <>
                  {/* Caption */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      <span>Caption</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {result.analysis.caption}
                    </p>
                  </div>

                  {/* Objects */}
                  {result.analysis.objects.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Eye className="w-4 h-4 text-primary" />
                        <span>Objects Detected</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.analysis.objects.slice(0, 5).map((obj, i) => (
                          <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {obj}
                          </Badge>
                        ))}
                        {result.analysis.objects.length > 5 && (
                          <Badge variant="outline">
                            +{result.analysis.objects.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {result.analysis.tags.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Tag className="w-4 h-4 text-primary" />
                        <span>Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.analysis.tags.slice(0, 6).map((tag, i) => (
                          <Badge key={i} variant="outline" className="border-primary/30">
                            {tag}
                          </Badge>
                        ))}
                        {result.analysis.tags.length > 6 && (
                          <Badge variant="outline">
                            +{result.analysis.tags.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Faces */}
                  {result.analysis.faces.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Users className="w-4 h-4 text-secondary" />
                        <span>Faces Detected</span>
                      </div>
                      <div className="space-y-1">
                        {result.analysis.faces.slice(0, 3).map((face, i) => (
                          <p key={i} className="text-sm text-muted-foreground">
                            • {face}
                          </p>
                        ))}
                        {result.analysis.faces.length > 3 && (
                          <p className="text-sm text-muted-foreground">
                            +{result.analysis.faces.length - 3} more faces
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : result.isAnalyzing ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Analyzing image...</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
