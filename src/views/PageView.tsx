import React from 'react';
import {Resource, useCursor, Tab, scrollPage, Page} from 'core';
import {DetectRenderer} from 'renderers'
import {VisitUrlOptions} from 'renderers/Renderer';

export default function PageView(p: {
  tab: Tab,
  page: Page,
  visitUrl(url: string, options: VisitUrlOptions): void,
}) {
  const {tab, page, visitUrl} = p;
  const selector = [page.url, page.query].filter(Boolean).join('\t');
  const data = useCursor<Resource['data']>(['resources', selector, 'data']);

  const setScroll = React.useCallback((scroll: number) => {
    if (tab && page) scrollPage(tab.id, page.id, scroll);
  }, [tab.id, page.id]);

  if (!tab || !page) return null;

  return (
    <DetectRenderer
      type={page.type}
      url={page.url}
      data={data}
      scroll={page.scroll}
      onScroll={setScroll}
      visitUrl={visitUrl}
    />
  );
}
