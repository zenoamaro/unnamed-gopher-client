import Path from 'path';
import React from 'react';
import styled from 'styled-components';
import * as Gopher from 'gopher';
import {Vertical} from 'components/Layout';
import LinkButton from 'components/LinkButton';

import {RendererProps} from './Renderer';
import AudioRenderer from './AudioRenderer';

export default function BinaryRenderer(p: RendererProps) {
  const content = React.useMemo(() => {
    const {pathname} = Gopher.parseGopherUrl(p.url);
    const basename = Path.basename(pathname);
    const ext = Path.extname(basename);

    if (['.mp3', '.aac', '.m4a', '.ogg', '.wav'].includes(ext)) return <AudioRenderer {...p}/>;

    // FIXME append to blob, revoke blob

    return <Container>
      <Label>{basename}</Label>
      <LinkButton href={p.url} download={basename}>Save to disk</LinkButton>
    </Container>;
  }, []);

  return content;
}

const Container = styled(Vertical)`
  height: 100%;
  align-items: center;
  justify-content: center;
  width: 664px;
  padding: 24px;
  overflow: auto scroll;
`;

const Label = styled.div`
  margin-bottom: 12px;
`;
