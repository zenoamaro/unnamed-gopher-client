import {shell} from 'electron';
import transform from 'through2';
import * as Gopher from './gopher';

export type ItemRenderer = (item: Gopher.Item) => string;

export function renderItem(item: Gopher.Item, renderers=itemRenderers): string {
  const renderer = renderers[item.type] ?? renderers.default;
  return renderer(item);
}

export function render(items: Gopher.Item[], renderers=itemRenderers) {
  return items.map(item => renderItem(item, renderers)).join('');
}

export function renderer(renderers=itemRenderers) {
  return transform.obj(function (item, enc, done) {
    this.push(renderItem(item, renderers));
    done();
  });
}

export const infoItemRenderer: ItemRenderer = (item: Gopher.Item) => (
  `<p>${item.label}</p>`
);

export const errorItemRenderer: ItemRenderer = (item: Gopher.Item) => (
  `<p>❌ ${item.label}</p>`
);

export const directoryItemRenderer: ItemRenderer = (item: Gopher.Item) => (
  `<p><a href="${item.url}">📁 ${item.label}</a></p>`
);

export const fileItemRenderer: ItemRenderer = (item: Gopher.Item) => (
  `<p><a href="${item.url}">📄 ${item.label}</a></p>`
);

export const urlItemRenderer: ItemRenderer = (item: Gopher.Item) => (
  `<p><a href="${item.url}">🌐 ${item.label}</a></p>`
);

export const searchItemRenderer: ItemRenderer = (item: Gopher.Item) => (
  `<p>🔍 <input type="search" placeholder="${item.label}"></p>`
);

export const itemRenderers: {[type: string]: ItemRenderer} = {
  'default': infoItemRenderer,
  '0': fileItemRenderer,
  '1': directoryItemRenderer,
  '3': errorItemRenderer,
  '4': fileItemRenderer,
  '5': fileItemRenderer,
  '6': fileItemRenderer,
  '7': searchItemRenderer,
  '9': fileItemRenderer,
  'd': fileItemRenderer,
  'f': fileItemRenderer,
  'g': fileItemRenderer,
  'h': urlItemRenderer,
  'I': fileItemRenderer,
  'i': infoItemRenderer,
  'j': fileItemRenderer,
  'p': fileItemRenderer,
  'x': fileItemRenderer,
};

const $navBack = <HTMLButtonElement>document.getElementById('nav-back')!;
const $navForward = <HTMLButtonElement>document.getElementById('nav-forward')!;
const $navAddress = <HTMLInputElement>document.getElementById('nav-address')!;
const $content = <HTMLElement>document.getElementById('content')!;

$navBack.addEventListener('click', () => historyBack());
$navForward.addEventListener('click', () => historyForward());

$content.addEventListener('click', (event) => {
  if ((<HTMLElement>event.target)!.tagName === 'A') {
    const a = <HTMLAnchorElement>event.target;
    if (a.href.match(/^gopher:\/\//)) {
      historyPush(a.href);
    } else if (a.href.match(/^https?:\/\//)) {
      shell.openExternal(a.href);
    }
    event.preventDefault();
  }
});

$navAddress.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    const url = $navAddress.value.trim();
    if (url) historyPush(url);
    event.preventDefault();
  }
});


// HISTORY –————————————————————————————————————————————————————————————————————

const history: string[] = [];
let historyPointer = 0;

function historyPush(url: string) {
  history.splice(historyPointer+1);
  history.push(url);
  historyPointer = history.length -1;
  historyUpdate();
}

function historyBack() {
  historyPointer = Math.max(0, Math.min(historyPointer-1, history.length));
  historyUpdate();
}

function historyForward() {
  historyPointer = Math.max(0, Math.min(historyPointer+1, history.length));
  historyUpdate();
}

function historyUpdate() {
  $navBack.disabled = historyPointer < 1;
  $navForward.disabled = historyPointer >= history.length -1;
  const url = history[historyPointer];
  $navAddress.value = url;
  visit(url);
}


// NAV –————————————————————————————————————————————————————————————————————————

function visit(url: string) {
  $content.innerHTML = '';
  Gopher.request(url)
    .pipe(Gopher.parser())
    .pipe(renderer(itemRenderers))
    .on('data', (line: string) => {
      $content.innerHTML += line;
    });
}


// START ———————————————————————————————————————————————————————————————————————

historyPush('gopher.floodgap.com');
