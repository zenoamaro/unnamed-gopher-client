import {URL} from 'url';
import {uniqueId} from 'lodash';
import * as Gopher from 'gopher';
import {update, withState} from './state';
import {fetchResource} from './resources';

export interface Bookmark {
  id: string,
  title: string,
  url: string,
  query?: string,
  type: string,
}

export function makeBookmark(title: string, type: string, url: string, query?: string): Bookmark {
  return {
    id: uniqueId('bookmark'),
    title,
    url,
    query,
    type: '1',
  };
}

export function createBookmark(title: string, type: string, url: string, query?: string) {
  update((state) => {
    const bookmark = makeBookmark(title, type, url, query);
    state.bookmarks[bookmark.id] = bookmark;
  });
}
