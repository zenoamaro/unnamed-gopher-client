import React from 'react';
import styled from 'styled-components';
import {Vertical} from 'components/Layout';
import NavBar from 'components/NavBar';
import useShortcuts from 'utils/useShortcuts';
import HistoryView from './HistoryView';

import {
  navigateTabBack,
  navigateTabForward,
  navigateTab,
  Tab,
  refreshTab,
  useCursor,
} from 'core';


export default function TabView(p: {
  tab: Tab,
}) {
  const {tab} = p;
  const page = tab.history[tab.historyIndex];

  const refreshThisTab = React.useCallback(() => {
    if (tab) refreshTab(tab.id);
  }, [tab.id]);

  const navigateThisTab = React.useCallback((url: string, at?: number) => {
    if (tab) navigateTab(tab.id, url, at);
  }, [tab.id]);

  const navigateThisTabBack = React.useCallback(() => {
    if (tab) navigateTabBack(tab.id);
  }, [tab.id]);

  const navigateThisTabForward = React.useCallback(() => {
    if (tab) navigateTabForward(tab.id);
  }, [tab.id]);

  const openSettings = React.useCallback(() => {}, []);

  useShortcuts(React.useCallback((e: KeyboardEvent) => {
    if (e.metaKey && e.key === 'r') refreshThisTab();
    else if (e.metaKey && e.key === 'ArrowLeft') navigateThisTabBack();
    else if (e.metaKey && e.key === 'ArrowRight') navigateThisTabForward();
    else return true;
  }, [refreshThisTab]));

  const canRefresh = tab.history.length > 0;
  const canNavigateBack = tab.historyIndex > 0;
  const canNavigateForward = tab.historyIndex < tab.history.length -1;

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

    <HistoryView tab={tab} onVisit={navigateThisTab}/>
  </Container>;
}

const Container = styled(Vertical)`
  flex: 1;
  overflow: hidden;
`;
