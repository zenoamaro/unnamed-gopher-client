import {uniqueId} from 'lodash';
import {update} from './state';
import {makePage, Page, navigatePage} from './pages';


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

export function navigateTab(tabId: string, url: string, at?: number) {
  let page = makePage(url);
  update((state) => {
    const tab = state.tabs[tabId];
    if (at == null) at = tab.historyIndex;
    tab.history.splice(at);
    tab.history.push(page);
    tab.historyIndex = tab.history.length -1;
  });
  navigatePage(tabId, page.id, url);
}

export function navigateTabBack(tabId: string) {
  update((state) => {
    const tab = state.tabs[tabId];
    tab.historyIndex = Math.max(0, tab.historyIndex-1);
  });
}

export function navigateTabForward(tabId: string) {
  update((state) => {
    const tab = state.tabs[tabId];
    tab.historyIndex = Math.min(tab.historyIndex+1, tab.history.length-1);
  });
}

export function navigateTabAt(tabId: string, index: number) {
  update((state) => {
    const tab = state.tabs[tabId];
    tab.historyIndex = Math.max(0, Math.min(index, tab.history.length-1));
  });
}
