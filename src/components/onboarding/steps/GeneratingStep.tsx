import { useEffect, useState } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { generateImageWithWebhook } from '@/lib/webhooks';

interface GeneratingStepProps {
  onComplete: (imageUrl: string) => void;
  whatYouWant?: string;
  visionDescription?: string;
  userPhotos?: string[];
}

export function GeneratingStep({ 
  onComplete, 
  whatYouWant, 
  visionDescription, 
  userPhotos 
}: GeneratingStepProps) {
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generateImage = async () => {
      setError(null);
      setIsGenerating(true);

      // Build prompt from onboarding context
      const promptParts = [];
      if (whatYouWant) {
        promptParts.push(`Dream: ${whatYouWant}`);
      }
      if (visionDescription) {
        promptParts.push(`Vision: ${visionDescription}`);
      }
      
      const prompt = promptParts.length > 0 
        ? promptParts.join('. ') 
        : 'A beautiful inspiring vision of success and achievement';

      try {
        const imageUrl = await generateImageWithWebhook({
          prompt,
          referenceImages: userPhotos, // User photos for likeness
        });
        onComplete(imageUrl);
      } catch (err) {
        console.error('Image generation failed:', err);
        setError('Failed to generate your vision image. Please try again.');
        setIsGenerating(false);
      }
    };

    generateImage();
  }, [onComplete, whatYouWant, visionDescription, userPhotos]);

  const handleRetry = () => {
    setError(null);
    setIsGenerating(true);
    
    const promptParts = [];
    if (whatYouWant) {
      promptParts.push(`Dream: ${whatYouWant}`);
    }
    if (visionDescription) {
      promptParts.push(`Vision: ${visionDescription}`);
    }
    
    const prompt = promptParts.length > 0 
      ? promptParts.join('. ') 
      : 'A beautiful inspiring vision of success and achievement';

    generateImageWithWebhook({
      prompt,
      referenceImages: userPhotos,
    })
      .then(onComplete)
      .catch((err) => {
        console.error('Image generation retry failed:', err);
        setError('Failed to generate your vision image. Please try again.');
        setIsGenerating(false);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-center px-6"
    >
      <div className="text-center">
        {error ? (
          <>
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Something went wrong
            </h1>

            <p className="text-muted-foreground mb-8 max-w-md">
              {error}
            </p>

            <Button onClick={handleRetry} size="lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </>
        ) : (
          <>
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="absolute inset-0 bg-primary/20 blur-2xl animate-pulse rounded-full" />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-primary" />
              </motion.div>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Bringing your vision to life...
            </h1>

            <p className="text-muted-foreground">
              This usually takes 1-2 minutes
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}