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

const START_PAGE = (`
iWelcome to your start page!\t\t\t
i1234567890123456789012345678901234567890123456789012345678901234567890
1Bitreich\t\tbitreich.org\t70
1Floodgap\t\tgopher.floodgap.com\t70
1SDF\t\tsdf.org\t70
1Quux\t\tquux.org\t70
`).trim();

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
    parsedUrl.hostname === 'start' ? createReadStream(START_PAGE) :
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
