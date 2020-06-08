import React from 'react';
import Bag from 'utils/Bag';

import Renderer, {RendererProps} from './Renderer';
import GopherRenderer from './GopherRenderer';
import GopherFolderRenderer from './GopherFolderRenderer';
import BinaryRenderer from './BinaryRenderer';
import DocumentRenderer from 'renderers/DocumentRenderer';
import TextRenderer from './TextRenderer';
import HTMLRenderer from './HTMLRenderer';
import ImageRenderer from './ImageRenderer';
import AudioRenderer from './AudioRenderer';

export const renderers: Bag<Renderer> = {
  '0': DocumentRenderer,
  '17': GopherRenderer,
  'F': GopherFolderRenderer,
  '4569': BinaryRenderer,
  'Ipgj': ImageRenderer,
  'h': HTMLRenderer,
  's': AudioRenderer,
  '*': TextRenderer,
};

export interface DetectRendererProps extends RendererProps {
  type: string,
};

export function DetectRenderer(p: DetectRendererProps) {
  const {type, ...props} = p;

  const Component = Object.entries(renderers).reduce((Match, [exts, Component]) => {
    return exts.includes(type) ? Component : Match;
  }, renderers['*']);

  return <Component {...props}/>;
}

export default renderers;
