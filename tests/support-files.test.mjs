import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => readFile(join(root, path), 'utf8');

test('declares the GitHub Pages custom domain', async () => {
  assert.equal((await read('CNAME')).trim(), 'moderntownhall.com');
});

test('publishes crawler and sitemap endpoints', async () => {
  const robots = await read('robots.txt');
  const sitemap = await read('sitemap.xml');
  assert.match(robots, /User-agent: \*/);
  assert.match(robots, /Allow: \//);
  assert.match(robots, /Sitemap: https:\/\/moderntownhall\.com\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/moderntownhall\.com\/<\/loc>/);
});

test('provides a branded 404 route back home', async () => {
  const html = await read('404.html');
  assert.match(html, /Modern Town Hall/);
  assert.match(html, /Page not found/);
  assert.match(html, /href="\/"/);
  assert.match(html, /href="styles\.css"/);
});
