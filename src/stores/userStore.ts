import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
  name: string;
  email: string;
}

interface UserStore {
  profile: UserProfile | null;
  isOnboardingComplete: boolean;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
  setOnboardingComplete: (complete: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'userStore.ts:18',message:'userStore initialization start',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      return {
        profile: null,
        isOnboardingComplete: false,
        setProfile: (profile) => set({ profile }),
        updateProfile: (updates) =>
          set((state) => ({
            profile: state.profile ? { ...state.profile, ...updates } : null,
          })),
        clearProfile: () => set({ profile: null, isOnboardingComplete: false }),
        setOnboardingComplete: (complete) => set({ isOnboardingComplete: complete }),
      };
    },
    {
      name: 'dreamaker_user_profile',
      onRehydrateStorage: () => {
        // #region agent log
        fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'userStore.ts:32',message:'userStore - starting rehydration',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        return (state, error) => {
          // #region agent log
          fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'userStore.ts:35',message:'userStore - rehydration complete',data:{hasState:!!state,hasError:!!error,hasProfile:!!state?.profile,isOnboardingComplete:state?.isOnboardingComplete},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
          // #endregion
          if (error) {
            // #region agent log
            fetch('http://127.0.0.1:7243/ingest/feb1086c-34ad-4765-afda-bd41b3f8dda0',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'userStore.ts:38',message:'ERROR: userStore rehydration error',data:{error:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
          }
        };
      },
    }
  )
);
