import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudOff, RefreshCw, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getStorageItem, safeRemoveItem } from '@/lib/storage';
import { STORAGE_KEYS } from '@/constants/storage-keys';

interface SyncStatusProps {
  className?: string;
}

type SyncState = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

export function SyncStatus({ className }: SyncStatusProps) {
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingChanges, setPendingChanges] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (pendingChanges > 0) {
        triggerSync();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setSyncState('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for pending changes in localStorage
    checkPendingChanges();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingChanges]);

  const checkPendingChanges = () => {
    // Check storage for any pending sync items
    const pending = getStorageItem<string[]>(STORAGE_KEYS.PENDING_SYNC);
    if (pending) {
      setPendingChanges(pending.length || 0);
    }
  };

  const triggerSync = async () => {
    if (!isOnline || syncState === 'syncing') return;

    setSyncState('syncing');
    
    try {
      // Simulate sync operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear pending changes
      safeRemoveItem(STORAGE_KEYS.PENDING_SYNC);
      setPendingChanges(0);
      
      setSyncState('synced');
      setTimeout(() => setSyncState('idle'), 2000);
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncState('error');
      setTimeout(() => setSyncState('idle'), 3000);
    }
  };

  if (syncState === 'idle' && pendingChanges === 0 && isOnline) {
    return null;
  }

  const getIcon = () => {
    switch (syncState) {
      case 'syncing':
        return <RefreshCw className="w-3.5 h-3.5 animate-spin" />;
      case 'synced':
        return <Check className="w-3.5 h-3.5" />;
      case 'offline':
        return <CloudOff className="w-3.5 h-3.5" />;
      case 'error':
        return <Cloud className="w-3.5 h-3.5" />;
      default:
        return <Cloud className="w-3.5 h-3.5" />;
    }
  };

  const getMessage = () => {
    switch (syncState) {
      case 'syncing':
        return 'Syncing...';
      case 'synced':
        return 'All synced';
      case 'offline':
        return `${pendingChanges} pending`;
      case 'error':
        return 'Sync failed';
      default:
        return pendingChanges > 0 ? `${pendingChanges} pending` : 'Synced';
    }
  };

  const getColor = () => {
    switch (syncState) {
      case 'syncing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'synced':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'offline':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-muted-foreground bg-muted/50 border-border';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          'fixed bottom-24 md:bottom-6 right-4 z-40 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm border backdrop-blur-sm transition-colors cursor-pointer',
          getColor(),
          className
        )}
        onClick={isOnline && pendingChanges > 0 ? triggerSync : undefined}
      >
        {getIcon()}
        <span className="font-medium">{getMessage()}</span>
      </motion.div>
    </AnimatePresence>
  );
}

