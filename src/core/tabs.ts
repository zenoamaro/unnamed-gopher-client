import {uniqueId} from 'lodash';
import * as Gopher from 'gopher';
import {update} from './state';
import {makePage, Page} from './pages';
import {parseGopherUrl} from 'gopher';
import {URL} from 'url';

export interface Tab {
  id: string,
  history: Page[],
  historyIndex: number,
}

export function makeTab(url: string) {
  return {
    id: uniqueId('tab'),
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
  let query;

  try {
    new URL(url);
  } catch (err) {
    query = url;
    url = `gopher://gopher.floodgap.com/v2/vs`;
  }

  const parsedUrl = parseGopherUrl(url);
  let page = makePage(url, query);
  page.type = parsedUrl.type ?? '1';
  page.state = 'loading';

  update((store) => {
    const tab = store.tabs[tabId];
    if (!at) at = tab.historyIndex;
    tab.history.splice(at+1);
    tab.history.push(page);
    tab.historyIndex = tab.history.length -1;
  });

  Gopher.request(url, query).on('data', (chunk) => {
    update((store) => {
      const tab = store.tabs[tabId];
      const pp: Page = tab.history.find(p => p.id === page.id)!;
      pp.raw = Buffer.concat([pp.raw, chunk]);
    });
  }).on('end', () => {
    update((store) => {
      const tab = store.tabs[tabId];
      const pp: Page = tab.history.find(p => p.id === page.id)!;
      pp.state = 'ready';
      if (pp.type === '1') {
        pp.content = Gopher.parse(pp.raw.toString());
      }
    });
  }).on('error', (err) => {
    update((store) => {
      const tab = store.tabs[tabId];
      const pp: Page = tab.history.find(p => p.id === page.id)!;
      pp.state = 'error';
      pp.type = '3';
      pp.raw = Buffer.from(err.message);
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
