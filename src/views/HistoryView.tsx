import {shell} from 'electron';
import React from 'react';
import styled from 'styled-components';
import {useDebouncedCallback} from 'use-debounce';

import {Tab} from 'core';
import {VisitUrlOptions} from 'renderers/Renderer';
import {Horizontal} from 'components/Layout';
import PageView from './PageView';
import {remoteAction} from 'utils/remoteState';


export default function HistoryView(p: {
  tab: Tab,
  onVisit(url: string, at: number): void,
}) {
  const {tab, onVisit} = p;

  const $scroller = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (!$scroller.current) return;
    const $pane = $scroller.current.children[tab!.historyIndex];
    $pane?.scrollIntoView({behavior:'auto', inline:'center'});
  }, [tab.id])

  React.useLayoutEffect(() => {
    if (!$scroller.current) return;
    const $pane = $scroller.current.children[tab!.historyIndex];
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
        if (i !== tab!.historyIndex) remoteAction('navigateTabAt', tab!.id, i);
        break;
      }
    }
  }, 100);

  const pages = React.useMemo(() => (
    tab.history.map((page, i) => {
      const isCurrentPage = tab.history[tab.historyIndex].id === page.id;

      function visitUrl(url: string, options: VisitUrlOptions) {
        if (!url.startsWith('gopher://')) {
          return shell.openExternal(url);
        }
        const {mode} = options;
        if (mode === 'push') onVisit(url, i+1);
        else if (mode === 'replace') onVisit(url, i);
        else if (mode === 'tab') remoteAction('createTab', 'main', url, true);
        else if (mode === 'backgroundTab') remoteAction('createTab', 'main', url, false);
      }

      return <Pane key={page.id} highlight={isCurrentPage}>
        <PageView tab={tab} page={page} visitUrl={visitUrl}/>
      </Pane>;
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

const Pane = styled.div<{
  highlight: boolean,
}>`
  flex: 1 0 auto;
  scroll-snap-align: center;
  overflow: hidden;
  background: ${p => p.highlight? 'white' : 'transparent'};
  &:first-child, &:not(:last-child){ border-right: solid thin #ddd }
`;
