import * as Gopher from 'gopher';
import {uniqueId} from 'lodash';
import {update} from './state';
import {URL} from 'url';

// @ts-ignore
import {createReadStream} from 'streamifier';


const START_PAGE = (`
iWelcome to your start page!\t\t\t
i1234567890123456789012345678901234567890123456789012345678901234567890
1Bitreich\t\tbitreich.org\t70
1Floodgap\t\tgopher.floodgap.com\t70
1SDF\t\tsdf.org\t70
1Quux\t\tquux.org\t70
`).trim();

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

export function navigatePage(tabId: string, pageId: string, url: string, query?: string) {
  if (url.includes('\t')) {
    [url, query] = url.split('\t');
  }

  // TODO Doesn't belong here
  try {
    new URL(url);
  } catch (err) {
    query = url;
    url = `gopher://gopher.floodgap.com/7/v2/vs`;
  }

  const parsedUrl = Gopher.parseGopherUrl(url);

  update((state) => {
    const tab = state.tabs[tabId];
    const page = tab.history.find(p => p.id === pageId)!;
    page.url = url;
    page.query = query;
    page.type = parsedUrl.type ?? '1';
    page.state = 'loading';
    page.raw = Buffer.from([]);
    page.content = [];
  })

  const request = (
    parsedUrl.hostname === 'start' ? createReadStream(START_PAGE) :
    Gopher.request(url, query)
  );

  request.on('data', (chunk: Buffer) => {
    update((state) => {
      const tab = state.tabs[tabId];
      const page = tab.history.find(p => p.id === pageId)!;
      page.raw = Buffer.concat([page.raw, chunk]);
    });
  }).on('end', () => {
    update((state) => {
      const tab = state.tabs[tabId];
      const page = tab.history.find(p => p.id === pageId)!;
      page.state = 'ready';
      if ('17'.includes(page.type)) {
        page.content = Gopher.parse(page.raw.toString());
      }
    });
  }).on('error', (err: Error) => {
    update((state) => {
      const tab = state.tabs[tabId];
      const page = tab.history.find(p => p.id === pageId)!;
      page.state = 'error';
      page.type = '3';
      page.raw = Buffer.from(err.message);
    });
  });
}
