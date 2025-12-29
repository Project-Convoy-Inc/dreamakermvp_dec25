import { ReactNode } from 'react';
import { RefreshCw } from 'lucide-react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { motion, AnimatePresence } from 'framer-motion';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const { isPulling, isRefreshing, pullDistance, pullProgress } = usePullToRefresh({
    onRefresh,
  });

  return (
    <div className="relative">
      <AnimatePresence>
        {(isPulling || isRefreshing) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-40"
            style={{
              transform: `translate(-50%, ${pullDistance}px)`,
            }}
          >
            <div className="bg-card border border-border rounded-full p-3 shadow-lg">
              <RefreshCw
                className={`w-5 h-5 text-primary ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
                style={{
                  transform: isPulling && !isRefreshing
                    ? `rotate(${pullProgress * 3.6}deg)`
                    : undefined,
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

