import React from 'react';
import produce from 'immer';
import {get} from 'lodash';
import Bag from 'utils/Bag';
import {fromPairs} from 'lodash';

import {Bookmark, makeBookmark} from './bookmarks';
import {Tab} from './tabs';
import {Window, makeWindow} from './windows';
import {Resource} from 'core/resources';
import {Recent} from 'core/recents';

export interface Cursor<T> {
  path: string[],
  setter: (state: T) => void,
  value: T,
}

export type Getter<T> = (state: State) => T;
export type Updater = (state: State) => void;

export interface State {
  windows: Bag<Window>,
  tabs: Bag<Tab>,
  resources: Bag<Resource>,
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
  resources: {},
  bookmarks: initialBookmarks,
  recents: {},
};

let cursors: Cursor<any>[] = [];
let nextUpdate: number | null;

export function withState<T>(fn: Getter<T>): T {
  return fn(state);
}

export function update(fn: Updater): void {
  state = produce(state, fn);

  if (!nextUpdate) nextUpdate = requestAnimationFrame(() => {
    nextUpdate = null;
    for (let cur of cursors) updateCursor(cur);
  });
}

export function updateCursor<T>(cur: Cursor<T>) {
  const newValue = cur.path.length? get(state, cur.path) : state;
  if (newValue !== cur.value) cur.setter(newValue);
}

export function useCursor<T>(path: string[] = []): T {
  const initialValue = path.length ? get(state, path) : state;
  const [value, setter] = React.useState<T>(initialValue);
  const cursor = {path, setter, value};

  React.useEffect(() => {
    cursors.push(cursor);
    updateCursor(cursor); // Catch updates that happened before useEffect
    return () => {cursors = cursors.filter(c => c.setter !== setter)};
  }, [ JSON.stringify(path) ]);

  return value;
}
