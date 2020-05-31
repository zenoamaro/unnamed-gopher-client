import React from 'react';
import styled from 'styled-components';
import {Page} from 'core';
import Bag from 'utils/Bag';


export default function TextRenderer(p: {
  page: Page,
  historyIndex: number,
  onVisit(url: string, at: number): void,
}) {
  return (
    <Container>
      {p.page.raw.toString()}
    </Container>
  );
}

const Container = styled.div`
  user-select: text;
  flex: 1 0 auto;
  width: 650px;
  padding: 24px;
  scroll-snap-align: end;
  overflow: hidden scroll;
  white-space: pre-wrap;
  font-family: "SF Mono", Menlo, Monaco, monospace;
  font-size: 12px;
  &:first-child, &:not(:last-child){ border-right: solid thin #ddd }
`;
