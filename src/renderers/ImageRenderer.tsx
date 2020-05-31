import React from 'react';
import styled from 'styled-components';
import {Page} from 'core';


export default function ImageRenderer(p: {
  page: Page,
  historyIndex: number,
  onVisit(url: string, at: number): void,
}) {
  const {page} = p;
  const [imageUrl, setImageUrl] = React.useState('');

  React.useEffect(() => {
    const blob = new Blob([page.raw]);
    const obj = URL.createObjectURL(blob);
    setImageUrl(obj);
  }, [page.id, page.raw]);

  return (
    <Container>
      <img src={imageUrl} width="100%"/>
    </Container>
  );
}

const Container = styled.div`
  flex: 1 0 auto;
  width: 800px;
  padding: 24px;
  scroll-snap-align: end;
  overflow: hidden scroll;
  &:first-child, &:not(:last-child){ border-right: solid thin #ddd }
`;
