/**
 * Prompt Enhancement Service
 * Enhances user vision descriptions with style instructions and progress tracking elements
 */

const DEFAULT_STYLE = "photorealistic cinematic portrait, the lighting is natural and slightly underexposed, The image should look like real analog film photography, not CGI, not 3D, not cartoon, not glossy.";

const PROGRESS_TRACKING_INSTRUCTION = "Include visible elements that can evolve to show achievement and progress over time, such as objects that can gain details, markers that can fill in, or visual indicators of milestones being reached.";

interface EnhancePromptParams {
  visionDescription: string;
  whatYouWant?: string;
  includeProgressTracking?: boolean;
}

interface EnhancedPrompt {
  original: string;
  enhanced: string;
  styleApplied: string;
  progressTrackingEnabled: boolean;
}

/**
 * Enhances a user's vision description with styling and progress tracking instructions
 * This happens automatically in the background to improve image generation quality
 */
export function enhancePrompt({
  visionDescription,
  whatYouWant,
  includeProgressTracking = true,
}: EnhancePromptParams): EnhancedPrompt {
  // Build the base prompt from user input
  const promptParts: string[] = [];
  
  if (whatYouWant) {
    promptParts.push(`Goal: ${whatYouWant}.`);
  }
  
  if (visionDescription) {
    promptParts.push(visionDescription);
  }
  
  const originalPrompt = promptParts.join(' ');
  
  // Build enhanced prompt with style and progress tracking
  const enhancedParts: string[] = [originalPrompt];
  
  // Add style instructions
  enhancedParts.push(DEFAULT_STYLE);
  
  // Add progress tracking instructions if enabled
  if (includeProgressTracking) {
    enhancedParts.push(PROGRESS_TRACKING_INSTRUCTION);
  }
  
  const enhancedPrompt = enhancedParts.join(' ');
  
  return {
    original: originalPrompt,
    enhanced: enhancedPrompt,
    styleApplied: DEFAULT_STYLE,
    progressTrackingEnabled: includeProgressTracking,
  };
}

/**
 * Analyzes a vision description to extract trackable elements
 * These can be used later for progressive image updates
 */
export function extractTrackableElements(visionDescription: string): string[] {
  const trackableElements: string[] = [];
  const lowerDesc = visionDescription.toLowerCase();
  
  // Common trackable patterns
  const patterns = [
    { regex: /book[s]?/gi, element: 'books' },
    { regex: /step[s]?|milestone[s]?/gi, element: 'milestones' },
    { regex: /goal[s]?|target[s]?/gi, element: 'goals' },
    { regex: /project[s]?/gi, element: 'projects' },
    { regex: /skill[s]?|ability|abilities/gi, element: 'skills' },
    { regex: /certificate[s]?|credential[s]?/gi, element: 'certificates' },
    { regex: /badge[s]?|award[s]?/gi, element: 'achievements' },
    { regex: /people|person[s]?|team/gi, element: 'people' },
    { regex: /place[s]?|location[s]?/gi, element: 'locations' },
  ];
  
  patterns.forEach(({ regex, element }) => {
    if (regex.test(lowerDesc)) {
      trackableElements.push(element);
    }
  });
  
  // Remove duplicates
  return Array.from(new Set(trackableElements));
}

/**
 * Generates progress tracking metadata for an image based on the vision description
 */
export function generateProgressMetadata(
  visionDescription: string,
  whatYouWant?: string
): {
  trackableElements: Array<{
    element: string;
    suggestedUpdates: string[];
  }>;
} {
  const elements = extractTrackableElements(visionDescription);
  
  const trackableElements = elements.map(element => {
    let suggestedUpdates: string[] = [];
    
    // Provide context-specific update suggestions
    switch (element) {
      case 'books':
        suggestedUpdates = [
          'Add specific book titles as you read them',
          'Change book colors when completed',
          'Add bookmarks to show current progress',
        ];
        break;
      case 'milestones':
        suggestedUpdates = [
          'Fill in milestone markers as you achieve them',
          'Add dates or checkmarks to completed milestones',
          'Highlight the current milestone in progress',
        ];
        break;
      case 'goals':
        suggestedUpdates = [
          'Mark goals as complete with visual indicators',
          'Add progress bars or percentage completion',
          'Update goal statements as they evolve',
        ];
        break;
      case 'projects':
        suggestedUpdates = [
          'Show project completion stages',
          'Add visual elements representing project deliverables',
          'Update project status indicators',
        ];
        break;
      case 'skills':
        suggestedUpdates = [
          'Add skill level indicators (beginner to expert)',
          'Show skill badges or certifications earned',
          'Visualize skill progression over time',
        ];
        break;
      case 'certificates':
      case 'achievements':
        suggestedUpdates = [
          'Add new certificates/badges as you earn them',
          'Display certificate details and dates',
          'Organize by importance or recency',
        ];
        break;
      case 'people':
        suggestedUpdates = [
          'Add more people as your network grows',
          'Update group composition as relationships develop',
          'Show connections or interactions between people',
        ];
        break;
      case 'locations':
        suggestedUpdates = [
          'Add new locations as you reach them',
          'Update location details as plans solidify',
          'Show journey or path between locations',
        ];
        break;
      default:
        suggestedUpdates = [
          `Update ${element} as you make progress`,
          `Add details to ${element} over time`,
          `Mark completed ${element} visually`,
        ];
    }
    
    return {
      element,
      suggestedUpdates,
    };
  });
  
  return { trackableElements };
}

