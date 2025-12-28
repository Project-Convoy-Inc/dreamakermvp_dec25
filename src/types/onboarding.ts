export interface OnboardingState {
  sidekickAvatar: number | null;
  whatYouWant: string;
  visionDescription: string;
  currentStatus: string;
  uploadedMaterials: File[];
  userPhotos: string[];
  userDescription: string;
  generatedImageUrl: string | null;
  hasGeneratedImage: boolean;
  currentStep: number;
}

export const initialOnboardingState: OnboardingState = {
  sidekickAvatar: null,
  whatYouWant: '',
  visionDescription: '',
  currentStatus: '',
  uploadedMaterials: [],
  userPhotos: [],
  userDescription: '',
  generatedImageUrl: null,
  hasGeneratedImage: false,
  currentStep: 0,
};

export const AVATAR_OPTIONS = [
  { id: 1, emoji: '🦊', name: 'Fox' },
  { id: 2, emoji: '🦉', name: 'Owl' },
  { id: 3, emoji: '🐻', name: 'Bear' },
  { id: 4, emoji: '🦋', name: 'Butterfly' },
  { id: 5, emoji: '🐬', name: 'Dolphin' },
  { id: 6, emoji: '🦁', name: 'Lion' },
];

export const ROTATING_PROMPTS = [
  "What do you see?",
  "Who's with you?",
  "How do you feel?",
  "What sounds do you hear?",
  "What are you wearing?",
];
