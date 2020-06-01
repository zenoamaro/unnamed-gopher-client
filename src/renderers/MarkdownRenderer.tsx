import React from 'react';
import styled from 'styled-components';
import Markdown from 'react-markdown';
import {RendererProps} from './Renderer';


export default function MarkdownRenderer(p: RendererProps) {
  const content = React.useMemo(() => (
    <Text source={p.data.toString()}/>
  ), [p.url, p.data]);

  return (
    <Container>
      {content}
    </Container>
  );
}

const Container = styled.div`
  user-select: text;
  flex: 1 0 auto;
  width: 664px;
  padding: 24px;
  scroll-snap-align: center;
  overflow: hidden scroll;
  &:first-child, &:not(:last-child){ border-right: solid thin #ddd }
`;

const Text = styled(Markdown)`
  width: 616px;
  margin: 0 auto;
`;
