import Path from 'path';
import FS from 'fs-extra';
import Crypto from 'crypto';
import {app} from 'electron';
import intoStream from 'into-stream';
import ReadableStreamClone from 'readable-stream-clone'
import * as Gopher from 'gopher';
import {withState} from 'core';


const CACHE_DIR = Path.join(
  app.getPath('cache'),
  'electron-gopher',
);

FS.ensureDir(CACHE_DIR);

export const gopherProtocolScheme = {
  scheme: 'gopher',
  privileges: {
    supportFetchAPI: true,
  },
};

export async function gopherProtocolHandler(
  request: Electron.Request,
  callback: (stream: Electron.StreamProtocolResponse) => void,
) {
  const {url} = request;
  const filename = getFilenameHash(request);
  const maxAge = getMaxCacheAge(request);

  if (url.startsWith('gopher://start')) {
    return callback(streamResponse(requestStartPage()));
  } else if (!await shouldRequestFresh(filename, maxAge)) {
    callback(streamResponse(FS.createReadStream(filename)));
  } else {
    const gopherRequest = Gopher.request(url);
    const cacheOutput = new ReadableStreamClone(gopherRequest);
    const responseOutput = new ReadableStreamClone(gopherRequest);
    const cacheFile = FS.createWriteStream(filename);
    cacheOutput.pipe(cacheFile);
    callback(streamResponse(responseOutput));
  }
}

export function streamResponse(stream: NodeJS.ReadableStream): Electron.StreamProtocolResponse {
  return {
    statusCode: 200,
    headers: {'Cache-Control':'no-store'},
    data: stream,
  };
}

export function getFilenameHash(request: Electron.Request) {
  const {url} = request;
  const parsedUrl = Gopher.parseGopherUrl(url);
  const extname = Path.extname(parsedUrl.pathname) || '.gopher';
  const fileId = Crypto.createHash('sha256').update(url).digest('hex');
  return Path.join(CACHE_DIR, `${fileId}${extname}`);
}

export function getMaxCacheAge(request: Electron.Request) {
  const cache = request.headers['Cache-Control'];

  if (!cache) {
    return Infinity;
  } else if (cache.includes('no-cache')) {
    return 0;
  } else if (cache.includes('max-age')) {
    const match = cache.match(/max-age=(\d+)/);
    return parseInt(match?.[1] ?? '0');
  } else {
    return Infinity;
  }
}

export async function shouldRequestFresh(filename: string, maxAge: number) {
  if (maxAge === 0) return true;

  try {
    const stat = await FS.stat(filename);
    return (Date.now() - stat.mtimeMs) > (maxAge * 1000);
  } catch (err) {
    if (err.code == 'ENOENT') return true;
    else throw err;
  }
}

export function requestStartPage() {
  const bookmarks = withState((state) => {
    return Object.values(state.bookmarks).map((b) => {
      const url = Gopher.parseGopherUrl(b.url);
      return `${b.type}${b.title}\t${url.path}\t${url.hostname}\t${url.port}`;
    });
  });

  const recents = withState((state) => {
    return Object.values(state.recents)
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((b) => {
        const url = Gopher.parseGopherUrl(b.url);
        return `${b.type}${b.title}\t${url.path}\t${url.hostname}\t${url.port}`;
      });
  });

  const data = [
    `iSearch with your default search engine\t\t\t`,
    `7Search\t/v2/vs\tgopher.floodgap.com\t70`,
    `i\t\t\t`,
    `iYour bookmarks\t\t\t`,
    ...bookmarks,
    `iRecently visited\t\t\t`,
    ...recents,
  ].join('\n');

  return intoStream(data);
}
