/**
 * Image Progress Tracking Service
 * Handles progressive enhancement of vision images based on user progress
 */

import { Dream } from '@/types/dream';
import {
  ProgressImageMetadata,
  ProgressSuggestion,
  TrackableElement,
  ImageEnhancement,
  shouldSuggestUpdate,
  generateSuggestionMessage,
} from '@/types/progress-tracking';
import { enhancePrompt, generateProgressMetadata } from './prompt-enhancement';
import { generateImageWithWebhook } from './webhooks';

/**
 * Initialize progress tracking metadata for a new dream image
 */
export function initializeProgressMetadata(
  imageUrl: string,
  visionDescription: string,
  whatYouWant?: string
): ProgressImageMetadata {
  const metadata = generateProgressMetadata(visionDescription, whatYouWant);
  
  return {
    baseImageUrl: imageUrl,
    trackableElements: metadata.trackableElements.map(item => ({
      element: item.element,
      currentState: 'initial',
      progressTriggers: [],
      suggestedUpdates: item.suggestedUpdates,
    })),
    enhancementHistory: [],
    lastSuggestionDate: undefined,
    nextSuggestionDate: undefined,
  };
}

/**
 * Check if a dream needs a progress suggestion
 */
export function checkForProgressSuggestion(dream: Dream): ProgressSuggestion | null {
  if (!dream.progressImageMetadata || !dream.imageUrl) {
    return null;
  }

  // Check if we should suggest an update
  const shouldSuggest = shouldSuggestUpdate(
    dream.progressImageMetadata,
    dream.progress,
    dream.updatedAt
  );

  if (!shouldSuggest) {
    return null;
  }

  // Generate suggestion
  const message = generateSuggestionMessage(dream.progressImageMetadata, dream.progress);
  
  const suggestedChanges = dream.progressImageMetadata.trackableElements
    .flatMap(element => element.suggestedUpdates)
    .slice(0, 3); // Limit to top 3 suggestions

  return {
    id: `suggestion-${dream.id}-${Date.now()}`,
    dreamId: dream.id,
    title: 'Update Your Vision Image',
    description: message,
    suggestedChanges,
    createdAt: new Date().toISOString(),
    dismissed: false,
    applied: false,
  };
}

/**
 * Update the image with progress changes
 */
export async function updateImageWithProgress(
  dream: Dream,
  userChanges: string,
  triggeredBy: 'user' | 'system' = 'user'
): Promise<{
  imageUrl: string;
  updatedMetadata: ProgressImageMetadata;
}> {
  if (!dream.progressImageMetadata) {
    throw new Error('Dream does not have progress tracking metadata');
  }

  // Build enhancement prompt
  const enhancementPrompt = buildEnhancementPrompt(
    dream.description,
    dream.title,
    userChanges,
    dream.progressImageMetadata
  );

  // Generate new image
  const imageUrl = await generateImageWithWebhook({
    prompt: enhancementPrompt,
  });

  // Update metadata
  const enhancement: ImageEnhancement = {
    timestamp: new Date().toISOString(),
    change: userChanges,
    prompt: enhancementPrompt,
    imageUrl,
    triggeredBy,
  };

  const updatedMetadata: ProgressImageMetadata = {
    ...dream.progressImageMetadata,
    enhancementHistory: [...dream.progressImageMetadata.enhancementHistory, enhancement],
    lastSuggestionDate: new Date().toISOString(),
  };

  return {
    imageUrl,
    updatedMetadata,
  };
}

/**
 * Build an enhancement prompt for image updates
 */
function buildEnhancementPrompt(
  originalDescription: string,
  title: string,
  userChanges: string,
  metadata: ProgressImageMetadata
): string {
  const parts: string[] = [];

  // Start with the original vision
  parts.push(`Original vision: ${title}. ${originalDescription}`);

  // Add change instructions
  parts.push(`Update the image to show progress: ${userChanges}`);

  // Include enhancement history context (last 2 changes)
  const recentHistory = metadata.enhancementHistory.slice(-2);
  if (recentHistory.length > 0) {
    parts.push(
      'Previous changes made: ' +
        recentHistory.map(h => h.change).join(', ')
    );
  }

  // Add style instructions (same as original)
  const enhanced = enhancePrompt({
    visionDescription: parts.join('. '),
    includeProgressTracking: false, // Don't add progress tracking to updates
  });

  return enhanced.enhanced;
}

/**
 * Update trackable element state
 */
export function updateTrackableElementState(
  metadata: ProgressImageMetadata,
  elementName: string,
  newState: string
): ProgressImageMetadata {
  const updatedElements = metadata.trackableElements.map(element => {
    if (element.element === elementName) {
      return {
        ...element,
        currentState: newState,
      };
    }
    return element;
  });

  return {
    ...metadata,
    trackableElements: updatedElements,
  };
}

/**
 * Get suggested changes for a dream based on its progress
 */
export function getSuggestedChanges(dream: Dream): string[] {
  if (!dream.progressImageMetadata) {
    return [];
  }

  const suggestions: string[] = [];

  // Check completed steps
  const completedSteps = dream.steps.filter(step => step.completed).length;
  const totalSteps = dream.steps.length;

  if (completedSteps > 0 && totalSteps > 0) {
    suggestions.push(
      `Show ${completedSteps} of ${totalSteps} milestones completed`
    );
  }

  // Check progress percentage
  if (dream.progress > 0) {
    suggestions.push(
      `Add visual indicator showing ${dream.progress}% progress`
    );
  }

  // Add element-specific suggestions
  dream.progressImageMetadata.trackableElements.forEach(element => {
    if (element.suggestedUpdates.length > 0) {
      suggestions.push(element.suggestedUpdates[0]);
    }
  });

  return suggestions.slice(0, 5); // Limit to 5 suggestions
}

/**
 * Mark a suggestion as dismissed
 */
export function dismissSuggestion(
  metadata: ProgressImageMetadata
): ProgressImageMetadata {
  return {
    ...metadata,
    lastSuggestionDate: new Date().toISOString(),
    nextSuggestionDate: new Date(
      Date.now() + 14 * 24 * 60 * 60 * 1000 // 14 days from now
    ).toISOString(),
  };
}

