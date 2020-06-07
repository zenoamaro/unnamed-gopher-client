import Path from 'path';
import FS from 'fs-extra';
import Crypto from 'crypto';
import {app} from 'electron';
import intoStream from 'into-stream';
import ReadableStreamClone from 'readable-stream-clone'
import * as Gopher from 'gopher';
import {withState, isSearchUrl} from 'core';
import {Bookmark} from 'core/bookmarks';
import {Recent} from 'core/recents';


const CACHE_DIR = Path.join(
  app.getPath('cache'),
  'electron-gopher',
);

FS.ensureDir(CACHE_DIR);

export const gopherProtocolScheme = {
  scheme: 'gopher',
  privileges: {
    standard: true,
    supportFetchAPI: true,
  },
};

export async function gopherProtocolHandler(
  request: Electron.Request,
  callback: (stream: Electron.StreamProtocolResponse) => void,
) {
  const {url} = request;
  const maxAge = getRequestMaxCacheAge(request);

  if (url.startsWith('gopher://start')) {
    return callback(streamResponse(requestStartPage()));
  } else if (url.startsWith('gopher://test')) {
    return callback(streamResponse(requestTestPage(url)));
  } else if (!await shouldRequestFresh(url, maxAge)) {
    const filename = getFilenameHash(url);
    callback(streamResponse(FS.createReadStream(filename)));
  } else {
    const filename = getFilenameHash(url);
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

export function clearCachedURL(url: string) {
  // Sync to be atomic. Hopefully not expensive
  const filename = getFilenameHash(url);
  try {FS.removeSync(filename)} finally {};
}

export async function clearCache() {
  // Sync to be atomic. Hopefully not expensive
  try {FS.removeSync(CACHE_DIR)} finally {};
  FS.ensureDirSync(CACHE_DIR);
}

export function getFilenameHash(url: string) {
  const parsedUrl = Gopher.parseGopherUrl(url);
  const extname = Path.extname(parsedUrl.pathname) || '.gopher';
  const fileId = Crypto.createHash('sha256').update(url).digest('hex');
  return Path.join(CACHE_DIR, `${fileId}${extname}`);
}

export function getRequestMaxCacheAge(request: Electron.Request) {
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

export async function shouldRequestFresh(url: string, maxAge: number) {
  if (maxAge === 0) return true;

  // FIXME feels wrong to do this here
  if (isSearchUrl(url)) return true; // Search URL

  try {
    const filename = getFilenameHash(url);
    const stat = await FS.stat(filename);
    return (Date.now() - stat.mtimeMs) > (maxAge * 1000);
  } catch (err) {
    if (err.code == 'ENOENT') return true;
    else throw err;
  }
}

export function requestTestPage(url: string) {
  return intoStream([
    `[Link](gopher://bitreich.org)`,
  ].join('\n'));
}

export function requestStartPage() {
  function renderItem(item: Bookmark | Recent) {
    const {type, title, url} = item;
    const {hostname, port, path, query} = Gopher.parseGopherUrl(url);
    return `${type}${title}\t${path}${query?`%09${query}`:''}\t${hostname}\t${port}`;
  }

  const bookmarks = withState((state) => {
    return Object.values(state.bookmarks).map(renderItem);
  });

  const recents = withState((state) => {
    return Object.values(state.recents)
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(renderItem);
  });

  const data = [
    `iSearch with your default search engine\t\t\t`,
    `7Search\t/v2/vs\tgopher.floodgap.com\t70`,
    `i\t\t\t`,
    `iYour bookmarks\t\t\t`,
    ...bookmarks,
    `i\t\t\t`,
    `iRecently visited\t\t\t`,
    ...recents,
  ].join('\n');

  return intoStream(data);
}
