import React from 'react';
import {Page} from 'core';
import Bag from 'utils/Bag';

import GopherRenderer from 'renderers/gopher';
import TextRenderer from 'renderers/text';

const RENDERER_MAP = {
  '0': TextRenderer,
  '1': GopherRenderer,
  '7': GopherRenderer,
  'default': TextRenderer,
}

export default function TabPage(p: {
  page: Page,
  historyIndex: number,
  onVisit(url: string, at: number): void,
}) {
  // console.log('TabPage');
  // useTraceUpdate(p);

  // @ts-ignore
  const Renderer = RENDERER_MAP[p.page.type] ?? RENDERER_MAP.default;

  return (
    <Renderer {...p}/>
  );
}
