import {update} from './state';

export interface Recent {
  title: string,
  url: string,
  query?: string,
  type: string,
  timestamp: number,
}

export function makeRecent(title: string, type: string, url: string, query?: string): Recent {
  return {
    title,
    url,
    query,
    type,
    timestamp: Date.now(),
  };
}

export function createRecent(title: string, type: string, url: string, query?: string) {
  update((state) => {
    const recent = makeRecent(title, type, url, query);
    const selector = [url, query].filter(x=>x).join('\t');
    state.recents[selector] = recent;
  });
}
