import React from 'react';
import styled from 'styled-components';
import {parseGopherUrl} from 'gopher';
import {Tab} from 'core';
import {Horizontal} from './Layout';
import Button from './Button';
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
        if (!tab.history.length) {
          return <Tab key={tab.id} selected={tab.id === p.selectedTabId} onClick={() => p.onSelectTab(tab.id)}>
            <IoIosStar size={16}/>
            <TabTitle>New tab</TabTitle>
            <IoIosClose size={22} onClick={(e) => {p.onCloseTab(tab.id); e.stopPropagation()}}/>
          </Tab>
        }

        const page = tab.history[tab.historyIndex];
        const {hostname, pathname} = parseGopherUrl(page.url);

        const tabTitle = [
          capitalized(pathname.replace(/\/$/, '').split('/').slice(-1)[0]),
          hostname
        ].filter(Boolean).join(' - ');

        const TabIcon = (
          page.state === 'loading' ? IoIosSync :
          page.type === '1' ? IoIosFolderOpen :
          page.type === '0' ? IoIosDocument :
          'Ipgj'.includes(page.type) ? IoIosImage :
          IoIosCloseCircleOutline
        );

        return <Tab key={tab.id} selected={tab.id === p.selectedTabId} onClick={() => p.onSelectTab(tab.id)}>
          <TabIcon size={16}/>
          <TabTitle>{tabTitle}</TabTitle>
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
