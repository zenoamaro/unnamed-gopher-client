import React from 'react';
import * as Icons from 'react-icons/io';
import styled from 'styled-components';
import * as Gopher from 'gopher';
import Bag from 'utils/Bag';
import {useFetchText} from 'utils/useFetch';
import visitModeFromEvent from 'utils/visitModeFromEvent';
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
  const [content] = useFetchText(p.url, undefined, [p.timestamp]);

  const items = React.useMemo(() => {
    let items = Gopher.parse(content);
    // Collapse sequential texts together
    return items.reduce((items: Gopher.Item[], item) => {
      const lastItem = items[items.length -1];
      if (item.type === 'i' && lastItem?.type === 'i') {
        lastItem.label += `\n${item.label}`;
      } else {
        items.push(item);
      }
      return items;
    }, []);
  }, [content]);

  const $scroller = useScrollRestoration(p.scroll, p.onScroll, [items]);

  return (
    <Container ref={$scroller}>
      {items.map((item, i) => (
        <GopherItem key={i} item={item} linkTarget={p.linkTarget} visitUrl={p.visitUrl}/>
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
  linkTarget?: string,
  visitUrl: RendererProps['visitUrl'],
}) {
  const {item, visitUrl} = p;
  const {type, label, url} = item;
  if (type == null || type === '.') return null;

  const Icon = ICON_MAP[type];
  const isLinked = !('i37'.includes(type));
  const isSearch = (type === '7');

  const search = React.useCallback((e) => {
    if (e.key !== 'Enter') return;
    const query = (e.target as HTMLInputElement).value.trim();
    if (query) visitUrl(`${url}%09${query}`, visitModeFromEvent(e));
  }, [visitUrl, url]);

  let content = <Line data-type={type} data-link={isLinked}>
    {Icon? <LineIcon><Icon size={20}/></LineIcon> : null}
    {isSearch ? (
      <LineSearchField type="search" autoComplete="on" placeholder={label} onKeyDown={search}/>
    ) : (
      <LineTitle>{label || ' '}</LineTitle>
    )}
  </Line>;

  // FIXME huge horiz linked padding
  if (isLinked && !isSearch) {
    content = <LineLink title={`Open ${url}`} href={url} target={p.linkTarget}>{content}</LineLink>;
  }

  return content;
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
    padding: 8px 48px;
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

const LineLink = styled.a`
  display: contents;
  text-decoration: none;
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
