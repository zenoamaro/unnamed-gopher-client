import {protocol} from 'electron';
import {gopherProtocolScheme, gopherProtocolHandler} from './gopher';

const protocols = [
  {scheme:gopherProtocolScheme, handler:gopherProtocolHandler},
];

export function registerProtocolSchemes() {
  protocol.registerSchemesAsPrivileged(
    protocols.map(p => p.scheme),
  );
}

export function registerProtocolHandlers() {
  for (let {scheme, handler} of protocols) {
    protocol.registerStreamProtocol(scheme.scheme, handler);
  }
}

export default protocols;
