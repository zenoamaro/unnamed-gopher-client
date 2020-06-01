import {update, withState} from './state';
import {Tab} from './tabs';
import {arrayMoveMutate} from 'utils/array';

export interface Window {
  id: string,
  tabs: string[],
  selectedTabId: string,
}

export function makeWindow(tabs: string[]) {
  return {
    id: 'main',
    tabs: tabs,
    selectedTabId: tabs[tabs.length-1],
  }
}

export function selectTab(windowId: string, tabId: string) {
  update((state) => {
    const window = state.windows[windowId];
    window.selectedTabId = tabId;
  });
}

export function selectPreviousTab(windowId: string) {
  const window = withState(state => state.windows[windowId]);
  const index = window.tabs.indexOf(window.selectedTabId);
  const newIndex = (window.tabs.length + index - 1) % window.tabs.length;
  selectTab(window.id, window.tabs[newIndex]);
}

export function selectNextTab(windowId: string) {
  const window = withState(state => state.windows[windowId]);
  const index = window.tabs.indexOf(window.selectedTabId);
  const newIndex = (window.tabs.length + index + 1) % window.tabs.length;
  selectTab(window.id, window.tabs[newIndex]);
}

export function reorderTab(windowId: string, tabId: string, at: number) {
  update((state) => {
    const window = state.windows[windowId];
    const idx = window.tabs.indexOf(tabId);
    arrayMoveMutate(window.tabs, idx, at);
  });
}
