import * as Gopher from 'gopher';
import {uniqueId} from 'lodash';
import {update} from './state';

export interface Page {
  id: string,
  url: string,
  content: Gopher.Item[],
}

export function makePage(url: string) {
  return {
    id: uniqueId('page'),
    url,
    content: [],
  };
}
