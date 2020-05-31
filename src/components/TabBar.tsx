import React from 'react';
import styled, {keyframes} from 'styled-components';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import {parseGopherUrl} from 'gopher';
import {Tab, Resource} from 'core';
import {Horizontal} from './Layout';
import Button from './Button';
import Bag from 'utils/Bag';
import {capitalized} from 'utils/text';

import {
  IoIosClose,
  IoIosAdd,
  IoIosFolderOpen,
  IoIosImage,
  IoIosCloseCircleOutline,
  IoIosSync,
  IoIosDocument,
  IoIosStar,
  IoIosSearch,
} from 'react-icons/io'

export default function Toolbar(p: {
  tabs: Tab[],
  selectedTabId: string,
  resources: Bag<Resource>,
  onSelectTab(tabId: string): void,
  onCreateTab(): void,
  onCloseTab(tabId: string): void,
  onReorderTab(p: any): void,
}) {
  return <Container>
    <SortableTabs {...p} axis="x" lockAxis="x" lockToContainerEdges={true} onSortEnd={p.onReorderTab} distance={5}/>
    <ToolbarButton onClick={() => p.onCreateTab()}><IoIosAdd size={22}/></ToolbarButton>
  </Container>;
}

const SortableTabs = SortableContainer((p: {
  tabs: Tab[],
  selectedTabId: string,
  resources: Bag<Resource>,
  onSelectTab(tabId: string): void,
  onCreateTab(): void,
  onCloseTab(tabId: string): void,
}) => {
  return <TabContainer>
    {p.tabs.map((tab, i) => (
      <SortableTab {...p} tab={tab} key={tab.id} index={i}/>
    ))}
  </TabContainer>;
});

const SortableTab = SortableElement((p: {
  tab: Tab,
  selectedTabId: string,
  resources: Bag<Resource>,
  onSelectTab(tabId: string): void,
  onCreateTab(): void,
  onCloseTab(tabId: string): void,
}) => {
  const {tab, selectedTabId} = p;
  const {history, historyIndex} = tab;

  if (!history.length) {
    return <Tab key={tab.id} selected={tab.id === selectedTabId} onClick={() => p.onSelectTab(tab.id)}>
      <IoIosStar size={16}/>
      <TabTitle>New tab</TabTitle>
      <IoIosClose size={22} onClick={(e) => {p.onCloseTab(tab.id); e.stopPropagation()}}/>
    </Tab>
  }

  const page = history[historyIndex];
  const {hostname, pathname} = parseGopherUrl(page.url);

  const tabTitle = [
    page.query ?? capitalized(pathname.replace(/\/$/, '').split('/').slice(-1)[0]),
    hostname
  ].filter(Boolean).join(' - ');

  const resource = p.resources[[page.url, page.query].filter(Boolean).join('\t')];

  const TabIcon = (
    // FIXME
    resource?.state === 'loading' ? LoadingIcon :
    resource?.state === 'error' ? IoIosCloseCircleOutline :
    page.type === '1' ? IoIosFolderOpen :
    page.type === '7' ? IoIosSearch :
    page.type === '0' ? IoIosDocument :
    'Ipgj'.includes(page.type) ? IoIosImage :
    IoIosCloseCircleOutline
  );

  return (
    <Tab key={tab.id} selected={tab.id === selectedTabId} onClick={() => p.onSelectTab(tab.id)}>
      <TabIcon size={16}/>
      <TabTitle>{tabTitle}</TabTitle>
      <IoIosClose size={22} onClick={(e) => {p.onCloseTab(tab.id); e.stopPropagation()}}/>
    </Tab>
  );
});

const Container = styled(Horizontal)`
  -webkit-app-region: drag;
  height: 38px;
  padding: 0 8px 0 80px;
  border-bottom: solid thin #ddd;
  background: #f0f0f0;
`;

const TabContainer = styled(Horizontal)``;

const Tab = styled(Horizontal)<{
  selected?: boolean,
}>`
  -webkit-app-region: no-drag;
  align-items: center;
  padding: 0 6px 0 12px;
  color: ${p => p.selected? 'inherit' : '#aaa'};
  background: ${p => p.selected? 'white' : 'transparent'};
  border-left: solid thin transparent;
  border-right: solid thin transparent;
  border-color: ${p => p.selected? '#ddd' : 'transparent'};
  box-shadow: ${p => p.selected? '0 2px 0 -1px white' : 'none'};
`;

const TabTitle = styled.div`
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin: 0 8px;
`;

const ToolbarButton = styled(Button)`
  align-self: center;
  height: 30px;
`;

const spin = keyframes`
  from {transform: rotate(0deg)}
  to {transform: rotate(360deg)}
`;

const LoadingIcon = styled(IoIosSync)`
  animation: ${spin} 1s linear infinite;
`;
