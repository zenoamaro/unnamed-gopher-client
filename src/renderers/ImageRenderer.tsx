import React from 'react';
import styled from 'styled-components';
import {Page, Resource} from 'core';


export default function ImageRenderer(p: {
  page: Page,
  historyIndex: number,
  resource: Resource,
  onVisit(url: string, at: number): void,
}) {
  const url = React.useMemo(() => {
    if (!p.resource) return;
    const blob = new Blob([p.resource.data], {type:'text/html'});
    return URL.createObjectURL(blob);
  }, [p.resource?.timestamp]);

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
