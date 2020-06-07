import React from 'react';
import styled from 'styled-components';
import {Horizontal} from 'components/Layout';
import {RendererProps} from './Renderer';


export default function AudioRenderer(p: RendererProps) {
  return React.useMemo(() => (
    <Container>
      <audio controls src={p.url}/>
    </Container>
  ), [p.url, p.timestamp]);
}

const Container = styled(Horizontal)`
  height: 100%;
  align-items: center;
  justify-content: center;
  width: 644px;
  padding: 24px;
  overflow: auto scroll;
`;
