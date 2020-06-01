import {ipcRenderer} from 'electron';
import React from 'react';
import styled from 'styled-components';
import * as Gopher from 'gopher';
import {Vertical} from 'components/Layout';
import TabBar from 'components/TabBar';
import useShortcuts from 'utils/useShortcuts';
import {capitalized} from 'utils/text';
import TabView from './TabView';

import {
  State,
  selectTab,
  createTab,
  destroyTab,
  reorderTab,
  useCursor,
  selectPreviousTab,
  selectNextTab,
} from 'core';

export default function BrowserView() {
  const state = useCursor<State>();

  const window = state.windows.main;
  const tabs = window.tabs.map(tabId => state.tabs[tabId]);
  if (!tabs.length) createTab(window.id, 'gopher://start');

  const tab = state.tabs[window.selectedTabId];

  const reorderWindowTab = React.useCallback(({oldIndex, newIndex}) => {
    const tabId = window.tabs[oldIndex];
    reorderTab(window.id, tabId, newIndex);
  }, [window.id, window.tabs]);

  const selectWindowTab = React.useCallback((tabId: string) => {
    selectTab(window.id, tabId);
  }, [window.id]);

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
    else if (e.metaKey && e.key === '[') selectPreviousTab(window.id);
    else if (e.metaKey && e.key === ']') selectNextTab(window.id);
    else return true;
  }, [window.id, window.selectedTabId]));

  const tabBarTabs = React.useMemo(() => tabs.map((tab) => {
    const {id, history, historyIndex} = tab;

    if (history.length === 0) {
      return {id, icon:'IoIosStar', title:'New tab'};
    }

    const page = history[historyIndex];

    if (page.url === 'gopher://start') {
      return {id, icon:'IoIosStar', title:'Start page'}
    }

    const selector = [page.url, page.query].filter(Boolean).join('\t');
    const resource = state.resources[selector];

    const icon = (
      resource?.state === 'loading' ? 'LoadingIcon' :
      resource?.state === 'error' ? 'IoIosCloseCircleOutline' :
      page.type === '1' ? 'IoIosFolderOpen' :
      page.type === '7' ? 'IoIosSearch' :
      page.type === '0' ? 'IoIosDocument' :
      'Ipgj'.includes(page.type) ? 'IoIosImage' :
      'IoIosCloseCircleOutline'
    );

    return {id, icon, title: page.title};
  }), [tabs, state.resources]);

  return <Container>
    <TabBar
      tabs={tabBarTabs}
      selectedTabId={window.selectedTabId}
      reorderTab={reorderWindowTab}
      selectTab={selectWindowTab}
      createTab={createWindowTab}
      closeTab={destroyTab}
    />
    {tab? <TabView tabId={tab.id}/> : null}
  </Container>
}

const Container = styled(Vertical)`
  flex: 1;
  background-color: #fafafa;
  user-select: none;
  overflow: hidden;
`;
