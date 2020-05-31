import {uniqueId} from 'lodash';
import {update, withState} from './state';
import {makePage, Page, navigatePage, refreshPage} from './pages';


export interface Tab {
  id: string,
  history: Page[],
  historyIndex: number,
}

export function makeTab(url?: string) {
  return {
    id: uniqueId('tab'),
    historyIndex: 0,
    history: [],
  };
}

export function createTab(windowId: string, url?: string, select: boolean = true) {
  const tab = makeTab(url);
  update((state) => {
    const window = state.windows.main;
    state.tabs[tab.id] = tab;
    window.tabs.push(tab.id);
    if (select) window.selectedTabId = tab.id;
  });
  if (url) navigateTab(tab.id, url);
}

export function destroyTab(tabId: string) {
  update((state) => {
    delete state.tabs[tabId];
    const window = state.windows.main;
    window.tabs = window.tabs.filter(id => id !== tabId);
    if (window.selectedTabId === tabId) {
      window.selectedTabId = window.tabs[window.tabs.length-1];
    }
  });
}

export function navigateTab(tabId: string, url: string, at?: number, fresh = false) {
  let page = makePage(url);
  update((state) => {
    const tab = state.tabs[tabId];
    if (at == null) at = tab.historyIndex;
    tab.history.splice(at);
    tab.history.push(page);
    tab.historyIndex = tab.history.length -1;
  });
  navigatePage(tabId, page.id, url, undefined, fresh);
}

export function refreshTab(tabId: string, at?: number) {
  const page = withState((state) => {
    const tab = state.tabs[tabId];
    return tab.history[at ?? tab.historyIndex];
  });
  refreshPage(tabId, page.id);
}

export function pointTabHistoryBack(tabId: string) {
  update((state) => {
    const tab = state.tabs[tabId];
    tab.historyIndex = Math.max(0, tab.historyIndex-1);
  });
}

export function pointTabHistoryForward(tabId: string) {
  update((state) => {
    const tab = state.tabs[tabId];
    tab.historyIndex = Math.min(tab.historyIndex+1, tab.history.length-1);
  });
}

export function pointTabHistoryAt(tabId: string, at: number) {
  update((state) => {
    const tab = state.tabs[tabId];
    tab.historyIndex = Math.max(0, Math.min(at, tab.history.length-1));
  });
}
