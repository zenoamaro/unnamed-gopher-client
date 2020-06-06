import Path from 'path';
import React from 'react';
import * as Gopher from 'gopher';
import Renderer, {RendererProps} from './Renderer';

export default function ExtensionRenderer(mapping: {
  [key: string]: Renderer,
  '*': Renderer,
}): Renderer {
  return (p: RendererProps) => {
    const {pathname} = Gopher.parseGopherUrl(p.url);
    const basename = Path.basename(pathname);
    const extname = Path.extname(basename);

    const Component = Object.entries(mapping).reduce((Match, [exts, Component]) => {
      return exts.split(' ').includes(extname) ? Component : Match;
    }, mapping['*']);

    return <Component {...p}/>;
  };
}
