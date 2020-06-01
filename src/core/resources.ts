import * as Gopher from 'gopher';
import {withState, update} from './state';
// @ts-ignore no definitions
import {createReadStream} from 'streamifier';

export interface Resource {
  url: string,
  data: Buffer,
  state: 'loading' | 'ready' | 'error',
  timestamp: number,
}

export function makeResource(url: string, data?: Buffer): Resource {
  return {
    url,
    state: 'ready',
    data: data ?? Buffer.from([]),
    timestamp: Date.now(),
  };
}

export function getResource(url: string): Resource | undefined {
  return withState((state) => state.resources[url]);
}

export function fetchResource(url: string, fresh = false) {
  if (getResource(url) && !fresh) return;

  update((state) => {
    if (!state.resources[url]) {
      state.resources[url] = makeResource(url);
    }
    const resource = state.resources[url];
    resource.data = Buffer.from([]);
    resource.state = 'loading';
    resource.timestamp = Date.now();
  });

  const parsedUrl = Gopher.parseGopherUrl(url);

  const request = (
    parsedUrl.hostname === 'start' ? requestStartPage() :
    Gopher.request(url)
  );

  request.on('data', (chunk: Buffer) => {
    update((state) => {
      const resource = state.resources[url];
      resource.data = Buffer.concat([resource.data, chunk]);
      resource.timestamp = Date.now();
    });
  });

  request.on('end', () => {
    update((state) => {
      const resource = state.resources[url];
      resource.timestamp = Date.now();
      resource.state = 'ready';
    });
  });

  request.on('error', (err: Error) => {
    update((state) => {
      const resource = state.resources[url];
      resource.data = Buffer.from(err.message);
      resource.state = 'error';
    });
  });
}

export function requestStartPage() {
  const items = withState((state) => {
    return Object.values(state.bookmarks).map((b) => {
      const url = Gopher.parseGopherUrl(b.url);
      return `${b.type}${b.title}\t${url.path}\t${url.hostname}\t${url.port}`;
    });
  });

  const data = [
    `iSearch with your default search engine\t\t\t`,
    `7Search\t/v2/vs\tgopher.floodgap.com\t70`,
    `i\t\t\t`,
    `iYour bookmarks\t\t\t`,
    ...items,
  ].join('\n');

  return createReadStream(data);
}
