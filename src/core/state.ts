import produce from 'immer';
import Bag from 'utils/Bag';

import {Tab, makeTab} from './tabs';
import {Window, makeWindow} from './windows';

export type Updater = (state: State) => void;
export type Listener = (state: State) => void;

export interface State {
  windows: Bag<Window>,
  tabs: Bag<Tab>,
}

const initialWindow = makeWindow([]);

let state: State = {
  windows: {
    [initialWindow.id]: initialWindow,
  },
  tabs: {},
};

let listeners: Listener[] = [];
let nextUpdate: number | null;

export function update(fn: Updater): void {
  state = produce(state, fn);
  if (!nextUpdate) nextUpdate = requestAnimationFrame(() => {
    nextUpdate = null;
    for (let fn of listeners) fn(state);
  });
}

export function listen(fn: Listener): void {
  listeners.push(fn);
  fn(state);
}
