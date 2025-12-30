import { useState, useEffect, useCallback } from 'react';
import { OnboardingState, initialOnboardingState } from '@/types/onboarding';
import { getStorageItem, setStorageItem, safeRemoveItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';

export function useOnboardingState() {
  const [state, setState] = useState<OnboardingState>(() => {
    const saved = getStorageItem<OnboardingState>(STORAGE_KEYS.ONBOARDING_STATE);
    if (saved) {
      // Don't restore files from localStorage
      return { ...saved, uploadedMaterials: [] };
    }
    return initialOnboardingState;
  });

  useEffect(() => {
    // Save state without files (can't serialize File objects)
    const toSave = { ...state, uploadedMaterials: [] };
    setStorageItem(STORAGE_KEYS.ONBOARDING_STATE, toSave);
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
    safeRemoveItem(STORAGE_KEYS.ONBOARDING_STATE);
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
