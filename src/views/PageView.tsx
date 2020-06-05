import React from 'react';
import {Tab, scrollPage, Page} from 'core';
import {DetectRenderer} from 'renderers'
import {VisitUrlOptions} from 'renderers/Renderer';

export default function PageView(p: {
  tab: Tab,
  page: Page,
  visitUrl(url: string, options: VisitUrlOptions): void,
}) {
  const {tab, page, visitUrl} = p;

  const setScroll = React.useCallback((scroll: number) => {
    if (tab && page) scrollPage(tab.id, page.id, scroll);
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
