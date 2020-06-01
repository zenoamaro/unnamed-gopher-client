import React from 'react';
import styled from 'styled-components';
import {RendererProps} from './Renderer';
import {Horizontal} from 'components/Layout';


export default function ImageRenderer(p: RendererProps) {
  const [zoomed, setZoomed] = React.useState(false);

  const url = React.useMemo(() => {
    const blob = new Blob([p.data], {type:'text/html'});
    return URL.createObjectURL(blob);
  }, [p.data]);

  const toggleZoom = React.useCallback(() => {
    setZoomed(!zoomed);
  }, [zoomed, setZoomed]);

  return (
    <Container zoomed={zoomed}>
      <Image src={url} zoomed={zoomed} onClick={toggleZoom}/>
    </Container>
  );
}

const Container = styled(Horizontal)<{
  zoomed: boolean,
}>`
  flex: 1 0 auto;
  align-items: center;
  justify-content: center;
  width: ${p => p.zoomed ? 'auto' : '664px'};
  min-width: 664px;
  max-width: 1200px;
  padding: 24px;
  scroll-snap-align: center;
  overflow: auto scroll;
  &:first-child, &:not(:last-child){ border-right: solid thin #ddd }
`;

const Image = styled.img<{
  zoomed: boolean,
}>`
  cursor: pointer;
  max-width: ${p => p.zoomed ? 'auto' : '100%'};
`;
