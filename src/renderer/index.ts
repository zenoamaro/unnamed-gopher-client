import {shell} from 'electron';
import transform from 'through2';
import * as Gopher from '../gopher';

import './index.html';
import './styles.css';

export type ItemRenderer = (item: Gopher.Item) => string;

export function renderer(renderers=itemRenderers) {
  return transform.obj(function (item, enc, done) {
    this.push(renderItem(item, renderers));
    done();
  });
}

export function renderItem(item: Gopher.Item, renderers=itemRenderers): string {
  const renderer = renderers[item.type] ?? renderers.default;
  return renderer(item);
}

export const renderItemType = (type:string, label:string, url?:string, icon?:string) => (`
  <div class="item" type="${type}">
    ${icon? `<span class="item-icon">${icon}</span>` : ''}
    ${url? `<a class="item-link" href="${url}">` : ''}
    <span class="item-label">${label||'&nbsp;'}</span>
    ${url? `</a>` : ''}
  </div>
`);

export const infoItemRenderer: ItemRenderer = (item: Gopher.Item) => (
  renderItemType(item.type, item.label)
);

export const errorItemRenderer: ItemRenderer = (item: Gopher.Item) => (
  renderItemType(item.type, item.label, undefined, '❌')
);

export const directoryItemRenderer: ItemRenderer = (item: Gopher.Item) => (
  renderItemType(item.type, item.label, item.url, '📁')
);

export const fileItemRenderer: ItemRenderer = (item: Gopher.Item) => (
  renderItemType(item.type, item.label, item.url, '📄')
);

export const urlItemRenderer: ItemRenderer = (item: Gopher.Item) => (
  renderItemType(item.type, item.label, item.url, '🌐')
);

export const searchItemRenderer: ItemRenderer = (item: Gopher.Item) => (`
  <div class="item">
    <span class="item-icon">🔍</span>
    <input type="search" placeholder="${item.label}">
  </div>
`);

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
  '.': () => '',
};

const $navBack = <HTMLButtonElement>document.getElementById('nav-back')!;
const $navForward = <HTMLButtonElement>document.getElementById('nav-forward')!;
const $navAddress = <HTMLInputElement>document.getElementById('nav-address')!;
$navBack.addEventListener('click', () => historyBack());
$navForward.addEventListener('click', () => historyForward());

const $panes = <NodeList>document.querySelectorAll('#viewport .viewport-pane');
const $contents = <NodeList>document.querySelectorAll('#viewport .content');

$contents.forEach(($content, i) => {
  $content.addEventListener('click', (event) => {
    event.preventDefault();
    const target = <HTMLElement>event.target;
    const link = <HTMLAnchorElement>target.parentElement;
    if (!link?.classList.contains('item-link')) return;

    if (link.href.match(/^gopher:\/\//)) {
      if (i===0 && history[historyPointer-1]) historyPointer--;
      historyPush(link.href);
    } else if (link.href.match(/^https?:\/\//)) {
      shell.openExternal(link.href);
    }
  });
});

$navAddress.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    const url = $navAddress.value.trim();
    if (url) historyPush(url);
    event.preventDefault();
  }
});


// HISTORY –————————————————————————————————————————————————————————————————————

interface HistoryPoint {
  url: string,
  content: string,
};

const history: HistoryPoint[] = [];
let historyPointer = 0;

function historyPush(url: string) {
  const point: HistoryPoint = {url, content:''};
  history.splice(historyPointer+1);
  history.push(point);
  historyPointer = history.length -1;
  historyUpdate();
  fetch(point);
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
  const points = history.slice(Math.max(0, historyPointer-1), historyPointer+2);
  const prev = history[historyPointer-1];
  const curr = history[historyPointer];
  const next = history[historyPointer+1];

  $navAddress.value = curr?.url;
  $navBack.disabled = !prev;
  $navForward.disabled = !next;

  (<HTMLElement>$contents[0]).innerHTML = points[0]?.content ?? '';

  if (prev) {
    (<HTMLElement>$contents[1]).innerHTML = points[1]?.content ?? '';
    (<HTMLElement>$panes[1]).removeAttribute('hidden');
  } else {
    (<HTMLElement>$contents[1]).innerHTML = '';
    (<HTMLElement>$panes[1]).setAttribute('hidden', 'true');
  }
}


// NAV –————————————————————————————————————————————————————————————————————————

function fetch(point: HistoryPoint) {
  const url = Gopher.parseGopherUrl(point.url);
  const request = Gopher.request(point.url);

  if (url.type) {
    let buffer = Buffer.from([]);
    historyUpdate();
    request.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      point.content = `Loading: ${Math.round(buffer.length/1024)} KB`;
      historyUpdate();
    });
    request.on('end', () => {
      const type = (
        url.type === '1'? 'text/plain' :
        url.type === 'I'? 'image/*' :
        url.type === 'p'? 'image/png' :
        url.type === 'g'? 'image/gif' :
        url.type === 'j'? 'image/jpeg' :
        url.type === 's'? 'audio/*' :
        url.type === 'j'? 'application/octet-stream' :
        ''
      );
      const basename = url.pathname.split('/').slice(-1)[0];
      const blob = new Blob([buffer], {type});
      const obj = URL.createObjectURL(blob);
      point.content = (
        url.type === '0'? `<pre>${buffer.toString()}</pre>` :
        url.type === 'I'? `<img src="${obj}">` :
        url.type === 'p'? `<img src="${obj}">` :
        url.type === 'g'? `<img src="${obj}">` :
        url.type === 'j'? `<img src="${obj}">` :
        url.type === 's'? `<audio controls src="${obj}"/>` :
        `<a download="${basename}" href="${obj}">${basename}</a>`
      );
      historyUpdate();
    });
    return;
  } else {
    request
      .pipe(Gopher.parser())
      .pipe(renderer(itemRenderers))
      .on('data', (line: string) => {
        point.content += line;
      }).on('end', () => {
        historyUpdate();
      });
  }

}


// START ———————————————————————————————————————————————————————————————————————

historyPush('gopher.floodgap.com');
