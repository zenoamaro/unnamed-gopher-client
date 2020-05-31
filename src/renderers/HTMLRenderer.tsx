import React from 'react';
import styled from 'styled-components';
import {Page} from 'core';


export default function HTMLRenderer(p: {
  page: Page,
  historyIndex: number,
  onVisit(url: string, at: number): void,
}) {
  const blob = new Blob([p.page.raw], {type:'text/html'});
  const obj = URL.createObjectURL(blob);

  return (
    <Frame src={obj} sandbox=""/>
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
