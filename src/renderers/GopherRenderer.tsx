import React from 'react';
import * as Icons from 'react-icons/io';
import styled from 'styled-components';
import * as Gopher from 'gopher';
import Bag from 'utils/Bag';
import {useFetchText} from 'utils/useFetch';
import {useScrollRestoration} from 'utils/useScrollRestoration';
import {RendererProps} from './Renderer';


const ICON_MAP: Bag<React.FC<{size: number}>> = {
  '0': Icons.IoIosDocument,
  '1': Icons.IoIosFolder,
  '2': Icons.IoIosDesktop,
  '3': Icons.IoIosCloseCircle,
  '4': Icons.IoIosArchive,
  '5': Icons.IoIosArchive,
  '6': Icons.IoIosArchive,
  '7': Icons.IoIosSearch,
  '8': Icons.IoIosDesktop,
  '9': Icons.IoIosArchive,
  'd': Icons.IoIosDocument,
  'g': Icons.IoIosImage,
  'h': Icons.IoIosGlobe,
  'I': Icons.IoIosImage,
  'j': Icons.IoIosImage,
  'p': Icons.IoIosImage,
};

export default function GopherRenderer(p: RendererProps) {
  const [content] = useFetchText(p.url);

  const items = React.useMemo(() => {
    return Gopher.parse(content);
  }, [content]);

  const $scroller = useScrollRestoration(p.scroll, p.onScroll, [items]);

  return (
    <Container ref={$scroller}>
      {items.map((item, i) => (
        <GopherItem key={i} item={item} visitUrl={p.visitUrl}/>
      ))}
    </Container>
  );
}

const Container = styled.div`
  min-width: 664px;
  height: 100%;
  padding: 24px;
  overflow: hidden scroll;
  font-family: "SF Mono", Menlo, Monaco, monospace;
  font-size: 12px;
`;


export function GopherItem(p: {
  item: Gopher.Item,
  visitUrl: RendererProps['visitUrl'],
}) {
  const {item, visitUrl} = p;
  const {type, label, url} = item;
  if (type == null || type === '.') return null;
  const Icon = ICON_MAP[type];

  const isLinked = !('i37'.includes(type));
  const visit = React.useCallback((e: React.MouseEvent) => {
    visitUrl(url!, {mode: (
      e.metaKey && e.shiftKey ? 'tab' :
      e.metaKey ? 'backgroundTab' :
      e.shiftKey ? 'replace' :
      'push'
    )});
  }, [visitUrl, url]);

  const isSearch = (type === '7');
  const search = React.useCallback((e) => {
    if (e.key !== 'Enter') return;
    const query = (e.target as HTMLInputElement).value.trim();
    if (!query) return;
    const searchUrl = `${url}%09${query}`;
    visitUrl(searchUrl, {mode: (
      e.metaKey && e.shiftKey ? 'tab' :
      e.metaKey ? 'backgroundTab' :
      e.shiftKey ? 'replace' :
      'push'
    )});
  }, [visitUrl, url]);

  return <Line data-type={type} data-link={isLinked} onClick={isLinked? visit : undefined}>
    {Icon? <LineIcon><Icon size={20}/></LineIcon> : null}
    {isSearch ? (
      <LineSearchField type="search" autoComplete="on" placeholder={label} onKeyDown={search}/>
    ) : (
      <LineTitle>{label || ' '}</LineTitle>
    )}
  </Line>;
}

const Line = styled.div`
  position: relative;
  margin: 0 auto;
  width: 616px;
  padding: 12px 48px;
  border-radius: 8px;
  line-height: 1;

  &:not([data-link="true"]) {
    user-select: text;
  }

  &[data-link="true"] {
    cursor: pointer;
    color: #0366d6;
    &:hover {background: #EAF1F6}
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
  color: inherit;
`;

const LineTitle = styled.div`
  white-space: pre-wrap;
`;

const LineSearchField = styled.input`
  width: 70%;
  margin: -7px 0 -6px;
  padding: 6px 8px 5px;
  border: solid thin #ddd;
  border-radius: 3px;
  background: white;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, .1);
`;
