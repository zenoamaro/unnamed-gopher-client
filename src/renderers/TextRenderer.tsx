import React from 'react';
import styled from 'styled-components';
import {useFetchText} from 'utils/useFetch';
import {useScrollRestoration} from 'utils/useScrollRestoration';
import {RendererProps} from './Renderer';


export default function TextRenderer(p: RendererProps) {
  const [text] = useFetchText(p.url, undefined, [p.timestamp]);
  const $scroller = useScrollRestoration(p.scroll, p.onScroll, [text]);

  return React.useMemo(() => (
    <Container ref={$scroller}>
      <Content>{text}</Content>
    </Container>
  ), [text]);
}

const Container = styled.div`
  user-select: text;
  min-width: 664px;
  height: 100%;
  padding: 24px;
  overflow: hidden scroll;
`;

const Content = styled.pre`
  width: 616px;
  margin: 0 auto;
  white-space: pre-wrap;
  font-family: "SF Mono", Menlo, Monaco, monospace;
  font-size: 12px;
`;
