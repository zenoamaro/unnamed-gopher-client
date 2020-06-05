import React from 'react';
import {Tab, Page} from 'core';
import {remoteAction} from 'utils/remoteState';
import {DetectRenderer} from 'renderers'
import {VisitUrlOptions} from 'renderers/Renderer';

export default function PageView(p: {
  tab: Tab,
  page: Page,
  visitUrl(url: string, options: VisitUrlOptions): void,
}) {
  const {tab, page, visitUrl} = p;

  const setScroll = React.useCallback((scroll: number) => {
    if (tab && page) remoteAction('scrollPage', tab.id, page.id, scroll);
  }, [tab.id, page.id]);

  if (!tab || !page) return null;

  return (
    <DetectRenderer
      type={page.type}
      url={page.url}
      scroll={page.scroll}
      onScroll={setScroll}
      visitUrl={visitUrl}
    />
  );
}
