import { create } from 'zustand';
import { Dream, TimeFrame, Domain, DreamStep } from '@/types/dream';

interface DreamStore {
  dreams: Dream[];
  addDream: (dream: Omit<Dream, 'id' | 'createdAt' | 'updatedAt' | 'steps' | 'partners' | 'progress'>) => string;
  addDreamWithSteps: (dream: Omit<Dream, 'id' | 'createdAt' | 'updatedAt' | 'steps' | 'partners' | 'progress'>, steps: Array<{ title: string }>) => string;
  updateDream: (id: string, updates: Partial<Dream>) => void;
  deleteDream: (id: string) => void;
  moveDream: (id: string, timeFrame: TimeFrame, domain: Domain) => void;
  addStep: (dreamId: string, step: Omit<DreamStep, 'id' | 'order'>) => void;
  addMultipleSteps: (dreamId: string, steps: Array<{ title: string }>) => void;
  toggleStep: (dreamId: string, stepId: string) => void;
  getDreamsByCell: (timeFrame: TimeFrame, domain: Domain) => Dream[];
  getDreamById: (id: string) => Dream | undefined;
  removePartnerFromAllDreams: (partnerId: string) => void;
}

// Sample dreams for demo
const sampleDreams: Dream[] = [
  {
    id: '1',
    title: 'Get promoted to Senior Developer',
    description: 'Advance my career by demonstrating leadership and technical excellence',
    timeFrame: 'short',
    domain: 'work',
    progress: 45,
    targetDate: '2024-12-31',
    steps: [
      { id: '1-1', title: 'Complete advanced certification', completed: true, order: 0 },
      { id: '1-2', title: 'Lead a major project', completed: false, order: 1 },
      { id: '1-3', title: 'Mentor junior developers', completed: false, order: 2 },
    ],
    partners: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Build emergency fund',
    description: 'Save 6 months of expenses for financial security',
    timeFrame: 'short',
    domain: 'wealth',
    progress: 60,
    targetDate: '2024-09-30',
    steps: [
      { id: '2-1', title: 'Set up automatic transfers', completed: true, order: 0 },
      { id: '2-2', title: 'Reach $5,000 milestone', completed: true, order: 1 },
      { id: '2-3', title: 'Reach $10,000 goal', completed: false, order: 2 },
    ],
    partners: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Run a marathon',
    description: 'Train and complete my first full marathon',
    timeFrame: 'mid',
    domain: 'health',
    progress: 25,
    targetDate: '2025-06-15',
    steps: [
      { id: '3-1', title: 'Complete 5K', completed: true, order: 0 },
      { id: '3-2', title: 'Complete 10K', completed: false, order: 1 },
      { id: '3-3', title: 'Complete half marathon', completed: false, order: 2 },
      { id: '3-4', title: 'Full marathon', completed: false, order: 3 },
    ],
    partners: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Start a family',
    description: 'Begin the journey of parenthood with my partner',
    timeFrame: 'mid',
    domain: 'family',
    progress: 10,
    steps: [
      { id: '4-1', title: 'Financial planning', completed: true, order: 0 },
      { id: '4-2', title: 'Health check-ups', completed: false, order: 1 },
    ],
    partners: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Achieve financial independence',
    description: 'Build wealth to have the freedom to work on passion projects',
    timeFrame: 'long',
    domain: 'wealth',
    progress: 15,
    steps: [
      { id: '5-1', title: 'Max out retirement accounts', completed: false, order: 0 },
      { id: '5-2', title: 'Build investment portfolio', completed: false, order: 1 },
    ],
    partners: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Develop daily meditation practice',
    description: 'Cultivate inner peace through consistent mindfulness',
    timeFrame: 'short',
    domain: 'spirituality',
    progress: 70,
    steps: [
      { id: '6-1', title: 'Meditate 5 min daily for a week', completed: true, order: 0 },
      { id: '6-2', title: 'Increase to 15 min daily', completed: true, order: 1 },
      { id: '6-3', title: 'Complete 30-day streak', completed: false, order: 2 },
    ],
    partners: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useDreamStore = create<DreamStore>((set, get) => ({
  dreams: sampleDreams,
  
  addDream: (dream) => {
    const id = crypto.randomUUID();
    const newDream: Dream = {
      ...dream,
      id,
      progress: 0,
      steps: [],
      partners: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ dreams: [...state.dreams, newDream] }));
    return id;
  },

  addDreamWithSteps: (dream, steps) => {
    const id = crypto.randomUUID();
    const dreamSteps: DreamStep[] = steps.map((step, index) => ({
      id: crypto.randomUUID(),
      title: step.title,
      completed: false,
      order: index,
    }));
    const newDream: Dream = {
      ...dream,
      id,
      progress: 0,
      steps: dreamSteps,
      partners: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ dreams: [...state.dreams, newDream] }));
    return id;
  },
  
  updateDream: (id, updates) => {
    set((state) => ({
      dreams: state.dreams.map((dream) =>
        dream.id === id
          ? { ...dream, ...updates, updatedAt: new Date().toISOString() }
          : dream
      ),
    }));
  },
  
  deleteDream: (id) => {
    set((state) => ({
      dreams: state.dreams.filter((dream) => dream.id !== id),
    }));
  },
  
  moveDream: (id, timeFrame, domain) => {
    set((state) => ({
      dreams: state.dreams.map((dream) =>
        dream.id === id
          ? { ...dream, timeFrame, domain, updatedAt: new Date().toISOString() }
          : dream
      ),
    }));
  },
  
  addStep: (dreamId, step) => {
    set((state) => ({
      dreams: state.dreams.map((dream) => {
        if (dream.id !== dreamId) return dream;
        const newStep: DreamStep = {
          ...step,
          id: crypto.randomUUID(),
          order: dream.steps.length,
        };
        return {
          ...dream,
          steps: [...dream.steps, newStep],
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },

  addMultipleSteps: (dreamId, steps) => {
    set((state) => ({
      dreams: state.dreams.map((dream) => {
        if (dream.id !== dreamId) return dream;
        const newSteps: DreamStep[] = steps.map((step, index) => ({
          id: crypto.randomUUID(),
          title: step.title,
          completed: false,
          order: dream.steps.length + index,
        }));
        return {
          ...dream,
          steps: [...dream.steps, ...newSteps],
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },
  
  toggleStep: (dreamId, stepId) => {
    set((state) => ({
      dreams: state.dreams.map((dream) => {
        if (dream.id !== dreamId) return dream;
        const updatedSteps = dream.steps.map((step) =>
          step.id === stepId ? { ...step, completed: !step.completed } : step
        );
        const completedCount = updatedSteps.filter((s) => s.completed).length;
        const progress = updatedSteps.length > 0 
          ? Math.round((completedCount / updatedSteps.length) * 100)
          : 0;
        return {
          ...dream,
          steps: updatedSteps,
          progress,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  },
  
  getDreamsByCell: (timeFrame, domain) => {
    return get().dreams.filter(
      (dream) => dream.timeFrame === timeFrame && dream.domain === domain
    );
  },

  getDreamById: (id) => {
    return get().dreams.find((dream) => dream.id === id);
  },

  removePartnerFromAllDreams: (partnerId) => {
    set((state) => ({
      dreams: state.dreams.map((dream) => ({
        ...dream,
        partners: dream.partners.filter((p) => p.id !== partnerId),
        updatedAt: new Date().toISOString(),
      })),
    }));
  },
}));
