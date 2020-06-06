import React from 'react';
import styled from 'styled-components';
import {useFetchText} from 'utils/useFetch';
import visitModeFromEvent from 'utils/visitModeFromEvent';
import {useScrollRestoration} from 'utils/useScrollRestoration';
import {RendererProps} from './Renderer';


export default function HTMLRenderer(p: RendererProps) {
  const [text] = useFetchText(p.url);
  const $scroller = useScrollRestoration<HTMLIFrameElement>(p.scroll, p.onScroll, [text]);

  const captureClick = React.useCallback((e: MouseEvent) => {
    const $anchor = e.target as HTMLAnchorElement;
    if ($anchor.tagName !== 'A') return;
    if (e.metaKey) return;
    p.visitUrl($anchor.href, visitModeFromEvent(e));
    e.preventDefault();
  }, [p.linkTarget]);

  const captureFrameEvents = React.useCallback((e: React.SyntheticEvent) => {
    const $frame = e.target as HTMLIFrameElement;
    $frame.contentDocument?.addEventListener('click', captureClick);
  }, [captureClick]);

  const content = React.useMemo(() => {
    const doc = `<base href="${p.url}">${text}`;
    return <Frame srcDoc={doc} sandbox="" ref={$scroller} onLoad={captureFrameEvents}/>
  }, [p.url, p.linkTarget, text]);

  return content;
}

const Frame = styled.iframe`
  display: block;
  margin: 0 auto;
  min-width: 664px;
  height: 100%;
  border: none;
`;
