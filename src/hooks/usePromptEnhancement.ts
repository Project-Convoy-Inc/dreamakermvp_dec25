import { useMemo } from 'react';
import { enhancePrompt, generateProgressMetadata } from '@/lib/prompt-enhancement';

interface UsePromptEnhancementParams {
  visionDescription: string;
  whatYouWant?: string;
  includeProgressTracking?: boolean;
}

/**
 * Hook for enhancing vision prompts with style and progress tracking
 * The enhancement happens automatically in the background
 */
export function usePromptEnhancement({
  visionDescription,
  whatYouWant,
  includeProgressTracking = true,
}: UsePromptEnhancementParams) {
  // Enhance the prompt automatically
  const enhancedPrompt = useMemo(() => {
    if (!visionDescription) {
      return null;
    }
    
    return enhancePrompt({
      visionDescription,
      whatYouWant,
      includeProgressTracking,
    });
  }, [visionDescription, whatYouWant, includeProgressTracking]);
  
  // Generate progress tracking metadata
  const progressMetadata = useMemo(() => {
    if (!visionDescription || !includeProgressTracking) {
      return null;
    }
    
    return generateProgressMetadata(visionDescription, whatYouWant);
  }, [visionDescription, whatYouWant, includeProgressTracking]);
  
  return {
    enhancedPrompt,
    progressMetadata,
    isEnhanced: !!enhancedPrompt,
  };
}

