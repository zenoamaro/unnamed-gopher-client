import Net from 'net';
import URL from 'url';
import transform from 'through2';
import combine from 'multipipe';

export function request(url: string, search?: string) {
  const {hostname, port, path, query=search} = parseGopherUrl(url);
  const client = new Net.Socket();
  const request = `${decodeURI(path)}${query?`\t${decodeURI(query)}`:''}\r\n`;
  client.on('connect', () => client.write(request));
  return client.connect(port, hostname);
}

export interface Item {
  type: string,
  label: string,
  url?: string,
}

export type ItemParser = (
  type: string,
  label: string,
  path: string,
  host: string,
  port: number,
) => Item;

export const itemParsers: {[type: string]: ItemParser} = {
  'default': (type, label, path, host, port) => (
    {type, label, url:makeUrl(host, port, path, type)}
  ),
};

export function parseItem(line: string, parsers=itemParsers): Item {
  const type = line[0];
  let [label, path, host, port] = line.slice(1).split('\t');
  const parser = parsers[type] ?? parsers.default;
  return parser(type, label, path, host, parseInt(port));
}

export function parse(content: string, parsers=itemParsers): Item[] {
  return content.split('\n').map(line => parseItem(line, parsers));
}

export function parser(parsers=itemParsers) {
  return combine(
    scanner(0x0A),
    transform.obj(function (line, enc, done) {
      line = line.toString();
      if (!line.startsWith('.')) this.push(parseItem(line));
      done();
    }),
  );
}

export function parseGopherUrl(url: string) {
  let query;
  [url, query] = url.split('%09');
  if (!url.includes('://')) url = `gopher://${url}`;

  const data = URL.parse(url);
  if (data.protocol !== 'gopher:') throw `Invalid URL: ${url}`;
  if (!data.hostname) throw `Invalid URL: ${url}`;

  return {
    ...data,
    hostname: data.hostname,
    port: parseInt(data.port||'70'),
    // FIXME UGLY
    path: `${cleanPath(data.path)}${data.hash?` ${data.hash}`:''}`,
    pathname: `${cleanPath(data.pathname)}${data.hash?` ${data.hash}`:''}`,
    type: (data.path||'/').match(/^\/(\w)[$\/]/)?.[1],
    query,
  };
}

export function cleanPath(path: string | null) {
  if (!path || path === '/') path = '';
  return (path)
    .replace(/^\/\w[\/$]/, '/')
    .replace(/\/+/g, '/');
}

export function makeUrl(host:string, port:number, path:string='/', type?:string) {
  if (path.match(/^\/?url:/i)) return path.replace(/^\/?url:/i, '');
  // FIXME UGLY HARDCODE
  return `gopher://${host}${port!==70?`:${port}`:''}${(type&&type!=='1')?`/${type}`:''}${path}`;
}

export function scanner(delim: number) {
  let buffer = Buffer.from([]);
  return transform(function (chunk, enc, done) {
    let i;
    buffer = Buffer.concat([buffer, chunk]);
    while ((i = buffer.indexOf(delim)) !== -1) {
      const line = buffer.slice(0, i);
      buffer = buffer.slice(i + 1); // Skip newline
      this.push(line);
    }
    done();
  });
}
