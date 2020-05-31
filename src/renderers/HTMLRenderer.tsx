import React from 'react';
import styled from 'styled-components';
import {Page, Resource} from 'core';


export default function HTMLRenderer(p: {
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
    <Frame src={url} sandbox=""/>
  );
}

const Frame = styled.iframe`
  scroll-snap-align: center;
  overflow: hidden scroll;
  flex: 1 0 auto;
  width: 664px;
  border: none;
  &:first-child, &:not(:last-child){ border-right: solid thin #ddd }
`;
