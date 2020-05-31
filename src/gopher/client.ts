import Net from 'net';
import {parseGopherUrl} from './urls';

export function request(url: string, search?: string) {
  const {hostname, port, path, query=search} = parseGopherUrl(url);
  const client = new Net.Socket();
  const request = `${decodeURI(path)}${query?`\t${decodeURI(query)}`:''}\r\n`;
  client.on('connect', () => client.write(request));
  return client.connect(port, hostname);
}

