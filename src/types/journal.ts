export type JournalCategory = 'win' | 'learning' | 'challenge' | 'reflection' | 'milestone' | 'other';

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: JournalCategory;
  dreamId?: string;
  imageUrl?: string;
  isAutomatic: boolean;
  createdAt: Date;
}

export const JOURNAL_CATEGORIES = [
  { key: 'win' as JournalCategory, label: 'Win', emoji: '🏆' },
  { key: 'learning' as JournalCategory, label: 'Learning', emoji: '📚' },
  { key: 'challenge' as JournalCategory, label: 'Challenge', emoji: '💪' },
  { key: 'reflection' as JournalCategory, label: 'Reflection', emoji: '🤔' },
  { key: 'milestone' as JournalCategory, label: 'Milestone', emoji: '🎯' },
  { key: 'other' as JournalCategory, label: 'Other', emoji: '📝' },
];

export const getCategoryInfo = (category: JournalCategory) => {
  return JOURNAL_CATEGORIES.find(c => c.key === category) || JOURNAL_CATEGORIES[5];
};
