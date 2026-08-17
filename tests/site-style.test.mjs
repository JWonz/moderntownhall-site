import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => readFile(join(root, path), 'utf8');

test('defines the approved Civic Ledger palette and layout', async () => {
  const css = await read('styles.css');
  assert.match(css, /--ivory:\s*#f5f1e8/i);
  assert.match(css, /--navy:\s*#102a43/i);
  assert.match(css, /--blue:\s*#075a9c/i);
  assert.match(css, /--green:\s*#24864a/i);
  assert.match(css, /\.hero\s*\{/);
  assert.match(css, /\.trust-strip\s*\{/);
  assert.match(css, /\.privacy-flow\s*\{/);
});

test('supports small screens without a horizontal page scroller', async () => {
  const css = await read('styles.css');
  assert.match(css, /@media\s*\(max-width:\s*760px\)/i);
  assert.match(css, /overflow-x:\s*hidden/i);
  assert.match(css, /grid-template-columns:\s*1fr/i);
});

test('includes keyboard and reduced-motion accessibility states', async () => {
  const css = await read('styles.css');
  const html = await read('index.html');
  assert.match(html, /class="skip-link"/);
  assert.match(html, /id="main-content"/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
});
