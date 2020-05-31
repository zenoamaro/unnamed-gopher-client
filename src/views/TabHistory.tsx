import React from 'react';
import styled from 'styled-components';
import {useDebouncedCallback} from 'use-debounce';

import {Tab, pointTabHistoryAt, Resource} from 'core';
import {Horizontal} from 'components/Layout';
import TabPage from './TabPage';
import Bag from 'utils/Bag';


export default function TabHistory(p: {
  tab: Tab,
  resources: Bag<Resource>,
  onVisit(url: string, at: number): void,
}) {
  const {tab, resources, onVisit} = p;
  const $scroller = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!$scroller.current) return;
    const $pane = $scroller.current.children[tab.historyIndex];
    $pane?.scrollIntoView({behavior:'auto', inline:'center'});
  }, [tab.id])

  React.useEffect(() => {
    if (!$scroller.current) return;
    const $pane = $scroller.current.children[tab.historyIndex];
    $pane?.scrollIntoView({behavior:'smooth', inline:'center'});
  }, [$scroller.current, tab.historyIndex])

  const [onScroll] = useDebouncedCallback(() => {
    if (!$scroller.current) return;
    const scroll = $scroller.current.scrollLeft;
    const width = $scroller.current.clientWidth;
    const children = Array.from($scroller.current.children);
    if (!children.length) return;

    const panes = [
      {i:children.length-1, $el:children[children.length-1]},
      {i:0, $el:children[0]},
      ...children.slice(1, -1).map(($el, i) => ({i:i+1, $el})).reverse(),
    ];

    for (let {i, $el} of panes) {
      const $pane = $el as HTMLElement;
      const left = $pane.offsetLeft - scroll;
      const start = Math.abs(left);
      const end = Math.abs(width - left - $pane.offsetWidth);
      const centering = Math.abs(end - start);
      if (start <= 1 || end <= 1 || centering <= 1) {
        if (i !== tab.historyIndex) {
          pointTabHistoryAt(tab.id, i);
        }
        break;
      }
    }
  }, 100);

  const pages = React.useMemo(() => (
    tab.history.map((page, i) => {
      return <TabPage
        key={page.id}
        historyIndex={i}
        page={page}
        resources={resources}
        onVisit={onVisit}
      />
    })
  ), [onVisit, tab.id, tab.history, p.resources]);

  return (
    <Container ref={$scroller} onScroll={onScroll}>
      {pages}
    </Container>
  );
}

const Container = styled(Horizontal)`
  flex: 1;
  overflow: scroll hidden;
  scroll-snap-type: x mandatory;
`;
