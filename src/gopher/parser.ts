import transform from 'through2';
import combine from 'multipipe';
import {scanner} from 'utils/streams';
import {makeUrl} from './urls';

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

