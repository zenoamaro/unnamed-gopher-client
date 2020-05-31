import URL from 'url';

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

