import React from 'react';
import {Page} from 'core';
import Bag from 'utils/Bag';

import GopherRenderer from 'renderers/GopherRenderer';
import TextRenderer from 'renderers/TextRenderer';
import ImageRenderer from 'renderers/ImageRenderer';
import HTMLRenderer from 'renderers/HTMLRenderer';

const RENDERER_MAP = {
  '0': TextRenderer,
  '1': GopherRenderer,
  '7': GopherRenderer,
  'h': HTMLRenderer,
  'I': ImageRenderer,
  'p': ImageRenderer,
  'g': ImageRenderer,
  'j': ImageRenderer,
  'default': TextRenderer,
}

export default function TabPage(p: {
  page: Page,
  historyIndex: number,
  onVisit(url: string, at: number): void,
}) {
  // @ts-ignore indexing
  const Renderer = RENDERER_MAP[p.page.type] ?? RENDERER_MAP.default;

  return (
    <Renderer {...p}/>
  );
}
