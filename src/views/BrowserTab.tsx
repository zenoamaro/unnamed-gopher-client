import React from 'react';
import styled from 'styled-components';
import useTraceUpdate from 'use-trace-update';
import {navigateTabBack, navigateTabForward, navigateTab, Tab, navigatePage} from 'core';
import {Vertical} from 'components/Layout';
import NavBar from 'components/NavBar';
import TabHistory from './TabHistory';


export default function BrowserTab(p: {
  tab: Tab,
}) {
  const {tab} = p;
  if (!tab) return null;

  const page = tab.history[tab.historyIndex];
  const canNavigateBack = tab.historyIndex > 0;
  const canNavigateForward = tab.historyIndex < tab.history.length -1;

  const refreshThisTab = React.useMemo(() => () => {
    navigatePage(tab.id, page.id, page.url, page.query);
  }, [tab.id, page.id]);

  const navigateThisTab = React.useMemo(() => (url: string, at?: number) => {
    navigateTab(tab.id, url, at);
  }, [tab.id]);

  const navigateThisTabBack = React.useMemo(() => () => {
    navigateTabBack(tab.id);
  }, [tab.id]);

  const navigateThisTabForward = React.useMemo(() => () => {
    navigateTabForward(tab.id);
  }, [tab.id]);

  const openSettings = React.useMemo(() => () => {}, []);

  return <Container>
    <NavBar
      url={page?.url}
      canNavigateBack={canNavigateBack}
      canNavigateForward={canNavigateForward}
      onRefresh={refreshThisTab}
      onNavigate={navigateThisTab}
      onNavigateBack={navigateThisTabBack}
      onNavigateForward={navigateThisTabForward}
      onOpenSettings={openSettings}
    />

    <TabHistory tab={tab} onVisit={navigateThisTab}/>
  </Container>;
}

const Container = styled(Vertical)`
  flex: 1;
  overflow: hidden;
`;
