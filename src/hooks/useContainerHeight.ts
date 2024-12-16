import { useState, useEffect, RefObject } from 'react';

export function useContainerHeight(containerRef: RefObject<HTMLDivElement>) {
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const updateHeight = () => {
      const viewportHeight = window.innerHeight;
      const headerHeight = 80; // Approximate header height
      const padding = 32; // 2rem padding
      const maxHeight = viewportHeight - headerHeight - padding;
      setHeight(maxHeight);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return height;
}