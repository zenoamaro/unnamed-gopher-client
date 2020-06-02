import Path from 'path';
import React from 'react';
import styled from 'styled-components';
import * as Gopher from 'gopher';
import {RendererProps} from './Renderer';
import {Vertical} from 'components/Layout';
import LinkButton from 'components/LinkButton';

import AudioRenderer from 'renderers/AudioRenderer';

export default function BinaryRenderer(p: RendererProps) {
  const content = React.useMemo(() => {
    const {pathname} = Gopher.parseGopherUrl(p.url);
    const basename = Path.basename(pathname);
    const ext = Path.extname(basename);

    if (['.mp3', '.aac', '.m4a', '.ogg', '.wav'].includes(ext)) return <AudioRenderer {...p}/>;

    const blob = new Blob([p.data]);
    const blobUrl = URL.createObjectURL(blob);

    return <Container>
      <Label>{basename} ({Math.round(p.data.length/1000)} KB)</Label>
      <LinkButton href={blobUrl} download={basename} disabled={p.state !== 'ready'}>Save to disk</LinkButton>
    </Container>;
  }, [p.state, p.data]);

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
