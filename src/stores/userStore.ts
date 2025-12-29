import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'user' | 'admin';

interface UserProfile {
  name: string;
  email: string;
  role?: UserRole;
}

interface UserStore {
  profile: UserProfile | null;
  isOnboardingComplete: boolean;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
  setOnboardingComplete: (complete: boolean) => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => {
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
        hasRole: (role: UserRole | UserRole[]) => {
          const profile = get().profile;
          if (!profile || !profile.role) return false;
          
          if (Array.isArray(role)) {
            return role.includes(profile.role);
          }
          return profile.role === role;
        },
      };
    },
    {
      name: 'dreamaker_user_profile',
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            // Error handling for rehydration
          }
        };
      },
    }
  )
);
