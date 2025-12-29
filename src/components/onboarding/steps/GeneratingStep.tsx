import { useEffect, useState } from 'react';
import { Sparkles, AlertCircle, LogOut, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { generateImageWithWebhook } from '@/lib/webhooks';
import { enhancePrompt } from '@/lib/prompt-enhancement';

interface GeneratingStepProps {
  onComplete: (imageUrl: string) => void;
  onSkip: () => void;
  onSaveAndExit: () => void;
  whatYouWant?: string;
  visionDescription?: string;
  userPhotos?: string[];
}

export function GeneratingStep({ 
  onComplete,
  onSkip,
  onSaveAndExit,
  whatYouWant, 
  visionDescription, 
  userPhotos 
}: GeneratingStepProps) {
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [showSkipOption, setShowSkipOption] = useState(false);

  useEffect(() => {
    // Show skip option after 30 seconds
    const skipTimer = setTimeout(() => {
      setShowSkipOption(true);
    }, 30000);

    const generateImage = async () => {
      setError(null);
      setIsGenerating(true);

      // Enhance prompt automatically in the background
      let prompt: string;
      
      if (visionDescription || whatYouWant) {
        const enhanced = enhancePrompt({
          visionDescription: visionDescription || '',
          whatYouWant,
          includeProgressTracking: true,
        });
        prompt = enhanced.enhanced;
        console.log('Enhanced prompt applied:', enhanced.styleApplied);
      } else {
        prompt = 'A beautiful inspiring vision of success and achievement';
      }

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

    return () => clearTimeout(skipTimer);
  }, [onComplete, whatYouWant, visionDescription, userPhotos]);

  const handleRetry = () => {
    setError(null);
    setIsGenerating(true);
    setShowSkipOption(false);
    
    // Reset skip timer
    setTimeout(() => {
      setShowSkipOption(true);
    }, 30000);
    
    // Enhance prompt automatically in the background
    let prompt: string;
    
    if (visionDescription || whatYouWant) {
      const enhanced = enhancePrompt({
        visionDescription: visionDescription || '',
        whatYouWant,
        includeProgressTracking: true,
      });
      prompt = enhanced.enhanced;
    } else {
      prompt = 'A beautiful inspiring vision of success and achievement';
    }

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

            <div className="flex flex-col items-center gap-3">
              <Button onClick={handleRetry} size="lg">
                <Sparkles className="w-5 h-5 mr-2" />
                Try Again
              </Button>
              
              <div className="flex gap-2">
                <Button onClick={onSkip} variant="outline" size="sm">
                  <SkipForward className="w-4 h-4 mr-2" />
                  Skip for now
                </Button>
                <Button onClick={onSaveAndExit} variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Save & Exit
                </Button>
              </div>
            </div>
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

            <p className="text-muted-foreground mb-2">
              This usually takes 1-2 minutes
            </p>

            <p className="text-sm text-muted-foreground/80 max-w-md mx-auto mb-6">
              We're creating your base vision image with elements you can update as you make progress
            </p>

            {showSkipOption && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-2 mt-4"
              >
                <p className="text-sm text-muted-foreground mb-2">Taking longer than expected?</p>
                <div className="flex gap-2">
                  <Button onClick={onSkip} variant="outline" size="sm">
                    <SkipForward className="w-4 h-4 mr-2" />
                    Skip image generation
                  </Button>
                  <Button onClick={onSaveAndExit} variant="ghost" size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    Save & Exit
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}