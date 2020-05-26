import {uniqueId} from 'lodash';
import * as Gopher from 'gopher';
import {update} from './state';
import {makePage, Page} from './pages';

export interface Tab {
  id: string,
  state: 'loading' | 'ready',
  history: Page[],
  historyIndex: number,
}

export function makeTab(url: string) {
  return {
    id: uniqueId('tab'),
    state: 'ready' as 'ready',
    historyIndex: 0,
    history: [
      makePage(url),
    ],
  };
}

export function createTab(windowId: string, url: string) {
  update((store) => {
    const tab = makeTab(url);
    const window = store.windows.main;
    store.tabs[tab.id] = tab;
    window.tabs.push(tab.id);
    window.selectedTabId = tab.id;
  });
}

export function destroyTab(tabId: string) {
  update((store) => {
    delete store.tabs[tabId];
    const window = store.windows.main;
    window.tabs = window.tabs.filter(id => id !== tabId);
    if (window.selectedTabId === tabId) {
      window.selectedTabId = window.tabs[window.tabs.length-1];
    }
  });
}

export function navigateTab(tabId: string, url: string, at?: number) {
  const page = makePage(url);

  update((store) => {
    const tab = store.tabs[tabId];
    if (!at) at = tab.historyIndex;
    tab.history.splice(at+1);
    tab.history.push(page);
    tab.historyIndex = tab.history.length -1;
    tab.state = 'loading';
  });

  Gopher.request(url).pipe(Gopher.parser()).on('data', (item) => {
    update((store) => {
      const tab = store.tabs[tabId];
      tab.history.find(p => p.id === page.id)!.content.push(item);
    });
  }).on('end', () => {
    update((store) => {
      const tab = store.tabs[tabId];
      tab.state = 'ready';
    });
  });
}

export function navigateTabBack(tabId: string) {
  update((store) => {
    const tab = store.tabs[tabId];
    tab.historyIndex = Math.max(0, tab.historyIndex-1);
  });
}

export function navigateTabForward(tabId: string) {
  update((store) => {
    const tab = store.tabs[tabId];
    tab.historyIndex = Math.min(tab.historyIndex+1, tab.history.length-1);
  });
}

export function navigateTabAt(tabId: string, index: number) {
  update((store) => {
    const tab = store.tabs[tabId];
    tab.historyIndex = Math.max(0, Math.min(index, tab.history.length-1));
  });
}
