/**
 * Types for Progressive Image Enhancement and Progress Tracking
 */

export interface TrackableElement {
  element: string; // e.g., "books on shelf"
  currentState: string; // e.g., "3 books with titles, 2 marked as read"
  progressTriggers: string[]; // e.g., ["book_read", "milestone_reached"]
  suggestedUpdates: string[]; // Suggested changes for this element
}

export interface ImageEnhancement {
  timestamp: string;
  change: string; // Description of what was changed
  prompt: string; // Prompt used for the enhancement
  imageUrl: string; // URL of the enhanced image
  triggeredBy?: 'user' | 'system'; // Who initiated the enhancement
}

export interface ProgressImageMetadata {
  baseImageUrl: string;
  trackableElements: TrackableElement[];
  enhancementHistory: ImageEnhancement[];
  lastSuggestionDate?: string; // When we last suggested an update
  nextSuggestionDate?: string; // When to suggest next update
}

export interface ProgressSuggestion {
  id: string;
  dreamId: string;
  title: string;
  description: string;
  suggestedChanges: string[];
  createdAt: string;
  dismissed: boolean;
  applied: boolean;
}

export interface ProgressTrigger {
  type: 'step_completed' | 'milestone_reached' | 'time_elapsed' | 'manual';
  data: Record<string, any>;
  timestamp: string;
}

/**
 * Determines if a dream should suggest an image update based on progress
 */
export function shouldSuggestUpdate(
  metadata: ProgressImageMetadata,
  progress: number,
  lastProgressUpdate?: string
): boolean {
  // If no base image, no need to suggest update
  if (!metadata.baseImageUrl) {
    return false;
  }

  // Don't suggest too frequently (at least 7 days between suggestions)
  if (metadata.lastSuggestionDate) {
    const daysSinceLastSuggestion = 
      (Date.now() - new Date(metadata.lastSuggestionDate).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastSuggestion < 7) {
      return false;
    }
  }

  // Suggest if progress has increased significantly (>10%)
  const lastEnhancement = metadata.enhancementHistory[metadata.enhancementHistory.length - 1];
  if (lastEnhancement && lastProgressUpdate) {
    // Logic for comparing progress would go here
    // For now, suggest if there's any trackable element
    return metadata.trackableElements.length > 0;
  }

  // Suggest if there are trackable elements and this is the first enhancement
  return metadata.trackableElements.length > 0 && metadata.enhancementHistory.length === 0;
}

/**
 * Generate a suggestion message based on dream progress
 */
export function generateSuggestionMessage(
  metadata: ProgressImageMetadata,
  progress: number
): string {
  const elements = metadata.trackableElements;
  
  if (elements.length === 0) {
    return "You've made progress! Want to update your vision image to reflect your journey?";
  }

  const primaryElement = elements[0];
  
  if (primaryElement.element === 'books') {
    return "You've been making progress! Want to update your vision image to show the books you've completed?";
  }
  
  if (primaryElement.element === 'milestones') {
    return "You've reached milestones! Want to update your vision to show what you've achieved?";
  }
  
  if (primaryElement.element === 'goals') {
    return "Your goals are progressing! Want to update your vision image to reflect your achievements?";
  }

  return `Your ${primaryElement.element} have evolved! Want to update your vision image?`;
}

