/**
 * Robust localStorage utility with quota management and error handling
 */

interface StorageQuotaInfo {
  usage: number;
  quota: number;
  percentUsed: number;
}

const QUOTA_WARNING_THRESHOLD = 0.8; // 80%
const QUOTA_CRITICAL_THRESHOLD = 0.95; // 95%

/**
 * Get storage quota information
 */
export async function getStorageQuota(): Promise<StorageQuotaInfo | null> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      
      return {
        usage,
        quota,
        percentUsed: quota > 0 ? usage / quota : 0,
      };
    } catch (error) {
      console.error('Error estimating storage:', error);
      return null;
    }
  }
  return null;
}

/**
 * Check if storage quota is approaching limit
 */
export async function isStorageNearLimit(): Promise<boolean> {
  const quotaInfo = await getStorageQuota();
  if (!quotaInfo) return false;
  
  return quotaInfo.percentUsed >= QUOTA_WARNING_THRESHOLD;
}

/**
 * Safely set item in localStorage with quota checking
 */
export function safeSetItem(key: string, value: string): boolean {
  try {
    // Check if we're near quota before attempting to write
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    
    // Attempt to set the item
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'QuotaExceededError') {
        console.error('Storage quota exceeded:', key);
        handleQuotaExceeded();
      } else {
        console.error('Error setting localStorage item:', error);
      }
    }
    return false;
  }
}

/**
 * Safely get item from localStorage
 */
export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error getting localStorage item:', error);
    return null;
  }
}

/**
 * Safely remove item from localStorage
 */
export function safeRemoveItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing localStorage item:', error);
    return false;
  }
}

/**
 * Set item in localStorage with JSON serialization
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    return safeSetItem(key, serialized);
  } catch (error) {
    console.error('Error serializing value for storage:', error);
    return false;
  }
}

/**
 * Get item from localStorage with JSON deserialization
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const item = safeGetItem(key);
    if (item === null) return null;
    
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Error deserializing value from storage:', error);
    return null;
  }
}

/**
 * Handle quota exceeded by clearing old/unnecessary data
 */
function handleQuotaExceeded() {
  console.warn('Storage quota exceeded, attempting to free up space...');
  
  // List of keys that can be safely removed (caches, temporary data)
  const clearableKeys = [
    'dreamaker_cache_',
    'dreamaker_temp_',
  ];
  
  let clearedSpace = false;
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    
    // Remove clearable items
    if (clearableKeys.some(prefix => key.startsWith(prefix))) {
      localStorage.removeItem(key);
      clearedSpace = true;
      console.log('Cleared cached item:', key);
    }
  }
  
  if (!clearedSpace) {
    console.warn('Unable to free up storage space. User may need to clear browser data.');
    
    // Show user notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Storage Full', {
        body: 'Your Dreamaker data storage is full. Some features may not work properly.',
        icon: '/dreamaker-logo.png',
      });
    }
  }
}

/**
 * Clear all Dreamaker-related storage
 */
export function clearAllStorage(): void {
  const keys: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('dreamaker_')) {
      keys.push(key);
    }
  }
  
  keys.forEach(key => localStorage.removeItem(key));
  console.log(`Cleared ${keys.length} storage items`);
}

/**
 * Get all Dreamaker storage keys and their sizes
 */
export function getStorageDebugInfo(): Array<{ key: string; size: number }> {
  const info: Array<{ key: string; size: number }> = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('dreamaker_')) {
      const value = localStorage.getItem(key) || '';
      info.push({
        key,
        size: new Blob([value]).size,
      });
    }
  }
  
  return info.sort((a, b) => b.size - a.size);
}

/**
 * Monitor storage and warn user if approaching limit
 */
export async function monitorStorage(): Promise<void> {
  const quotaInfo = await getStorageQuota();
  
  if (!quotaInfo) return;
  
  if (quotaInfo.percentUsed >= QUOTA_CRITICAL_THRESHOLD) {
    console.error('Storage critically full:', quotaInfo);
  } else if (quotaInfo.percentUsed >= QUOTA_WARNING_THRESHOLD) {
    console.warn('Storage approaching limit:', quotaInfo);
  }
}

