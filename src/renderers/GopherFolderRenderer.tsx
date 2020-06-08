import React, {SyntheticEvent} from 'react';
import * as Icons from 'react-icons/io';
import styled from 'styled-components';
import * as Gopher from 'gopher';
import Bag from 'utils/Bag';
import {useFetchText} from 'utils/useFetch';
import {useScrollRestoration} from 'utils/useScrollRestoration';
import {Horizontal, Spring} from 'components/Layout';
import {RendererProps} from './Renderer';
import {textMatch} from 'utils/text';


const ICON_MAP: Bag<React.FC<{size: number}>> = {
  '0': Icons.IoIosDocument,
  '1': Icons.IoIosFolder,
  '2': Icons.IoIosDesktop,
  '4': Icons.IoIosArchive,
  '5': Icons.IoIosArchive,
  '6': Icons.IoIosArchive,
  '8': Icons.IoIosDesktop,
  '9': Icons.IoIosArchive,
  'd': Icons.IoIosDocument,
  'g': Icons.IoIosImage,
  'h': Icons.IoIosGlobe,
  'I': Icons.IoIosImage,
  'j': Icons.IoIosImage,
  'p': Icons.IoIosImage,
  '?': Icons.IoIosHelpCircleOutline,
};

export default function GopherFolderRenderer(p: RendererProps) {
  const [content] = useFetchText(p.url, undefined, [p.timestamp]);
  const [filter, setFilter] = React.useState('');

  const items = React.useMemo(() => {
    if (!content) return [];
    return Gopher.parse(content)
      .filter(item => !('.i37'.includes(item.type)))
      .map((item, i) => ({...item, id: i}))
  }, [content]);

  const filteredItems = React.useMemo(() => {
      return items.filter(item => textMatch(filter, item.label, item.url));
  }, [items, filter]);

  const $scroller = useScrollRestoration(p.scroll, p.onScroll, [items]);

  return (
    <Container ref={$scroller}>
      <Filter filter={filter} onChangeFilter={setFilter}/>
      {filteredItems.map((item, i) => (
        <GopherItem key={i} item={item} linkTarget={p.linkTarget} visitUrl={p.visitUrl}/>
      ))}
    </Container>
  );
}

const Container = styled.div`
  width: 664px;
  height: 100%;
  padding: 24px 8px 0 24px;
  overflow: hidden scroll;
`;


export function Filter(p: {
  filter: string,
  onChangeFilter: (value: string) => void,
}) {
  const onChangeFilter = React.useCallback((e: React.ChangeEvent) => {
    p.onChangeFilter((e.target as HTMLInputElement).value);
  }, [p.onChangeFilter]);

  return (
    <FilterSection>
      <NameFilter type="search" placeholder="Filter by name" value={p.filter} onChange={onChangeFilter}/>
      <Spring/>
      <select>
        <option>All file types</option>
      </select>
    </FilterSection>
  );
}

const FilterSection = styled(Horizontal)`
  margin-top: -8px;
  margin-left: -8px;
  margin-right: 8px;
  margin-bottom: 24px;
`;

const NameFilter = styled.input`
  width: 250px;
`;


export function GopherItem(p: {
  item: Gopher.Item,
  linkTarget?: string,
  visitUrl: RendererProps['visitUrl'],
}) {
  const {item} = p;
  const {type, label, url} = item;
  if (!type) return null;

  const Icon = ICON_MAP[type] ?? ICON_MAP['?'];

  return (
    <ItemContainer>
      <ItemLink title={`Open ${url}`} href={url} target={p.linkTarget}>
        <ItemIcon><Icon size={64}/></ItemIcon>
        <ItemTitle>{label || ' '}</ItemTitle>
      </ItemLink>
    </ItemContainer>
  );
}

const ItemContainer = styled.div`
  display: inline-block;
  width: 142px;
  margin: 0 16px 24px 0;
  text-align: center;
  vertical-align: top;
`;

const ItemLink = styled.a`
  display: contents;
  text-decoration: none;
  color: inherit;
`;

const ItemIcon = styled.div`
  display: inline-block;
  width: auto;
  margin: 0 auto;
  color: #0366d6;
`;

const ItemTitle = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  width: auto;
`;
