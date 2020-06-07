import React from 'react';
import {VisitMode} from 'core';

export type Renderer = (props: RendererProps) => React.ReactElement | null;

export interface RendererProps {
  url: string,
  scroll?: number,
  linkTarget?: string,
  timestamp?: number,
  onScroll: (scroll: number) => void,
  visitUrl: (url: string, mode?: VisitMode) => void,
}

export default Renderer;
