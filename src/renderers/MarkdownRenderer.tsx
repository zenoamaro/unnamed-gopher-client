import React from 'react';
import styled from 'styled-components';
import Markdown from 'react-markdown';
import {RendererProps} from './Renderer';


export default function MarkdownRenderer(p: RendererProps) {
  const content = React.useMemo(() => (
    <Content source={p.data.toString()}/>
  ), [p.url, p.data]);

  return (
    <Container>
      {content}
    </Container>
  );
}

const Container = styled.div`
  user-select: text;
  margin: 0 auto;
  height: 100%;
  padding: 24px;
  overflow: hidden scroll;
`;

const Content = styled(Markdown)`
  width: 616px;
  margin: 0 auto;
`;
