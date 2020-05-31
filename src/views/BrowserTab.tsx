import React from 'react';
import styled from 'styled-components';
import {pointTabHistoryBack, pointTabHistoryForward, navigateTab, Tab, navigatePage, Resource, refreshPage, refreshTab} from 'core';
import {Vertical} from 'components/Layout';
import NavBar from 'components/NavBar';
import TabHistory from './TabHistory';
import useShortcuts from 'utils/useShortcuts';
import Bag from 'utils/Bag';


export default function BrowserTab(p: {
  tab: Tab,
  resources: Bag<Resource>,
}) {
  const {tab, resources} = p;
  if (!tab) return null;

  const page = tab.history[tab.historyIndex];
  const canRefresh = tab.history.length > 0;
  const canNavigateBack = tab.historyIndex > 0;
  const canNavigateForward = tab.historyIndex < tab.history.length -1;

  const refreshThisTab = React.useCallback(() => {
    refreshTab(tab.id);
  }, [tab.id]);

  const navigateThisTab = React.useCallback((url: string, at?: number) => {
    navigateTab(tab.id, url, at);
  }, [tab.id]);

  const navigateThisTabBack = React.useCallback(() => {
    pointTabHistoryBack(tab.id);
  }, [tab.id]);

  const navigateThisTabForward = React.useCallback(() => {
    pointTabHistoryForward(tab.id);
  }, [tab.id]);

  const openSettings = React.useCallback(() => {}, []);

  useShortcuts(React.useCallback((e: KeyboardEvent) => {
    if (e.metaKey && e.key === 'r') refreshThisTab();
    else if (e.metaKey && e.key === 'ArrowLeft') navigateThisTabBack();
    else if (e.metaKey && e.key === 'ArrowRight') navigateThisTabForward();
    else return true;
  }, [refreshThisTab]));

  return <Container>
    <NavBar
      url={page?.url}
      canRefresh={canRefresh}
      canNavigateBack={canNavigateBack}
      canNavigateForward={canNavigateForward}
      onRefresh={refreshThisTab}
      onNavigate={navigateThisTab}
      onNavigateBack={navigateThisTabBack}
      onNavigateForward={navigateThisTabForward}
      onOpenSettings={openSettings}
    />

    <TabHistory tab={tab} resources={resources} onVisit={navigateThisTab}/>
  </Container>;
}

const Container = styled(Vertical)`
  flex: 1;
  overflow: hidden;
`;
