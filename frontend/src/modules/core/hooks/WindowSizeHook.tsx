import React from 'react';

type WindowSize = {
  width: number;
  height: number;
};

export function useWindowSize() {
  const [size, setSize] = React.useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  React.useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
