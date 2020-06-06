import {update} from './state';

export interface Recent {
  title: string,
  url: string,
  type: string,
  timestamp: number,
}

export function makeRecent(title: string, type: string, url: string): Recent {
  return {
    title,
    url,
    type,
    timestamp: Date.now(),
  };
}

export function createRecent(title: string, type: string, url: string) {
  update((state) => {
    const recent = makeRecent(title, type, url);
    state.recents[url] = recent;
  });
}
