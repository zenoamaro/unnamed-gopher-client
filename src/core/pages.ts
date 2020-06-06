import {URL} from 'url';
import {uniqueId} from 'lodash';
import * as Gopher from 'gopher';
import {update, withState} from './state';
import {createRecent} from './recents';
import {capitalized} from 'utils/text';

export interface Page {
  id: string,
  title: string,
  url: string,
  type: string,
  scroll: number,
}

export function makePage(title: string, url: string): Page {
  return {
    id: uniqueId('page'),
    title,
    url,
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

export function navigatePage(tabId: string, pageId: string, url: string, fresh = false) {
  // TODO Doesn't belong here
  try {
    new URL(url);
  } catch (err) {
    url = `gopher://gopher.floodgap.com/7/v2/vs%09${url}`;
  }

  const parsedUrl = Gopher.parseGopherUrl(url);

  const title = [
    parsedUrl.query ?? capitalized(parsedUrl.pathname.replace(/\/$/, '').split('/').slice(-1)[0]),
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
  });

  if (changedUrl) {
    createRecent(title, parsedUrl.type || '1', url);
  }
}

export function refreshPage(tabId: string, pageId: string) {
  withState((state) => {
    const tab = state.tabs[tabId]!;
    const page = tab.history.find(p => p.id === pageId)!;
    navigatePage(tabId, pageId, page.url, true);
  });
}
