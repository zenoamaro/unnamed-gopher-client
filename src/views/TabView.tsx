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

  const reloadTab = React.useCallback(() => {
    if (tab) remoteAction('reloadTab', tab.id);
  }, [tab.id]);

  const navigate = React.useCallback((url: string, mode: string) => {
    remoteAction('visit', url, mode);
  }, []);

  const navigateBack = React.useCallback(() => {
    if (tab) remoteAction('navigateTabBack', tab.id);
  }, [tab.id]);

  const navigateForward = React.useCallback(() => {
    if (tab) remoteAction('navigateTabForward', tab.id);
  }, [tab.id]);

  const openSettings = React.useCallback(() => {}, []);

  useShortcuts(React.useCallback((e: KeyboardEvent) => {
    if (e.metaKey && e.key === 'r') reloadTab();
    else if (e.metaKey && e.key === 'ArrowLeft') navigateBack();
    else if (e.metaKey && e.key === 'ArrowRight') navigateForward();
    else return false;
  }, [reloadTab]));

  const canReload = tab.history.length > 0;
  const canNavigateBack = tab.historyIndex > 0;
  const canNavigateForward = tab.historyIndex < tab.history.length -1;

  return <Container>
    <NavBar
      url={page?.url}
      canReload={canReload}
      canNavigateBack={canNavigateBack}
      canNavigateForward={canNavigateForward}
      onReload={reloadTab}
      onNewTab={createTab}
      onNavigate={navigate}
      onNavigateBack={navigateBack}
      onNavigateForward={navigateForward}
      onOpenSettings={openSettings}
    />

    <HistoryView tab={tab}/>
  </Container>;
}

const Container = styled(Vertical)`
  flex: 1;
  overflow: hidden;
`;
