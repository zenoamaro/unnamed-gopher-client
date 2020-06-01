import {URL} from 'url';
import {uniqueId} from 'lodash';
import * as Gopher from 'gopher';
import {update, withState} from './state';
import {createRecent} from './recents';
import {fetchResource} from './resources';
import {capitalized} from 'utils/text';

export interface Page {
  id: string,
  title: string,
  url: string,
  query?: string,
  type: string,
  scroll: number,
}

export function makePage(title: string, url: string, query?: string): Page {
  return {
    id: uniqueId('page'),
    title,
    url,
    query,
    type: '1',
    scroll: 0,
  };
}

export function scrollPage(tabId: string, pageId: string, scroll: number) {
  update((state) => {
    const tab = state.tabs[tabId]!;
    if (!tab) return;
    const pageIndex = tab.history.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return;
    tab.history[pageIndex].scroll = scroll;
  });
}

export function navigatePage(tabId: string, pageId: string, url: string, query?: string, fresh = false) {
  if (url.includes('\t')) {
    [url, query] = url.split('\t');
  }

  // TODO Doesn't belong here
  try {
    new URL(url);
  } catch (err) {
    query = url;
    url = `gopher://gopher.floodgap.com/7/v2/vs`;
  }

  const parsedUrl = Gopher.parseGopherUrl(url);

  const title = [
    query ?? capitalized(parsedUrl.pathname.replace(/\/$/, '').split('/').slice(-1)[0]),
    parsedUrl.hostname,
  ].filter(Boolean).join(' - ');

  let changedUrl = false;
  update((state) => {
    const tab = state.tabs[tabId]!;
    const page = tab.history.find(p => p.id === pageId)!;
    if (page.url !== url) changedUrl = true;
    page.title = title;
    page.type = parsedUrl.type || '1';
    page.url = url;
    page.query = query;
  });

  if (changedUrl) {
    // TODO Figure out how to have search
    if (parsedUrl.type !== '7') {
      createRecent(title, parsedUrl.type || '1', url, query);
    }
  }

  fetchResource([url, query].filter(Boolean).join('\t'), fresh);
}

export function refreshPage(tabId: string, pageId: string) {
  withState((state) => {
    const tab = state.tabs[tabId]!;
    const page = tab.history.find(p => p.id === pageId)!;
    navigatePage(tabId, pageId, page.url, page.query, true);
  });
}
