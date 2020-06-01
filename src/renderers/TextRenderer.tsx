import Path from 'path';
import React from 'react';
import styled from 'styled-components';
import * as Gopher from 'gopher';
import {useScrollRestoration} from 'utils/useScrollRestoration';
import {RendererProps} from './Renderer';
import MarkdownRenderer from 'renderers/MarkdownRenderer';


export default function TextRenderer(p: RendererProps) {
  const $scroller = useScrollRestoration(p.scroll, p.onScroll);

  const content = React.useMemo(() => {
    const {pathname} = Gopher.parseGopherUrl(p.url);
    const basename = Path.basename(pathname);
    const ext = Path.extname(basename);

    if (ext === '.md') return <MarkdownRenderer {...p}/>;

    return <Container ref={$scroller}>
      <Content>{p.data.toString()}</Content>
    </Container>;
  }, [p.url, p.data]);

  return content;
}

const Container = styled.div`
  user-select: text;
  margin: 0 auto;
  height: 100%;
  padding: 24px;
  overflow: hidden scroll;
`;

const Content = styled.pre`
  width: 616px;
  margin: 0 auto;
  white-space: pre-wrap;
  font-family: "SF Mono", Menlo, Monaco, monospace;
  font-size: 12px;
`;
