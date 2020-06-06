import React from 'react';

export type VisitEvent = (
  MouseEvent |
  KeyboardEvent |
  React.MouseEvent |
  React.KeyboardEvent
);

export default function visitModeFromEvent(e: VisitEvent) {
  return (
    e.metaKey && e.shiftKey? 'foreground-tab' :
    e.metaKey? 'background-tab' :
    e.altKey? 'save-to-disk' :
    e.shiftKey? 'replace' :
    'push'
  );
}
