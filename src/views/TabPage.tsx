import React from 'react';
import useTraceUpdate from 'use-trace-update';
import styled from 'styled-components';
import * as Gopher from 'gopher';
import {Page} from 'core';
import Bag from 'utils/Bag';

import {
  IoIosFolder,
  IoIosDocument,
  IoIosImage,
  IoIosSearch,
  IoIosCloseCircle,
  IoIosArchive,
  IoIosGlobe,
  IoIosDesktop,
} from 'react-icons/io';

const ICON_MAP: Bag<React.FC<{size: number}>> = {
  '0': IoIosDocument,
  '1': IoIosFolder,
  '2': IoIosDesktop,
  '3': IoIosCloseCircle,
  '4': IoIosArchive,
  '5': IoIosArchive,
  '6': IoIosArchive,
  '7': IoIosSearch,
  '8': IoIosDesktop,
  '9': IoIosArchive,
  'd': IoIosDocument,
  'g': IoIosImage,
  'h': IoIosGlobe,
  'I': IoIosImage,
  'j': IoIosImage,
  'p': IoIosImage,
};

export default function TabPage(p: {
  page: Page,
  historyIndex: number,
  onVisit(url: string, at: number): void,
}) {
  // console.log('TabPage');
  // useTraceUpdate(p);

  return (
    <Container>
      {p.page.content.map((item, i) => (
        <GopherItem
          key={i}
          item={item}
          onVisit={p.onVisit}
          historyIndex={p.historyIndex}
        />
      ))}
    </Container>
  );
}

function GopherItem(p: {
  item: Gopher.Item,
  historyIndex: number,
  onVisit(url: string, at: number): void,
}) {
  // console.log('GopherItem');
  // useTraceUpdate(p);

  const {type, label, url} = p.item;
  const isLinked = !('i3'.includes(type));
  const visit = isLinked ? () => p.onVisit(url!, p.historyIndex) : undefined;

  const Icon = ICON_MAP[type];

  return <Line data-type={type} onClick={visit}>
    {Icon? <LineIcon><Icon size={20}/></LineIcon> : null}
    <LineTitle>{label || ' '}</LineTitle>
  </Line>;
}

const Container = styled.div`
  flex: 1 0 auto;
  width: 650px;
  padding: 24px;
  scroll-snap-align: end;
  overflow: hidden scroll;
  font-family: "SF Mono", Menlo, Monaco, monospace;
  font-size: 12px;
  &:first-child, &:not(:last-child){ border-right: solid thin #ddd }
`;

const Line = styled.div`
  position: relative;
  margin: 0 auto;
  width: 602px;
  padding: 12px 48px;
  border-radius: 8px;

  &:not([data-type="i"]):hover {
    background: #EAF1F6;
    cursor: pointer;
  }
  &[data-type="i"] {
    padding: 0 48px;
  }
  &[data-type="i"] + &:not([data-type="i"]),
  &:not([data-type="i"]) + &[data-type="i"] {
    margin-top: 8px;
  }
`;

const LineIcon = styled.div`
  position: absolute;
  top: 9px;
  left: 16px;
  color: gray;
`;

const LineTitle = styled.div`
  white-space: pre-wrap;
`;

const LineLink = styled.a`
  text-decoration: none;
`;
