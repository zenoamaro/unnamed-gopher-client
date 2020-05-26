import React from 'react';
import styled from 'styled-components';
import {Tab} from 'core';
import {Horizontal} from './Layout';
import Button from './Button';

import {
  IoIosClose,
  IoIosAdd,
  IoIosGlobe,
  IoIosDownload,
} from 'react-icons/io'

export default function Toolbar(p: {
  tabs: Tab[],
  selectedTabId: string,
  onSelectTab(tabId: string): void,
  onCreateTab(): void,
  onCloseTab(tabId: string): void,
}) {
  return (
    <Container>
      {p.tabs.map((tab) => {
        const page = tab.history[tab.historyIndex];
        return <Tab key={tab.id} selected={tab.id === p.selectedTabId} onClick={() => p.onSelectTab(tab.id)}>
          {tab.state === 'loading' ? <IoIosDownload size={16}/> : <IoIosGlobe size={16}/>}
          <TabTitle>{page.url}</TabTitle>
          <IoIosClose size={22} onClick={(e) => {p.onCloseTab(tab.id); e.stopPropagation()}}/>
        </Tab>
      })}
      <ToolbarButton onClick={() => p.onCreateTab()}><IoIosAdd size={22}/></ToolbarButton>
    </Container>
  );
}

const Container = styled(Horizontal)`
  -webkit-app-region: drag;
  height: 38px;
  padding: 0 8px 0 80px;
  border-bottom: solid thin #ddd;
  background: #fafafa;
`;

const Tab = styled(Horizontal)<{
  selected?: boolean,
}>`
  -webkit-app-region: no-drag;
  align-items: center;
  padding: 0 12px;
  background: ${p => p.selected? 'white' : 'transparent'};
  border-left: solid thin transparent;
  border-right: solid thin transparent;
  border-color: ${p => p.selected? '#ddd' : 'transparent'};
  box-shadow: ${p => p.selected? '0 2px 0 -1px white' : 'none'};
`;

const TabTitle = styled.div`
  display: inline-block;
  &:not(:first-child) {margin-left: 8px}
  &:not(:last-child) {margin-right: 8px}
`;

const ToolbarButton = styled(Button)`
  align-self: center;
  height: 30px;
`;
