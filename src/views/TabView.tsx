import React from 'react';
import styled from 'styled-components';
import {Tab} from 'core';
import {Vertical} from 'components/Layout';
import NavBar from 'components/NavBar';
import {remoteAction} from 'utils/remoteState';
import useShortcuts from 'utils/useShortcuts';
import HistoryView from './HistoryView';


export default function TabView(p: {
  tab: Tab,
  createTab: (url?: string, select?: boolean) => void,
}) {
  const {tab} = p;
  const page = tab.history[tab.historyIndex];

  const createTab = React.useCallback((url?: string, select?: boolean) => {
    p.createTab(url, select);
  }, [p.createTab]);

  const refreshThisTab = React.useCallback(() => {
    if (tab) remoteAction('refreshTab', tab.id);
  }, [tab.id]);

  const navigateThisTab = React.useCallback((url: string, at?: number) => {
    if (tab) remoteAction('navigateTab', tab.id, url, at);
  }, [tab.id]);

  const navigateThisTabBack = React.useCallback(() => {
    if (tab) remoteAction('navigateTabBack', tab.id);
  }, [tab.id]);

  const navigateThisTabForward = React.useCallback(() => {
    if (tab) remoteAction('navigateTabForward', tab.id);
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
      onNewTab={createTab}
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
