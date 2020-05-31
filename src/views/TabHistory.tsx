import React from 'react';
import styled from 'styled-components';
import useTraceUpdate from 'use-trace-update';
import {useDebouncedCallback} from 'use-debounce';

import {Tab, navigateTabAt} from 'core';
import {Horizontal} from 'components/Layout';
import TabPage from './TabPage';


export default function TabHistory(p: {
  tab: Tab,
  onVisit(url: string, at: number): void,
}) {
  // console.log('TabHistory');
  // useTraceUpdate(p);

  const {tab, onVisit} = p;
  const $scroller = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!$scroller.current) return;
    const $pane = $scroller.current.children[tab.historyIndex];
    $pane?.scrollIntoView({behavior:'auto', inline:'end'});
  }, [tab.id])

  React.useEffect(() => {
    if (!$scroller.current) return;
    const $pane = $scroller.current.children[tab.historyIndex];
    $pane?.scrollIntoView({behavior:'smooth', inline:'end'});
  }, [$scroller.current, tab.historyIndex])

  const [onScroll] = useDebouncedCallback(() => {
    if (!$scroller.current) return;
    const scroll = $scroller.current.scrollLeft;
    const width = $scroller.current.clientWidth;
    const children = Array.from($scroller.current.children);

    for (let {i, $el} of children.map(($el, i) => ({i, $el})).reverse()) {
      const $pane = $el as HTMLElement;
      const left = $pane.offsetLeft - scroll;
      const start = Math.abs(left);
      const end = Math.abs(width - left - $pane.offsetWidth);
      if (start <= 2 || end <= 2) {
        if (i !== tab.historyIndex) navigateTabAt(tab.id, i);
        break;
      }
    }
  }, 100);

  const pages = React.useMemo(() => (
    tab.history.map((page, i) => (
      <TabPage key={page.id} historyIndex={i} page={page} onVisit={p.onVisit}/>
    ))
  ), [onVisit, tab.id, tab.history]);

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
