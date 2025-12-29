import { useEffect, useRef, useState } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // Minimum distance in pixels to trigger swipe
  restraint?: number; // Maximum perpendicular movement allowed
  allowedTime?: number; // Maximum time allowed for swipe
}

export function useSwipeGesture(options: SwipeGestureOptions) {
  const {
    onSwipeLeft,
    onSwipeRight,
    threshold = 100,
    restraint = 100,
    allowedTime = 300,
  } = options;

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touchObj = e.changedTouches[0];
      touchStartX.current = touchObj.pageX;
      touchStartY.current = touchObj.pageY;
      touchStartTime.current = Date.now();
      setIsSwiping(false);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchObj = e.changedTouches[0];
      const distX = touchObj.pageX - touchStartX.current;
      
      if (Math.abs(distX) > 10) {
        setIsSwiping(true);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchObj = e.changedTouches[0];
      const distX = touchObj.pageX - touchStartX.current;
      const distY = touchObj.pageY - touchStartY.current;
      const elapsedTime = Date.now() - touchStartTime.current;

      // Check if this is a valid swipe
      if (elapsedTime <= allowedTime && Math.abs(distY) <= restraint) {
        if (distX >= threshold && onSwipeRight) {
          onSwipeRight();
        } else if (distX <= -threshold && onSwipeLeft) {
          onSwipeLeft();
        }
      }

      setIsSwiping(false);
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, threshold, restraint, allowedTime]);

  return { isSwiping };
}

