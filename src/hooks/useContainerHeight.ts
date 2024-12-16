import { useEffect, useState } from 'react';

export function useContainerHeight(ref: React.RefObject<HTMLElement>) {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    let resizeObserver: ResizeObserver | null = null;

    try {
      resizeObserver = new ResizeObserver((entries) => {
        // Use requestAnimationFrame to avoid ResizeObserver loop limit exceeded
        window.requestAnimationFrame(() => {
          if (!Array.isArray(entries) || !entries.length || !element) return;
          
          const observedHeight = entries[0].contentRect.height;
          if (observedHeight > 0) {
            setHeight(observedHeight);
          }
        });
      });

      resizeObserver.observe(element);
    } catch (error) {
      console.error('ResizeObserver error:', error);
    }

    return () => {
      if (resizeObserver) {
        try {
          resizeObserver.disconnect();
        } catch (error) {
          console.error('Error disconnecting ResizeObserver:', error);
        }
      }
    };
  }, [ref]);

  return height;
}