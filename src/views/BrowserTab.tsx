import React from 'react';
import styled from 'styled-components';
import useTraceUpdate from 'use-trace-update';
import {navigateTabBack, navigateTabForward, navigateTab, Tab} from 'core';
import {Vertical} from 'components/Layout';
import NavBar from 'components/NavBar';
import TabHistory from './TabHistory';

const fn = () => {};

export default function BrowserTab(p: {
  tab: Tab,
}) {
  // console.log('BrowserTab');
  // useTraceUpdate(p);

  const {tab} = p;
  const page = tab.history[tab.historyIndex];
  const canNavigateBack = tab.historyIndex > 0;
  const canNavigateForward = tab.historyIndex < tab.history.length -1;

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
