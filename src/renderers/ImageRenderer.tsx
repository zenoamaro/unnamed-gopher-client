import React from 'react';
import styled from 'styled-components';
import {Horizontal} from 'components/Layout';
import {RendererProps} from './Renderer';


export default function ImageRenderer(p: RendererProps) {
  const [zoomed, setZoomed] = React.useState(false);

  const toggleZoom = React.useCallback(() => {
    setZoomed(!zoomed);
  }, [zoomed, setZoomed]);

  return (
    <Container zoomed={zoomed}>
      <Image src={p.url} zoomed={zoomed} onClick={toggleZoom}/>
    </Container>
  );
}

const Container = styled(Horizontal)<{
  zoomed: boolean,
}>`
  height: 100%;
  align-items: center;
  justify-content: center;
  width: ${p => p.zoomed ? 'auto' : '664px'};
  min-width: 664px;
  max-width: 1200px;
  padding: 24px;
  overflow: auto scroll;
`;

const Image = styled.img<{
  zoomed: boolean,
}>`
  cursor: pointer;
  max-width: ${p => p.zoomed ? 'auto' : '100%'};
`;
