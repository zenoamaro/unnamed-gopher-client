import React from 'react';

export function useScrollRestoration<T extends HTMLDivElement>(
  scroll: number = 0,
  setScroll: (scroll: number) => void,
  restoreDeps: readonly any[] = [],
) {
  const $scroller = React.useRef<T>(null);

  React.useLayoutEffect(() => {
    if (!$scroller.current) return;
    $scroller.current.scrollTop = scroll ?? 0;
  }, restoreDeps);

  React.useLayoutEffect(() => {
    return () => {
      if (!$scroller.current) return;
      setScroll($scroller.current.scrollTop);
    }
  }, []);

  return $scroller;
}
