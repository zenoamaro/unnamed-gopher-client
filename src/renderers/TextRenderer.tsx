import Path from 'path';
import React from 'react';
import styled from 'styled-components';
import Markdown from 'react-markdown';
import * as Gopher from 'gopher';
import {Page, Resource} from 'core';


export default function TextRenderer(p: {
  page: Page,
  historyIndex: number,
  resource: Resource,
  onVisit(url: string, at: number): void,
}) {
  const content = React.useMemo(() => {
    if (!p.resource) return null;
    const {pathname} = Gopher.parseGopherUrl(p.page.url);
    const basename = Path.basename(pathname);
    const ext = Path.extname(basename);
    const str = p.resource.data.toString();

    return (
      ext === '.md'? <Markdown source={str}/> :
      <Text>{str}</Text>
    );
  }, [p.resource?.timestamp]);

  return (
    <Container>
      {content}
    </Container>
  );
}

const Container = styled.div`
  user-select: text;
  flex: 1 0 auto;
  width: 664px;
  padding: 24px;
  scroll-snap-align: center;
  overflow: hidden scroll;
  &:first-child, &:not(:last-child){ border-right: solid thin #ddd }
`;

const Text = styled.pre`
  width: 616px;
  margin: 0 auto;
  white-space: pre-wrap;
  font-family: "SF Mono", Menlo, Monaco, monospace;
  font-size: 12px;
`;
