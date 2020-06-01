import React from 'react';
import {Resource, useCursor, Tab} from 'core';
import {DetectRenderer} from 'renderers'
import {VisitUrlOptions} from 'renderers/Renderer';

export default function PageView(p: {
  tabId: string,
  pageId: string,
  visitUrl(url: string, options: VisitUrlOptions): void,
}) {
  const {tabId, pageId, visitUrl} = p;
  const tab = useCursor<Tab>(['tabs', tabId]);
  const page = tab.history.find(p => p.id === pageId)!;

  const selector = [page.url, page.query].filter(Boolean).join('\t');
  const data = useCursor<Resource['data']>(['resources', selector, 'data']);

  return (
    <DetectRenderer
      type={page.type}
      url={page.url}
      data={data}
      visitUrl={visitUrl}
    />
  );
}