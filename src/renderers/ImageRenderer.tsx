import React from 'react';
import styled from 'styled-components';
import {RendererProps} from './Renderer';


export default function ImageRenderer(p: RendererProps) {
  const url = React.useMemo(() => {
    const blob = new Blob([p.data], {type:'text/html'});
    return URL.createObjectURL(blob);
  }, [p.data]);

  return (
    <Container>
      <img src={url} width="100%"/>
    </Container>
  );
}

const Container = styled.div`
  flex: 1 0 auto;
  width: 664px;
  padding: 24px;
  scroll-snap-align: center;
  overflow: hidden scroll;
  &:first-child, &:not(:last-child){ border-right: solid thin #ddd }
`;
