import React from 'react';
import styled, {keyframes} from 'styled-components';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import * as Icons from 'react-icons/io'
import {Tab} from 'core';
import {Horizontal} from './Layout';
import Button from './Button';

export interface TabBarTab {
  id: string,
  icon: string,
  title: string,
}

export default function TabBar(p: {
  tabs: TabBarTab[],
  selectedTabId: string,
  selectTab(tabId: string): void,
  createTab(): void,
  closeTab(tabId: string): void,
  reorderTab(p: any): void,
}) {
  return <Container>
    <SortableTabs
      {...p}
      axis="x"
      lockAxis="x"
      lockToContainerEdges={true}
      onSortEnd={p.reorderTab}
      distance={5}
    />

    <ToolbarButton onClick={p.createTab}>
      <Icons.IoIosAdd size={22}/>
    </ToolbarButton>
  </Container>;
}

const SortableTabs = SortableContainer((p: {
  tabs: TabBarTab[],
  selectedTabId: string,
  selectTab(tabId: string): void,
  createTab(): void,
  closeTab(tabId: string): void,
}) => {
  return <TabContainer>
    {p.tabs.map((tab, i) => (
      <SortableTab {...p} tab={tab} key={tab.id} index={i}/>
    ))}
  </TabContainer>;
});

const SortableTab = SortableElement((p: {
  tab: TabBarTab,
  selectedTabId: string,
  selectTab(tabId: string): void,
  createTab(): void,
  closeTab(tabId: string): void,
}) => {
  const {tab, selectedTabId} = p;
  // @ts-ignore indexing
  const Icon = tab.icon === 'LoadingIcon' ? LoadingIcon : Icons[tab.icon];

  return (
    <Tab key={tab.id} selected={tab.id === selectedTabId} onClick={() => p.selectTab(tab.id)}>
      {Icon? <Icon size={16}/> : null}
      <TabTitle>{tab.title}</TabTitle>
      <Icons.IoIosClose size={22} onClick={(e) => {p.closeTab(tab.id); e.stopPropagation()}}/>
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
  z-index: 2;
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

const LoadingIcon = styled(Icons.IoIosSync)`
  animation: ${spin} 1s linear infinite;
`;
