import {shell} from 'electron';
import {uniqueId} from 'lodash';
import {update, withState} from './state';
import {makePage, Page, navigatePage, reloadPage} from './pages';


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

export function createTab(windowId: string, url?: string, select = true, fresh = false) {
  const tab = makeTab(url);
  update((state) => {
    const window = state.windows.main;
    state.tabs[tab.id] = tab;
    window.tabs.push(tab.id);
    if (select) window.selectedTabId = tab.id;
  });
  if (url) navigateTab(tab.id, url, undefined, fresh);
}

export function destroyTab(tabId: string) {
  update((state) => {
    delete state.tabs[tabId];
    const window = state.windows.main;
    const index = window.tabs.findIndex(t => t === tabId);
    window.tabs = window.tabs.filter(t => t !== tabId);
    if (window.selectedTabId === tabId) {
      const newIndex = Math.min(index, window.tabs.length-1);
      window.selectedTabId = window.tabs[newIndex];
    }
  });
}

export function navigateTab(tabId: string, url: string, at?: number, fresh = false) {
  // FIXME
  const page = makePage('', '');
  update((state) => {
    const tab = state.tabs[tabId];
    if (at == null) at = tab.historyIndex;
    tab.history.splice(at);
    tab.history.push(page);
    tab.historyIndex = tab.history.length -1;
  });
  navigatePage(tabId, page.id, url, fresh);
}

export function reloadTab(tabId: string, at?: number) {
  const page = withState((state) => {
    const tab = state.tabs[tabId];
    return tab.history[at ?? tab.historyIndex];
  });
  if (page) reloadPage(tabId, page.id);
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

export function navigateTabAt(tabId: string, at: number) {
  update((state) => {
    const tab = state.tabs[tabId];
    tab.historyIndex = Math.max(0, Math.min(at, tab.history.length-1));
  });
}

export type VisitMode = (
  'push' |
  'replace' |
  'new-window' |
  'background-tab' |
  'foreground-tab' |
  'save-to-disk' |
  'other' |
  'default'
);

export function visit(url: string, mode: VisitMode = 'push', at?: number) {
  if (url.startsWith('file://')) return false;

  if (!url.startsWith('gopher://')) {
    shell.openExternal(url);
    return true;
  };

  const {window, tab} = withState((state) => {
    // FIXME HARDCODE windows
    const window = state.windows.main;
    const tab = state.tabs[window.selectedTabId];
    return {window, tab};
  });

  if (mode === 'push' || mode === 'replace') {
    navigateTab(tab.id, url, (at ?? tab.historyIndex) + (mode === 'replace'? 0 : 1));
  } else if (mode === 'new-window' || mode === 'background-tab') {
    createTab(window.id, url, false);
  } else if (mode === 'foreground-tab') {
    createTab(window.id, url, true);
  } else if (mode === 'save-to-disk') {
    //
  } else {
    navigateTab(tab.id, url);
  }

  return true;
}
