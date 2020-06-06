import {ipcRenderer} from 'electron';
import React from 'react';
import styled from 'styled-components';
import {State} from 'core';
import {Vertical} from 'components/Layout';
import TabBar from 'components/TabBar';
import useShortcuts from 'utils/useShortcuts';
import {remoteAction, withRemoteState} from 'utils/remoteState';
import TabView from './TabView';


export default withRemoteState(function BrowserView(p: {
  state: State,
}) {
  const {state} = p;
  const window = state.windows.main;
  const tabs = window.tabs.map(tabId => state.tabs[tabId]);
  if (!tabs.length) remoteAction('createTab', window.id, 'gopher://start', true, true);

  const tab = state.tabs[window.selectedTabId];

  const reorderWindowTab = React.useCallback(({oldIndex, newIndex}) => {
    const tabId = window.tabs[oldIndex];
    remoteAction('reorderTab', window.id, tabId, newIndex);
  }, [window.id, window.tabs]);

  const selectWindowTab = React.useCallback((tabId: string) => {
    remoteAction('selectTab', window.id, tabId);
  }, [window.id]);

  const createWindowTab = React.useCallback((url?: string, select?: boolean) => {
    remoteAction('createTab', window.id, url, select);
  }, [window.id]);

  const destroyTab = React.useCallback((tabId: string) => {
    remoteAction('destroyTab', tabId);
  }, []);

  React.useEffect(() => {
    ipcRenderer.on('deep-link', function (e, url) {
      remoteAction('createTab', 'main', url);
    });
  }, []);

  useShortcuts(React.useCallback((e: KeyboardEvent) => {
    if (e.metaKey && e.key === 't') remoteAction('createTab', window.id);
    else if (e.metaKey && e.key === 'w') remoteAction('destroyTab', window.selectedTabId);
    else if (e.metaKey && e.key === '[') remoteAction('selectPreviousTab', window.id);
    else if (e.metaKey && e.key === ']') remoteAction('selectNextTab', window.id);
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

    const icon = (
      // resource?.state === 'loading' ? 'LoadingIcon' :
      // resource?.state === 'error' ? 'IoIosCloseCircleOutline' :
      page.type === '1' ? 'IoIosFolderOpen' :
      page.type === '7' ? 'IoIosSearch' :
      '0d'.includes(page.type) ? 'IoIosDocument' :
      '4569'.includes(page.type) ? 'IoIosArchive' :
      'Ipgj'.includes(page.type) ? 'IoIosImage' :
      's'.includes(page.type) ? 'IoIosSpeaker' :
      'IoIosCloseCircleOutline'
    );

    return {id, icon, title: page.title};
  }), [tabs]);

  return <Container>
    <TabBar
      tabs={tabBarTabs}
      selectedTabId={window.selectedTabId}
      reorderTab={reorderWindowTab}
      selectTab={selectWindowTab}
      createTab={createWindowTab}
      closeTab={destroyTab}
    />
    {tab? <TabView tab={tab} createTab={createWindowTab}/> : null}
  </Container>
});

const Container = styled(Vertical)`
  flex: 1;
  background-color: #fafafa;
  user-select: none;
  overflow: hidden;
`;
