/**
 * Development Bypass Utilities
 * 
 * Utilities for bypassing certain flows during development.
 * These should NEVER be used in production.
 */

import { safeRemoveItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';

export interface DevBypassConfig {
  skipOnboarding: boolean;
  isDev: boolean;
}

/**
 * Handles development bypass logic for skipping onboarding
 */
export function handleDevBypass(
  config: DevBypassConfig,
  callbacks: {
    clearOnboardingState: () => void;
    setTestProfile: () => void;
    markOnboardingComplete: () => void;
    navigateHome: () => void;
  }
): boolean {
  const { skipOnboarding, isDev } = config;
  
  if (!skipOnboarding || !isDev) {
    return false;
  }

  // Clear any existing onboarding state
  safeRemoveItem(STORAGE_KEYS.ONBOARDING_STATE);
  
  // Execute callbacks
  callbacks.clearOnboardingState();
  callbacks.setTestProfile();
  callbacks.markOnboardingComplete();
  callbacks.navigateHome();

  return true;
}

