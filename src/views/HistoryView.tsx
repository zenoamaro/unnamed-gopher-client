import React from 'react';
import styled from 'styled-components';
import {memoize} from 'lodash';
import {Tab, VisitMode} from 'core';
import {useDebouncedCallback} from 'use-debounce';
import {remoteAction} from 'utils/remoteState';
import {Horizontal} from 'components/Layout';
import PageView from './PageView';


const createUrlVisitor = memoize((i: number) => (url: string, mode?: VisitMode) => {
  remoteAction('visit', url, mode, i);
});

function scrollPane($container: HTMLElement | null, index: number, smooth: boolean) {
  if (!$container) return;
  const $pane = $container.children[index] as HTMLElement;
  if (!$pane) return;
  const left = $pane.offsetLeft - ($container.offsetWidth - $pane.offsetWidth) / 2;
  $container.scrollTo({left, behavior: smooth? 'smooth' : 'auto'});
}

export default function HistoryView(p: {
  tab: Tab,
}) {
  const {tab} = p;

  const $scroller = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    scrollPane($scroller?.current, tab.historyIndex, false);
  }, [tab.id]);

  React.useLayoutEffect(() => {
    scrollPane($scroller?.current, tab.historyIndex, true);
  }, [tab.historyIndex]);

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
        if (i !== tab!.historyIndex) {
          remoteAction('navigateTabAt', tab!.id, i);
        }
        break;
      }
    }
  }, 64);

  const pages = React.useMemo(() => (
    tab.history.map((page, i) => {
      const isCurrentPage = tab.history[tab.historyIndex].id === page.id;
      const visitUrl = createUrlVisitor(i);
      return <Pane key={page.id} highlight={isCurrentPage}>
        <PageView tab={tab} page={page} visitUrl={visitUrl}/>
      </Pane>;
    })
  ), [tab.history, tab.historyIndex]);

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
