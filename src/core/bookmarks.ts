import {uniqueId} from 'lodash';
import {update} from './state';

export interface Bookmark {
  id: string,
  title: string,
  url: string,
  type: string,
}

export function makeBookmark(title: string, type: string, url: string): Bookmark {
  return {
    id: uniqueId('bookmark'),
    title,
    url,
    type,
  };
}

export function createBookmark(title: string, type: string, url: string) {
  update((state) => {
    const bookmark = makeBookmark(title, type, url);
    state.bookmarks[bookmark.id] = bookmark;
  });
}
