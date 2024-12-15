import { useState, useEffect, RefObject } from 'react';

export function useContainerHeight(containerRef: RefObject<HTMLDivElement>) {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateHeight = () => {
      if (containerRef.current && containerRef.current.offsetParent !== null) {
        const viewportHeight = window.innerHeight;
        const maxHeight = Math.floor(viewportHeight * 0.6);
        setHeight(maxHeight);
      }
    };

    // Initial height
    updateHeight();

    // Use RAF to avoid ResizeObserver loop limit exceeded
    let rafId: number;
    const debouncedResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateHeight);
    };

    window.addEventListener('resize', debouncedResize, { passive: true });

    return () => {
      window.removeEventListener('resize', debouncedResize);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);

  return height;
}