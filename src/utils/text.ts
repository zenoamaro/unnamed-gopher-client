export function capitalized(str: string) {
  if (!str) return;
  return str[0].toUpperCase() + str.slice(1);
}

export function textMatch(pattern: string, ...fields: (string|undefined)[]) {
  pattern = pattern.toLocaleLowerCase();
  return !pattern || fields.some(s => s?.toLocaleLowerCase().includes(pattern));
}
