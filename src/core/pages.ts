import * as Gopher from 'gopher';
import {uniqueId} from 'lodash';
import {update} from './state';

export interface Page {
  id: string,
  url: string,
  type: string,
  state: 'loading' | 'ready',
  raw: Buffer,
  content: Gopher.Item[],
}

export function makePage(url: string): Page {
  return {
    id: uniqueId('page'),
    url,
    type: '1',
    state: 'ready',
    raw: Buffer.from([]),
    content: [],
  };
}
