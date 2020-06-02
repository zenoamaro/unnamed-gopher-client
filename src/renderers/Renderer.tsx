import React from 'react';

export type Renderer = (props: RendererProps) => React.ReactElement;

export interface RendererProps {
  url: string,
  state: 'loading' | 'error' | 'ready',
  data: Buffer,
  scroll?: number,
  onScroll: (scroll: number) => void,
  visitUrl: (url: string, options: VisitUrlOptions) => void,
}

export interface VisitUrlOptions {
  mode: 'replace' | 'push' | 'tab' | 'backgroundTab',
}

export default Renderer;
