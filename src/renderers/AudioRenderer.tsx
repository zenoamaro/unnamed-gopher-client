import React from 'react';
import styled from 'styled-components';
import {RendererProps} from './Renderer';
import {Horizontal} from 'components/Layout';


export default function AudioRenderer(p: RendererProps) {
  const blob = React.useMemo(() => {
    const blob = new Blob([p.data]);
    return URL.createObjectURL(blob);
  }, [p.data]);

  return (
    <Container>
      <audio controls src={blob}/>
    </Container>
  );
}

const Container = styled(Horizontal)`
  height: 100%;
  align-items: center;
  justify-content: center;
  width: 644px;
  padding: 24px;
  overflow: auto scroll;
`;
