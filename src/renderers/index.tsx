import React from 'react';
import Bag from 'utils/Bag';

import Renderer, {RendererProps} from './Renderer';
import GopherRenderer from './GopherRenderer';
import TextRenderer from './TextRenderer';
import ImageRenderer from './ImageRenderer';
import HTMLRenderer from './HTMLRenderer';

export const renderers: Bag<Renderer> = {
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

export interface DetectRendererProps extends RendererProps {
  type: string,
};

export function DetectRenderer(p: DetectRendererProps) {
  const {type, ...props} = p;
  const Component = renderers[type] ?? renderers.default;
  return <Component {...props}/>;
}

export default renderers;
