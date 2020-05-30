import * as Gopher from 'gopher';
import {uniqueId} from 'lodash';
import {update} from './state';

export interface Page {
  id: string,
  url: string,
  query?: string,
  type: string,
  state: 'loading' | 'ready' | 'error',
  raw: Buffer,
  content: Gopher.Item[],
}

export function makePage(url: string, query?: string): Page {
  return {
    id: uniqueId('page'),
    url,
    query,
    type: '1',
    state: 'ready',
    raw: Buffer.from([]),
    content: [],
  };
}
