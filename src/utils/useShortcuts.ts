import React from 'react';

export type ShortcutHandler = (e: KeyboardEvent) => false | void;

export default function useShortcuts(handler: ShortcutHandler) {
  React.useEffect(() => {
    const wrapper = (e: KeyboardEvent) => {
      if (isProtectedInputEvent(e)) return;
      if (handler(e) !== false) e.preventDefault();
    }

    document.addEventListener('keydown', wrapper);
    return () => document.removeEventListener('keydown', wrapper);
  }, [handler]);
}

export function isProtectedInputEvent(e: KeyboardEvent) {
  const target = e.target as HTMLElement;

  if (target.tagName === 'INPUT') return (
    (e.key.startsWith('Arrow')) ||
    (e.metaKey && ['AZXCV'].includes(e.key))
  );

  return false;
}
