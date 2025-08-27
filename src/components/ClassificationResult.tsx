import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Palette, Bot } from 'lucide-react';

interface ClassificationResultProps {
  result: {
    label: string;
    confidence: number;
  } | null;
  isLoading: boolean;
}

export function ClassificationResult({ result, isLoading }: ClassificationResultProps) {
  if (isLoading) {
    return (
      <Card className="p-8 bg-gradient-card shadow-elegant">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Analyzing artwork...</p>
        </div>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  const isRealArt = result.label.toLowerCase().includes('real');
  const confidencePercentage = Math.round(result.confidence * 100);

  return (
    <Card className="p-8 bg-gradient-card shadow-elegant">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          {isRealArt ? (
            <div className="p-4 rounded-full bg-real-art/10">
              <Palette className="h-12 w-12 text-real-art" />
            </div>
          ) : (
            <div className="p-4 rounded-full bg-ai-art/10">
              <Bot className="h-12 w-12 text-ai-art" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Badge 
            variant={isRealArt ? "default" : "secondary"} 
            className={`text-lg px-4 py-2 ${
              isRealArt 
                ? 'bg-real-art hover:bg-real-art/90 text-real-art-foreground' 
                : 'bg-ai-art hover:bg-ai-art/90 text-ai-art-foreground'
            }`}
          >
            {isRealArt ? '🎨 Real Art' : '🤖 AI Art'}
          </Badge>
          
          <h3 className="text-2xl font-bold">
            {isRealArt ? 'Human-Created Artwork' : 'AI-Generated Image'}
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Confidence</span>
            <span className="text-sm font-bold">{confidencePercentage}%</span>
          </div>
          <Progress 
            value={confidencePercentage} 
            className="h-3"
            style={{
              ['--progress-background' as any]: isRealArt 
                ? 'hsl(var(--real-art))' 
                : 'hsl(var(--ai-art))'
            }}
          />
        </div>

        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          {isRealArt 
            ? 'This appears to be traditional artwork created by human hands, showing the unique characteristics of human creativity.'
            : 'This image shows patterns typical of AI-generated content, with telltale signs of artificial creation.'
          }
        </p>
      </div>
    </Card>
  );
}