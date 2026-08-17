import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => readFile(join(root, path), 'utf8');

function colorToken(css, name) {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'));
  assert.ok(match, `--${name} must define a six-digit hex color`);
  return match[1];
}

function relativeLuminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map((channel) => Number.parseInt(channel, 16) / 255);
  const linear = channels.map((channel) => (
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  ));
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(foreground, background) {
  const [lighter, darker] = [relativeLuminance(foreground), relativeLuminance(background)]
    .sort((left, right) => right - left);
  return (lighter + 0.05) / (darker + 0.05);
}

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

test('uses a passing contrast token for small ivory-background labels', async () => {
  const css = await read('styles.css');
  const ivory = colorToken(css, 'ivory');
  const labelGreen = colorToken(css, 'green-text');
  const labelRule = css.match(/\.eyebrow,\s*\.section-label\s*\{([\s\S]*?)\}/);

  assert.ok(labelRule, 'label selector must remain defined');
  assert.match(labelRule[1], /color:\s*var\(--green-text\)/);
  assert.ok(
    contrastRatio(labelGreen, ivory) >= 4.5,
    `${labelGreen} must provide at least 4.5:1 contrast against ${ivory}`,
  );
});
