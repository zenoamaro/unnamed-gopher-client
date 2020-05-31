import transform from 'through2';

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
