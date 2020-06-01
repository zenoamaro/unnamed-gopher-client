import React from 'react';

export function useScrollRestoration<T extends HTMLDivElement>(
  scroll: number = 0,
  setScroll: (scrol: number) => void,
) {
  const $scroller = React.useRef<T>(null);

  React.useLayoutEffect(() => {
    if (!$scroller.current) return;
    $scroller.current.scrollTop = scroll ?? 0;
    return () => {
      if (!$scroller.current) return;
      setScroll($scroller.current.scrollTop);
    }
  }, []);

  return $scroller;
}
