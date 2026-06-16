import { useState, useEffect } from 'react';

export function useViewportWidth(): number {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    let frame = 0;
    let lastWidth = window.innerWidth;

    function onResize() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const w = window.innerWidth;
        if (w !== lastWidth) {
          lastWidth = w;
          setWidth(w);
        }
      });
    }

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frame);
    };
  }, []);

  return width;
}
