import {uniqueId} from 'lodash';
import {update} from './state';

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
