import React from 'react';
import {Tab, Page, VisitMode} from 'core';
import {remoteAction} from 'utils/remoteState';
import {DetectRenderer} from 'renderers'

export default function PageView(p: {
  tab: Tab,
  page: Page,
  visitUrl(url: string, mode?: VisitMode): void,
}) {
  const {tab, page, visitUrl} = p;
  const index = tab.history.findIndex(p => p.id === page.id);

  const setScroll = React.useCallback((scroll: number) => {
    if (tab && page) remoteAction('scrollPage', tab.id, page.id, scroll);
  }, [tab.id, page.id]);

  if (!tab || !page) return null;

  return (
    <DetectRenderer
      type={page.type}
      url={page.url}
      linkTarget={`${index}`}
      scroll={page.scroll}
      onScroll={setScroll}
      visitUrl={visitUrl}
    />
  );
}
