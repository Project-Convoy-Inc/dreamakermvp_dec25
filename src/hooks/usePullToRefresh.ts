import { useEffect, useRef, useState } from 'react';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPull?: number;
  resistance?: number;
}

export function usePullToRefresh(options: PullToRefreshOptions) {
  const {
    onRefresh,
    threshold = 80,
    maxPull = 120,
    resistance = 2.5,
  } = options;

  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const touchStartY = useRef(0);
  const scrollY = useRef(0);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only start pull if at top of page
      if (window.scrollY === 0) {
        touchStartY.current = e.touches[0].clientY;
        scrollY.current = window.scrollY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isRefreshing) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY.current;

      // Only pull down when at top of page
      if (window.scrollY === 0 && diff > 0) {
        const pull = Math.min(diff / resistance, maxPull);
        setPullDistance(pull);
        setIsPulling(pull > 0);

        // Prevent scrolling while pulling
        if (pull > 5) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } catch (error) {
          console.error('Refresh error:', error);
        } finally {
          setIsRefreshing(false);
        }
      }

      setIsPulling(false);
      setPullDistance(0);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh, threshold, maxPull, resistance, pullDistance, isRefreshing]);

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    pullProgress: Math.min((pullDistance / threshold) * 100, 100),
  };
}

