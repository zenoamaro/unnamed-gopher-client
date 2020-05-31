import {shell} from 'electron';
import React from 'react';
import styled from 'styled-components';
import {useDebouncedCallback} from 'use-debounce';

import {Tab, navigateTabAt, useCursor, createTab} from 'core';
import {VisitUrlOptions} from 'renderers/Renderer';
import {Horizontal} from 'components/Layout';
import TabPage from './TabPage';


export default function TabHistory(p: {
  tabId: string,
  onVisit(url: string, at: number): void,
}) {
  const {tabId, onVisit} = p;
  const tab = useCursor<Tab>(['tabs', tabId]);

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
          navigateTabAt(tab.id, i);
        }
        break;
      }
    }
  }, 100);

  const pages = React.useMemo(() => (
    tab.history.map((page, i) => {
      function visitUrl(url: string, options: VisitUrlOptions) {
        if (!url.startsWith('gopher://')) {
          return shell.openExternal(url);
        }
        const {mode} = options;
        if (mode === 'push') onVisit(url, i+1);
        else if (mode === 'replace') onVisit(url, i);
        else if (mode === 'tab') createTab('main', url, true);
        else if (mode === 'backgroundTab') createTab('main', url, false);
      }
      return <TabPage
        key={page.id}
        tabId={tab.id}
        pageId={page.id}
        visitUrl={visitUrl}
      />
    })
  ), [tab.history]);

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
