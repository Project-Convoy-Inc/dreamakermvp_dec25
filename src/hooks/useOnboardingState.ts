import { useState, useEffect, useCallback } from 'react';
import { OnboardingState, initialOnboardingState } from '@/types/onboarding';

const STORAGE_KEY = 'dreamaker_onboarding_state';

export function useOnboardingState() {
  const [state, setState] = useState<OnboardingState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Don't restore files from localStorage
        return { ...parsed, uploadedMaterials: [] };
      } catch {
        return initialOnboardingState;
      }
    }
    return initialOnboardingState;
  });

  useEffect(() => {
    // Save state without files (can't serialize File objects)
    const toSave = { ...state, uploadedMaterials: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state]);

  const updateState = useCallback((updates: Partial<OnboardingState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const nextStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setState(prev => ({ ...prev, currentStep: Math.max(0, prev.currentStep - 1) }));
  }, []);

  const clearState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialOnboardingState);
  }, []);

  return {
    state,
    updateState,
    goToStep,
    nextStep,
    prevStep,
    clearState,
  };
}
