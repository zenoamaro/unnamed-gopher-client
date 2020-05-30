import React from 'react';
import styled from 'styled-components';
import {State, selectTab, createTab, destroyTab, navigateTab} from 'core';
import {Vertical} from 'components/Layout';
import TabBar from 'components/TabBar';
import BrowserTab from './BrowserTab';

export default function Browser(p: {
  state: State
}) {
  // console.log('Browser');

  const window = p.state.windows.main;
  const tabs = window.tabs.map(tabId => p.state.tabs[tabId]);
  if (!tabs.length) close();

  const tab = p.state.tabs[window.selectedTabId];

  React.useEffect(() => navigateTab(tab.id, 'gopher://start'), []);

  const selectWindowTab = React.useMemo(() => (tabId: string) => {
    selectTab(window.id, tabId);
  }, [window.id])

  const createWindowTab = React.useMemo(() => () => {
    createTab(window.id);
  }, [window.id]);

  return <Container>
    <TabBar
      tabs={tabs}
      selectedTabId={window.selectedTabId}
      onSelectTab={selectWindowTab}
      onCreateTab={createWindowTab}
      onCloseTab={destroyTab}
    />
    <BrowserTab tab={tab}/>
  </Container>;
}

const Container = styled(Vertical)`
  flex: 1;
  background-color: #fafafa;
  user-select: none;
  overflow: hidden;
`;
