import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

export function useContainerHeight(ref: React.RefObject<HTMLElement>) {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    let resizeObserver: ResizeObserver | null = null;
    
    // Debounced callback to handle resize events
    const debouncedCallback = debounce((entries: ResizeObserverEntry[]) => {
      if (!Array.isArray(entries) || !entries.length || !element) return;
      
      const observedHeight = entries[0].contentRect.height;
      if (observedHeight > 0) {
        setHeight(observedHeight);
      }
    }, 100); // 100ms debounce

    try {
      resizeObserver = new ResizeObserver((entries) => {
        // Use requestAnimationFrame to avoid ResizeObserver loop limit exceeded
        window.requestAnimationFrame(() => {
          debouncedCallback(entries);
        });
      });

      resizeObserver.observe(element);
    } catch (error) {
      console.error('ResizeObserver error:', error);
    }

    // Cleanup function
    return () => {
      if (resizeObserver) {
        try {
          debouncedCallback.cancel(); // Cancel any pending debounced calls
          resizeObserver.disconnect();
        } catch (error) {
          console.error('Error disconnecting ResizeObserver:', error);
        }
      }
    };
  }, [ref]); // Only re-run if ref changes

  return height;
}