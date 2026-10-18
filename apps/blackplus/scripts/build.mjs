import { cp } from 'node:fs/promises';

await cp(
  new URL('../targets/blackplus/clone/', import.meta.url),
  new URL('../dist/', import.meta.url),
  { recursive: true },
);
console.log('Static site built in dist/');
