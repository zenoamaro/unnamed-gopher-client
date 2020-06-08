import Path from 'path';
import React from 'react';
import styled from 'styled-components';
import * as Gopher from 'gopher';
import {Vertical} from 'components/Layout';
import LinkButton from 'components/LinkButton';
import {RendererProps} from './Renderer';
import Bag from 'utils/Bag';
import * as Icons from 'react-icons/io';


const mapping: Bag<React.FC<{size: number}>> = {
  '.txt .md .html .pdf .doc .xls': Icons.IoIosDocument,
  '.zip .rar .7z .tar .gz .sit .hqx': Icons.IoIosArchive,
  '.mp3 .ogg .wav .mid': Icons.IoIosVolumeHigh,
  '*': Icons.IoIosCube,
};

export default function BinaryRenderer(p: RendererProps) {
  return React.useMemo(() => {
    const {pathname} = Gopher.parseGopherUrl(p.url);
    const basename = Path.basename(pathname);
    const extname = Path.extname(basename);

    const Icon = Object.entries(mapping).reduce((Match, [exts, Component]) => {
      return exts.split(' ').includes(extname) ? Component : Match;
    }, mapping['*']);

    return <Container>
      <IconContainer><Icon size={128}/></IconContainer>
      <Label>{basename}</Label>
      <LinkButton href={p.url} download={basename}>Save to disk</LinkButton>
    </Container>;
  }, [p.url, p.timestamp]);
}



const Container = styled(Vertical)`
  height: 100%;
  align-items: center;
  justify-content: center;
  width: 664px;
  padding: 24px;
  overflow: auto scroll;
`;

const IconContainer = styled.div`
  display: contents;
  color: #aaa;
`;

const Label = styled.div`
  margin: 12px;
  font-weight: bold;
`;
