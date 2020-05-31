import React from 'react';

export type ShortcutHandler = (e: KeyboardEvent) => true | void;

export default function useShortcuts(handler: ShortcutHandler) {
  React.useEffect(() => {
    const wrapper = (e: KeyboardEvent) => {
      const result = handler(e);
      if (result !== true) e.preventDefault();
    }
    document.addEventListener('keydown', wrapper);
    return () => document.removeEventListener('keydown', wrapper);
  }, [handler]);
}
