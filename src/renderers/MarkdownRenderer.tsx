import React from 'react';
import styled from 'styled-components';
import Markdown from 'react-markdown';
import {useFetchText} from 'utils/useFetch';
import {useScrollRestoration} from 'utils/useScrollRestoration';
import {RendererProps} from './Renderer';


export default function MarkdownRenderer(p: RendererProps) {
  const [text] = useFetchText(p.url);

  const markdown = React.useMemo(() => (
    <Content source={text}/>
  ), [text]);

  const $scroller = useScrollRestoration(p.scroll, p.onScroll);

  return (
    <Container ref={$scroller}>
      {markdown}
    </Container>
  );
}

const Container = styled.div`
  user-select: text;
  min-width: 664px;
  height: 100%;
  padding: 24px;
  overflow: hidden scroll;
`;

const Content = styled(Markdown)`
  width: 616px;
  margin: 0 auto;
`;
