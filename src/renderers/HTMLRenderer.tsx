import React from 'react';
import styled from 'styled-components';
import {useFetchText} from 'utils/useFetch';
import {useScrollRestoration} from 'utils/useScrollRestoration';
import {RendererProps} from './Renderer';


export default function HTMLRenderer(p: RendererProps) {
  // FIXME Find out why `src` makes iframe crash
  //       on gopher://sdf.org/h/sdf/classes/CTN160_WINTER_2010_SSCC.html
  const [text] = useFetchText(p.url);
  const $scroller = useScrollRestoration<HTMLIFrameElement>(p.scroll, p.onScroll, [text]);

  return React.useMemo(() => (
    <Frame srcDoc={text} sandbox="" ref={$scroller}/>
  ), [p.url, text]);
}

const Frame = styled.iframe`
  display: block;
  margin: 0 auto;
  min-width: 664px;
  height: 100%;
  border: none;
`;
