import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => readFile(join(root, path), 'utf8');

function extractOrganization(html) {
  const match = html.match(
    /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i,
  );
  assert.ok(match, 'Organization JSON-LD must exist');
  return JSON.parse(match[1]);
}

function extractMeta(html, attribute) {
  return Object.fromEntries(
    [...html.matchAll(new RegExp(
      `<meta\\s+${attribute}="([^"]+)"\\s+content="([^"]*)"\\s*>`,
      'gi',
    ))].map((match) => [match[1], match[2]]),
  );
}

function extractParagraphs(html, className) {
  const blocks = [...html.matchAll(new RegExp(
    `<(?:article|section)[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>([\\s\\S]*?)<\\/(?:article|section)>`,
    'gi',
  ))];
  return blocks.flatMap((block) => (
    [...block[1].matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)]
      .map((match) => match[1].replace(/<[^>]+>/g, '').trim())
  ));
}

test('publishes the approved business identity', async () => {
  const html = await read('index.html');
  assert.match(html, /Modern Town Hall/);
  assert.match(html, /ModernTownhall LLC/);
  assert.match(html, /Hilliard, Ohio/);
  assert.match(html, /Serving the Greater Columbus area/);
  assert.doesNotMatch(html, /(?:in|based in|Built in) Columbus,? Ohio?/i);
  assert.match(html, /contact@moderntownhall\.com/);
  assert.match(html, /A stronger voice in the policies that shape your life\./);
  assert.match(html, /pre-launch/i);
  assert.match(html, /Product access and account registration are not yet available\./);
});

test('describes address deletion and anonymity as future design intent', async () => {
  const html = await read('index.html');
  assert.match(html, /will be used[^.]*jurisdiction[^.]*then deleted after verification/i);
  assert.match(html, /future platform is designed/i);
  assert.match(html, /not connected to a retained street address/i);
  assert.doesNotMatch(html, /sign up now|create an account|join now/i);
});

test('frames every localized product capability as future design intent', async () => {
  const html = await read('index.html');
  const capabilityParagraphs = [
    ...extractParagraphs(html, 'trust-item'),
    ...extractParagraphs(html, 'feature'),
    ...extractParagraphs(html, 'privacy-step'),
  ];

  assert.equal(capabilityParagraphs.length, 9, 'all nine product capability statements must be checked');
  for (const paragraph of capabilityParagraphs) {
    assert.match(
      paragraph,
      /\b(?:will|future|designed|intended|planned)\b/i,
      `capability statement must communicate future or design intent: ${paragraph}`,
    );
  }
  assert.match(html, /laws[^.]*public datasets[^.]*will be organized[^.]*verified jurisdiction/i);
  assert.match(html, /future platform[^.]*designed[^.]*participat/i);
});

test('publishes canonical, sharing, and Organization metadata', async () => {
  const html = await read('index.html');
  assert.match(html, /<link rel="canonical" href="https:\/\/moderntownhall\.com\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/moderntownhall\.com\/">/);
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/moderntownhall\.com\/assets\/moderntownhall-logo\.png">/,
  );

  const openGraph = extractMeta(html, 'property');
  const twitter = extractMeta(html, 'name');
  assert.equal(twitter['twitter:card'], 'summary_large_image');
  assert.equal(twitter['twitter:title'], openGraph['og:title']);
  assert.equal(twitter['twitter:description'], openGraph['og:description']);
  assert.equal(twitter['twitter:image'], openGraph['og:image']);
  assert.equal(twitter['twitter:image:alt'], openGraph['og:image:alt']);
  assert.match(twitter['twitter:description'], /pre-launch/i);
  assert.match(twitter['twitter:image'], /^https:\/\/moderntownhall\.com\//);

  const organization = extractOrganization(html);
  assert.equal(organization['@type'], 'Organization');
  assert.equal(organization.name, 'Modern Town Hall');
  assert.equal(organization.legalName, 'ModernTownhall LLC');
  assert.equal(organization.url, 'https://moderntownhall.com/');
  assert.equal(organization.email, 'mailto:contact@moderntownhall.com');
  assert.equal(organization.address.addressLocality, 'Hilliard');
  assert.equal(organization.address.addressRegion, 'OH');
  assert.equal(organization.address.addressCountry, 'US');
  assert.equal('streetAddress' in organization.address, false);
});

test('contains no active visitor-data collection', async () => {
  const html = await read('index.html');
  assert.doesNotMatch(html, /<form\b/i);
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /google-analytics|googletagmanager|segment\.com|plausible\.io/i);
  assert.doesNotMatch(html, /document\.cookie|localStorage|sessionStorage/);
  assert.match(html, /href="mailto:contact@moderntownhall\.com"/);
});

test('references supplied local brand assets', async () => {
  const html = await read('index.html');
  assert.match(html, /src="assets\/moderntownhall-logo\.png"/);
  assert.match(html, /href="assets\/highcontrast-logo\.png"/);
  await access(join(root, 'assets/moderntownhall-logo.png'));
  await access(join(root, 'assets/highcontrast-logo.png'));
});
