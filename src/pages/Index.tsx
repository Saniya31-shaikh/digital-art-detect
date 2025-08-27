import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ClassificationResult } from '@/components/ClassificationResult';
import { artClassifier } from '@/lib/teachableMachine';
import { Button } from '@/components/ui/button';
import { Shield, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [result, setResult] = useState<{ label: string; confidence: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setResult(null);
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setResult(null);
  };

  const handleClassify = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    try {
      // Create image element for classification
      const imageUrl = URL.createObjectURL(selectedImage);
      const img = new Image();
      
      img.onload = async () => {
        try {
          const prediction = await artClassifier.classifyImage(img);
          setResult(prediction);
          toast.success('Classification complete!');
        } catch (error) {
          console.error('Classification error:', error);
          toast.error('Failed to classify image. Please try again.');
        } finally {
          setIsLoading(false);
          URL.revokeObjectURL(imageUrl);
        }
      };

      img.onerror = () => {
        toast.error('Failed to load image. Please try a different file.');
        setIsLoading(false);
        URL.revokeObjectURL(imageUrl);
      };

      img.src = imageUrl;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-gradient-primary shadow-glow">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ArtGuardian
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover the authenticity behind every image. Our AI-powered tool helps artists and art lovers 
            identify whether artwork is human-created or AI-generated in the digital age.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Image Upload */}
          <ImageUpload
            onImageSelect={handleImageSelect}
            selectedImage={selectedImage}
            onClear={handleClearImage}
          />

          {/* Classify Button */}
          {selectedImage && !result && !isLoading && (
            <div className="text-center">
              <Button
                onClick={handleClassify}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Analyze Artwork
              </Button>
            </div>
          )}

          {/* Results */}
          <ClassificationResult result={result} isLoading={isLoading} />

          {/* Instructions */}
          {!selectedImage && (
            <div className="text-center space-y-4 mt-16">
              <h2 className="text-2xl font-semibold">How it works</h2>
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <h3 className="font-medium">Upload Image</h3>
                  <p className="text-sm text-muted-foreground">
                    Select or drag & drop any image file
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <h3 className="font-medium">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our model analyzes the image patterns
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <h3 className="font-medium">Get Results</h3>
                  <p className="text-sm text-muted-foreground">
                    See classification with confidence score
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
