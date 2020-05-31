import {ipcRenderer} from 'electron';
import React from 'react';
import styled from 'styled-components';
import {State, selectTab, createTab, destroyTab, reorderTab} from 'core';
import {Vertical} from 'components/Layout';
import TabBar from 'components/TabBar';
import BrowserTab from './BrowserTab';
import useShortcuts from 'utils/useShortcuts';

export default function Browser(p: {
  state: State
}) {
  const window = p.state.windows.main;
  const tabs = window.tabs.map(tabId => p.state.tabs[tabId]);
  if (!tabs.length) createTab(window.id, 'gopher://start');

  const tab = p.state.tabs[window.selectedTabId];

  const reorderWindowTab = React.useCallback(({oldIndex, newIndex}) => {
    const tabId = window.tabs[oldIndex];
    reorderTab(window.id, tabId, newIndex);
  }, [window]);

  const selectWindowTab = React.useCallback((tabId: string) => {
    selectTab(window.id, tabId);
  }, [window.id])

  const createWindowTab = React.useCallback(() => {
    createTab(window.id);
  }, [window.id]);

  React.useEffect(() => {
    ipcRenderer.on('deep-link', function (e, url) {
      createTab('main', url);
    });
  }, []);

  useShortcuts(React.useCallback((e: KeyboardEvent) => {
    if (e.metaKey && e.key === 't') createTab(window.id);
    else if (e.metaKey && e.key === 'w') destroyTab(window.selectedTabId);
    else return true;
  }, [window.id, window.selectedTabId]));

  return <Container>
    <TabBar
      tabs={tabs}
      selectedTabId={window.selectedTabId}
      onReorderTab={reorderWindowTab}
      onSelectTab={selectWindowTab}
      onCreateTab={createWindowTab}
      onCloseTab={destroyTab}
    />
    <BrowserTab tab={tab}/>
  </Container>
}

const Container = styled(Vertical)`
  flex: 1;
  background-color: #fafafa;
  user-select: none;
  overflow: hidden;
`;
