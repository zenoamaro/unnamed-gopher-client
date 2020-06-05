import produce from 'immer';
import Bag from 'utils/Bag';
import {fromPairs} from 'lodash';

import {Bookmark, makeBookmark} from './bookmarks';
import {Tab} from './tabs';
import {Window, makeWindow} from './windows';
import {Recent} from 'core/recents';


// State ———————————————————————————————————————————————————————————————————————

export interface State {
  windows: Bag<Window>,
  tabs: Bag<Tab>,
  bookmarks: Bag<Bookmark>,
  recents: Bag<Recent>,
}

const initialWindow = makeWindow([]);

const initialBookmarks = fromPairs([
  makeBookmark('Bitreich', '1', 'gopher://bitreich.org'),
  makeBookmark('Floodgap', '1', 'gopher://gopher.floodgap.com'),
  makeBookmark('SDF', '1', 'gopher://sdf.org'),
  makeBookmark('Quux', '1', 'gopher://quux.org'),
].map(bookmark => [bookmark.id, bookmark]));

let state: State = {
  windows: {
    [initialWindow.id]: initialWindow,
  },
  tabs: {},
  bookmarks: initialBookmarks,
  recents: {},
};


// Updates —————————————————————————————————————————————————————————————————————

export type Getter<T> = (state: State) => T;
export type Updater = (state: State) => void;

let nextUpdate: number | null;

export function withState<T>(fn: Getter<T>): T {
  return fn(state);
}

export function update(fn: Updater): void {
  state = produce(state, fn);

  if (!nextUpdate) nextUpdate = setTimeout(() => {
    nextUpdate = null;
    for (let fn of listeners) fn(state);
  }, 16);
}


// Listeners ———————————————————————————————————————————————————————————————————

export type Subscriber = (state: State) => void;

let listeners: Subscriber[] = [];

export function subscribe(fn: Subscriber) {
  listeners.push(fn);
}

export function unsubscribe(fn: Subscriber) {
  listeners = listeners.filter(l => l !== fn);
}
