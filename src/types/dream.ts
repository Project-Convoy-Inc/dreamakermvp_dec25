export type TimeFrame = 'short' | 'mid' | 'long';

export type Domain = 'work' | 'wealth' | 'family' | 'friends' | 'health' | 'spirituality' | 'interests';

export interface Dream {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  timeFrame: TimeFrame;
  domain: Domain;
  progress: number;
  targetDate?: string;
  steps: DreamStep[];
  partners: Partner[];
  createdAt: string;
  updatedAt: string;
}

export interface DreamStep {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  order: number;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const TIMEFRAMES: { key: TimeFrame; label: string; description: string }[] = [
  { key: 'short', label: 'Short-term', description: 'Within the month' },
  { key: 'mid', label: 'Mid-term', description: 'Less than a year' },
  { key: 'long', label: 'Long-term', description: '1 year+' },
];

export const DOMAINS: { key: Domain; label: string; icon: string; color: string }[] = [
  { key: 'work', label: 'Work', icon: 'Briefcase', color: 'domain-work' },
  { key: 'wealth', label: 'Wealth', icon: 'DollarSign', color: 'domain-wealth' },
  { key: 'family', label: 'Family', icon: 'Home', color: 'domain-family' },
  { key: 'friends', label: 'Friends & Relationships', icon: 'Users', color: 'domain-friends' },
  { key: 'health', label: 'Health & Wellness', icon: 'Heart', color: 'domain-health' },
  { key: 'spirituality', label: 'Spirituality', icon: 'Infinity', color: 'domain-spirituality' },
  { key: 'interests', label: 'Interests', icon: 'Palette', color: 'domain-interests' },
];
