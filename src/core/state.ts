import produce, {Patch} from 'immer';
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

const collectedPatches: Patch[] = [];
let nextUpdate: number | null;

export function withState<T>(receiver: Getter<T>): T {
  return receiver(state);
}

export function update(producer: Updater): void {
  state = produce(
    state,
    producer,
    (patches) => collectedPatches.push(...patches),
  );
  if (!nextUpdate) nextUpdate = setTimeout(() => {
    for (let subscriber of subscribers) {
      subscriber(state, collectedPatches);
    }
    nextUpdate = null;
    collectedPatches.splice(0);
  }, 16);
}


// Listeners ———————————————————————————————————————————————————————————————————

export type Subscriber = (state: State, patches: Patch[]) => void;

let subscribers: Subscriber[] = [];

export function subscribe(subscriber: Subscriber) {
  subscribers.push(subscriber);
}

export function unsubscribe(subscriber: Subscriber) {
  subscribers = subscribers.filter(l => l !== subscriber);
}
