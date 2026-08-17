# Modern Town Hall Public Presence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, verify, and publish a secure one-page public presence for ModernTownhall LLC at `https://moderntownhall.com` that accurately presents the pre-launch company and supports Apple Business verification.

**Architecture:** A dependency-free semantic HTML page and focused CSS file are published from the root of the public `JWonz/moderntownhall` repository through GitHub Pages. Namecheap remains authoritative for DNS and email; only the web records change, while the existing email-forwarding MX/TXT records remain intact.

**Tech Stack:** HTML5, CSS3, Node.js built-in test runner, GitHub Pages, Namecheap DNS

**Spec:** `docs/superpowers/specs/2026-08-17-apple-business-public-presence-design.md`

## Global Constraints

- Use **Modern Town Hall** as the public brand and **ModernTownhall LLC** as the exact legal name.
- Public business details are Columbus, Ohio, United States and `contact@moderntownhall.com`.
- The company and product are pre-launch; product capabilities must use future-tense or design-intent language.
- The approved hero headline is: **A stronger voice in the policies that shape your life.**
- State that a submitted residential address establishes jurisdiction eligibility and is deleted after verification.
- State that future public participation is not connected to a retained street address or required public real-name identity.
- Use the approved **Civic Ledger** visual direction: warm ivory, deep navy, and blue/green logo-derived accents.
- Use `moderntownhall_logo.png` as the hero artwork and retain the circular **MT** header monogram.
- Use no remote fonts, external scripts, analytics, cookies, forms, database, framework, or build dependency.
- Support viewport widths from 320 pixels through large desktops without horizontal scrolling.
- Preserve Namecheap email-forwarding MX and email-related TXT records during DNS changes.
- Publish from the root of the `main` branch in the public `JWonz/moderntownhall` repository.

## File Structure

- `index.html` — semantic homepage content, business metadata, structured data, and contact link.
- `styles.css` — complete Civic Ledger presentation, responsive behavior, accessibility states, and 404 layout.
- `assets/moderntownhall-logo.png` — approved full-color hero logo copied from the supplied brand directory.
- `assets/highcontrast-logo.png` — supplied high-contrast icon used as the browser icon.
- `404.html` — branded route-not-found page with a home link.
- `CNAME` — GitHub Pages custom-domain declaration.
- `robots.txt` — crawler policy and sitemap location.
- `sitemap.xml` — canonical home-page sitemap entry.
- `package.json` — dependency-free local test and preview commands.
- `tests/site-content.test.mjs` — business identity, copy, metadata, privacy, and no-collection contract.
- `tests/site-style.test.mjs` — responsive and accessibility presentation contract.
- `tests/support-files.test.mjs` — custom-domain, crawler, sitemap, 404, and deployment-guide contract.
- `docs/deployment.md` — exact GitHub Pages, Namecheap DNS, HTTPS, email-preservation, and Apple verification steps.
- `README.md` — concise repository purpose and local verification commands.

---

### Task 1: Business Identity, Content, and Metadata

**Files:**
- Create: `package.json`
- Create: `tests/site-content.test.mjs`
- Create: `index.html`
- Create: `assets/moderntownhall-logo.png`
- Create: `assets/highcontrast-logo.png`

**Interfaces:**
- Consumes: Approved copy and public identity from the design specification.
- Produces: Stable homepage landmarks with IDs `main-content`, `purpose`, `privacy`, `about`, and `contact`; local logo paths under `assets/`; Organization JSON-LD for later deployment checks.

- [ ] **Step 1: Write the failing site-content contract**

Create `tests/site-content.test.mjs`:

```js
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

test('publishes the approved business identity', async () => {
  const html = await read('index.html');
  assert.match(html, /Modern Town Hall/);
  assert.match(html, /ModernTownhall LLC/);
  assert.match(html, /Columbus, Ohio/);
  assert.match(html, /contact@moderntownhall\.com/);
  assert.match(html, /A stronger voice in the policies that shape your life\./);
  assert.match(html, /pre-launch/i);
  assert.match(html, /Product access and account registration are not yet available\./);
});

test('describes address deletion and anonymity as future design intent', async () => {
  const html = await read('index.html');
  assert.match(html, /deleted after verification/i);
  assert.match(html, /future platform is designed/i);
  assert.match(html, /not connected to a retained street address/i);
  assert.doesNotMatch(html, /sign up now|create an account|join now/i);
});

test('publishes canonical, sharing, and Organization metadata', async () => {
  const html = await read('index.html');
  assert.match(html, /<link rel="canonical" href="https:\/\/moderntownhall\.com\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/moderntownhall\.com\/">/);
  assert.match(
    html,
    /<meta property="og:image" content="https:\/\/moderntownhall\.com\/assets\/moderntownhall-logo\.png">/,
  );

  const organization = extractOrganization(html);
  assert.equal(organization['@type'], 'Organization');
  assert.equal(organization.name, 'Modern Town Hall');
  assert.equal(organization.legalName, 'ModernTownhall LLC');
  assert.equal(organization.url, 'https://moderntownhall.com/');
  assert.equal(organization.email, 'mailto:contact@moderntownhall.com');
  assert.equal(organization.address.addressLocality, 'Columbus');
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
```

- [ ] **Step 2: Run the contract to verify it fails**

Run:

```bash
node --test tests/site-content.test.mjs
```

Expected: FAIL with `ENOENT` for `index.html`.

- [ ] **Step 3: Copy the approved brand assets**

Run:

```bash
mkdir -p assets
cp /Users/jwonz/Desktop/projects/moderntownhall/branding/moderntownhall_logo.png assets/moderntownhall-logo.png
cp /Users/jwonz/Desktop/projects/moderntownhall/branding/highcontrast_logo.png assets/highcontrast-logo.png
```

- [ ] **Step 4: Add dependency-free project commands**

Create `package.json`:

```json
{
  "name": "modern-town-hall-public-presence",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "serve": "python3 -m http.server 4173"
  }
}
```

- [ ] **Step 5: Implement the semantic homepage and metadata**

Create `index.html`:

```html
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Modern Town Hall | A stronger voice in public policy</title>
    <meta name="description" content="Modern Town Hall is a pre-launch civic technology company in Columbus, Ohio, building a privacy-minded platform that connects Americans to relevant policies, representatives, public data, and local forums.">
    <meta name="theme-color" content="#102a43">
    <link rel="canonical" href="https://moderntownhall.com/">
    <link rel="icon" type="image/png" href="assets/highcontrast-logo.png">
    <link rel="stylesheet" href="styles.css">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Modern Town Hall">
    <meta property="og:title" content="A stronger voice in the policies that shape your life.">
    <meta property="og:description" content="A pre-launch civic technology company connecting Americans to relevant policy, representatives, public data, and local forums.">
    <meta property="og:url" content="https://moderntownhall.com/">
    <meta property="og:image" content="https://moderntownhall.com/assets/moderntownhall-logo.png">
    <meta property="og:image:alt" content="Modern Town Hall logo">
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Modern Town Hall",
        "legalName": "ModernTownhall LLC",
        "url": "https://moderntownhall.com/",
        "logo": "https://moderntownhall.com/assets/moderntownhall-logo.png",
        "email": "mailto:contact@moderntownhall.com",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Columbus",
          "addressRegion": "OH",
          "addressCountry": "US"
        }
      }
    </script>
  </head>
  <body>
    <a class="skip-link" href="#main-content">Skip to main content</a>

    <header class="site-header" aria-label="Company header">
      <a class="brand" href="/" aria-label="Modern Town Hall home">
        <span class="brand-mark" aria-hidden="true">MT</span>
        <span>Modern Town Hall</span>
      </a>
      <p class="company-status"><strong>Pre-launch</strong><span aria-hidden="true"> · </span>Columbus, Ohio</p>
    </header>

    <main id="main-content">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-rings" aria-hidden="true"></div>
        <div class="hero-copy">
          <p class="eyebrow">A civic technology company <span aria-hidden="true">·</span> Launching soon</p>
          <h1 id="hero-title">A stronger voice in the policies that shape your life.</h1>
          <p class="hero-lead">Modern Town Hall is building a platform that connects Americans with the policies, representatives, and public discussions that affect where they live.</p>
          <a class="button" href="mailto:contact@moderntownhall.com">Contact the company <span aria-hidden="true">→</span></a>
        </div>
        <div class="hero-art">
          <img src="assets/moderntownhall-logo.png" alt="Modern Town Hall logo showing a town hall surrounded by a conversation ring">
        </div>
      </section>

      <section class="trust-strip" aria-label="Privacy and relevance principles">
        <article class="trust-item">
          <span class="item-number" aria-hidden="true">01</span>
          <h2>Verify once, then delete</h2>
          <p>A submitted street address establishes local eligibility and is deleted after verification.</p>
        </article>
        <article class="trust-item">
          <span class="item-number" aria-hidden="true">02</span>
          <h2>Anonymous to the platform</h2>
          <p>The future platform is designed so public participation is not connected to a retained street address or required public real-name identity.</p>
        </article>
        <article class="trust-item">
          <span class="item-number" aria-hidden="true">03</span>
          <h2>Locally relevant</h2>
          <p>Districts, laws, data, and discussions are organized around verified jurisdiction access.</p>
        </article>
      </section>

      <section class="section purpose" id="purpose" aria-labelledby="purpose-title">
        <p class="section-label">Make civic speech more useful</p>
        <h2 class="section-title" id="purpose-title">Connect your voice to the public decisions happening around you.</h2>
        <div class="feature-grid">
          <article class="feature">
            <h3>Your jurisdictions</h3>
            <p>Find the representative districts and public institutions connected to a verified location.</p>
          </article>
          <article class="feature">
            <h3>Shared public knowledge</h3>
            <p>Explore relevant laws and public datasets in one place, organized for practical civic understanding.</p>
          </article>
          <article class="feature">
            <h3>A local public forum</h3>
            <p>Participate with other verified constituents while remaining anonymous to both the public and the platform.</p>
          </article>
        </div>
      </section>

      <section class="section privacy" id="privacy" aria-labelledby="privacy-title">
        <p class="section-label">Privacy by design</p>
        <h2 class="section-title" id="privacy-title">Confirm where you belong without storing where you live.</h2>
        <div class="privacy-flow">
          <article class="privacy-step">
            <span class="roman" aria-hidden="true">I</span>
            <h3>Verify an address privately</h3>
            <p>Use a residential address only to determine representative districts and jurisdiction eligibility.</p>
          </article>
          <article class="privacy-step">
            <span class="roman" aria-hidden="true">II</span>
            <h3>Delete the address</h3>
            <p>Remove the submitted street address after verification rather than retaining it with the account.</p>
          </article>
          <article class="privacy-step">
            <span class="roman" aria-hidden="true">III</span>
            <h3>Participate anonymously</h3>
            <p>Keep only the access needed for relevant civic spaces—not a public or stored residential identity.</p>
          </article>
        </div>
        <p class="privacy-principle"><strong>Design principle:</strong> Eligibility should be verifiable without turning personal identity or a home address into the price of civic participation.</p>
      </section>

      <section class="section about" id="about" aria-labelledby="about-title">
        <div>
          <p class="section-label">About the company</p>
          <h2 class="section-title" id="about-title">Built in Columbus for American civic life.</h2>
        </div>
        <div class="about-copy">
          <p><strong>Modern Town Hall is a pre-launch civic technology company based in Columbus, Ohio.</strong></p>
          <p>We believe online speech becomes more effective when people can understand the public institutions around them, speak with relevant communities, and protect their personal identity at the same time.</p>
          <p>Product access and account registration are not yet available.</p>
        </div>
      </section>

      <section class="contact" id="contact" aria-labelledby="contact-title">
        <div>
          <h2 id="contact-title">Get in touch.</h2>
          <p>Company, partnership, and verification inquiries are welcome.</p>
        </div>
        <a class="contact-address" href="mailto:contact@moderntownhall.com">contact@moderntownhall.com</a>
      </section>
    </main>

    <footer class="site-footer">
      <p><strong>ModernTownhall LLC</strong> <span aria-hidden="true">·</span> Columbus, Ohio</p>
      <p>© 2026 ModernTownhall LLC <span aria-hidden="true">·</span> All rights reserved.</p>
    </footer>
  </body>
</html>
```

- [ ] **Step 6: Run the site-content contract**

Run:

```bash
node --test tests/site-content.test.mjs
```

Expected: 5 tests PASS.

- [ ] **Step 7: Commit the business-presence foundation**

Run:

```bash
git add package.json tests/site-content.test.mjs index.html assets/moderntownhall-logo.png assets/highcontrast-logo.png
git commit -m "feat: add verified company presence content"
```

---

### Task 2: Civic Ledger Presentation and Accessibility

**Files:**
- Create: `tests/site-style.test.mjs`
- Create: `styles.css`
- Modify: `index.html`

**Interfaces:**
- Consumes: Homepage classes and section IDs from Task 1.
- Produces: CSS custom properties `--ivory`, `--navy`, `--blue`, and `--green`; responsive breakpoint at 760 pixels; accessible focus, skip-link, and reduced-motion behavior used by the homepage and 404 page.

- [ ] **Step 1: Write the failing presentation contract**

Create `tests/site-style.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the contract to verify it fails**

Run:

```bash
node --test tests/site-style.test.mjs
```

Expected: FAIL with `ENOENT` for `styles.css`.

- [ ] **Step 3: Implement the complete Civic Ledger stylesheet**

Create `styles.css`:

```css
:root {
  --ivory: #f5f1e8;
  --ivory-deep: #e5eadf;
  --navy: #102a43;
  --navy-dark: #0b2033;
  --blue: #075a9c;
  --green: #24864a;
  --green-light: #68c878;
  --text: #102a43;
  --text-muted: #405c70;
  --rule: rgb(16 42 67 / 16%);
  --white: #ffffff;
  color-scheme: light;
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  min-width: 320px;
  margin: 0;
  overflow-x: hidden;
  background: var(--ivory);
  color: var(--text);
  font-size: 16px;
  line-height: 1.5;
}

img {
  display: block;
  max-width: 100%;
}

a {
  color: inherit;
}

a:focus-visible {
  outline: 3px solid var(--green-light);
  outline-offset: 4px;
}

.skip-link {
  position: absolute;
  z-index: 100;
  top: 12px;
  left: 12px;
  padding: 10px 14px;
  transform: translateY(-160%);
  border-radius: 4px;
  background: var(--white);
  color: var(--navy);
  font-weight: 700;
}

.skip-link:focus {
  transform: translateY(0);
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 72px;
  padding: 16px clamp(24px, 5vw, 68px);
  border-bottom: 1px solid var(--rule);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--navy);
  font-weight: 750;
  letter-spacing: -0.025em;
  text-decoration: none;
}

.brand-mark {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  flex: 0 0 34px;
  border-radius: 50%;
  background: var(--navy);
  color: var(--ivory);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 0.7rem;
  letter-spacing: 0;
}

.company-status {
  margin: 0;
  color: #536b7d;
  font-size: 0.8rem;
}

.company-status strong {
  color: var(--navy);
}

.hero {
  position: relative;
  display: grid;
  min-height: 470px;
  grid-template-columns: minmax(0, 1.35fr) minmax(240px, 0.65fr);
  gap: clamp(32px, 5vw, 76px);
  align-items: center;
  overflow: hidden;
  padding: clamp(64px, 8vw, 104px) clamp(24px, 8vw, 120px);
  border-bottom: 1px solid var(--rule);
}

.hero-copy,
.hero-art {
  position: relative;
  z-index: 1;
}

.eyebrow,
.section-label {
  margin: 0 0 16px;
  color: var(--green);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

h1,
.section-title,
.contact h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 500;
  letter-spacing: -0.04em;
}

h1 {
  max-width: 740px;
  margin: 0 0 24px;
  font-size: clamp(2.65rem, 6vw, 5rem);
  line-height: 0.99;
}

.hero-lead {
  max-width: 650px;
  margin: 0 0 30px;
  color: var(--text-muted);
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  line-height: 1.65;
}

.button {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 13px 18px;
  border-radius: 4px;
  background: var(--blue);
  color: var(--white);
  font-size: 0.84rem;
  font-weight: 800;
  text-decoration: none;
}

.button:hover {
  background: var(--navy);
}

.hero-art {
  display: grid;
  place-items: center;
}

.hero-art img {
  width: min(100%, 340px);
  filter: drop-shadow(0 18px 30px rgb(16 42 67 / 18%));
}

.hero-rings {
  position: absolute;
  right: -115px;
  bottom: -135px;
  width: 370px;
  height: 370px;
  border: 1px solid rgb(7 90 156 / 18%);
  border-radius: 50%;
  box-shadow:
    0 0 0 44px rgb(36 134 74 / 5%),
    0 0 0 88px rgb(7 90 156 / 3.5%),
    0 0 0 132px rgb(36 134 74 / 2%);
}

.trust-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding-inline: clamp(24px, 6vw, 92px);
  background: var(--navy);
  color: var(--ivory);
}

.trust-item {
  padding: 28px clamp(18px, 3vw, 40px);
  border-right: 1px solid rgb(245 241 232 / 16%);
}

.trust-item:last-child {
  border-right: 0;
}

.item-number,
.roman {
  display: block;
  margin-bottom: 7px;
  color: var(--green-light);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.1rem;
}

.trust-item h2,
.feature h3,
.privacy-step h3 {
  margin: 0 0 7px;
  font-size: 0.86rem;
}

.trust-item p {
  margin: 0;
  color: #c7d3dc;
  font-size: 0.72rem;
  line-height: 1.55;
}

.section {
  padding: clamp(58px, 8vw, 96px) clamp(24px, 8vw, 120px);
  border-bottom: 1px solid var(--rule);
}

.section-title {
  max-width: 760px;
  margin: 0 0 44px;
  font-size: clamp(2rem, 4vw, 3.15rem);
  line-height: 1.12;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(24px, 4vw, 52px);
}

.feature {
  padding-top: 20px;
  border-top: 2px solid var(--green);
}

.feature h3 {
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.2rem;
}

.feature p,
.privacy-step p,
.about-copy {
  color: #536b7d;
  font-size: 0.88rem;
  line-height: 1.7;
}

.feature p,
.privacy-step p,
.about-copy p {
  margin: 0;
}

.privacy {
  background: var(--ivory-deep);
}

.privacy-flow {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgb(16 42 67 / 14%);
}

.privacy-step {
  position: relative;
  padding: 28px;
  background: #f1f2e9;
}

.privacy-step:not(:last-child)::after {
  position: absolute;
  z-index: 2;
  top: 28px;
  right: -9px;
  display: grid;
  width: 18px;
  height: 18px;
  place-items: center;
  border-radius: 50%;
  background: var(--green);
  color: var(--white);
  content: "→";
  font-size: 0.65rem;
}

.roman {
  margin-bottom: 30px;
  color: var(--blue);
  font-size: 1.5rem;
}

.privacy-principle {
  max-width: 900px;
  margin: 22px 0 0;
  padding: 16px 18px;
  border-left: 3px solid var(--green);
  color: #294b60;
  font-size: 0.88rem;
  line-height: 1.65;
}

.about {
  display: grid;
  grid-template-columns: minmax(250px, 0.8fr) minmax(300px, 1.2fr);
  gap: clamp(36px, 7vw, 100px);
}

.about .section-title {
  margin-bottom: 0;
}

.about-copy {
  font-size: 1rem;
}

.about-copy p + p {
  margin-top: 18px;
}

.about-copy strong {
  color: var(--navy);
}

.contact {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 34px;
  padding: clamp(44px, 6vw, 72px) clamp(24px, 8vw, 120px);
  background: var(--blue);
  color: var(--white);
}

.contact h2 {
  margin: 0 0 8px;
  font-size: clamp(2rem, 4vw, 3rem);
}

.contact p {
  margin: 0;
  color: #dbeaf6;
}

.contact-address {
  flex: 0 0 auto;
  padding: 12px 16px;
  border: 1px solid rgb(255 255 255 / 58%);
  border-radius: 4px;
  font-size: 0.86rem;
  font-weight: 800;
  text-decoration: none;
}

.contact-address:hover {
  background: var(--white);
  color: var(--blue);
}

.site-footer {
  display: flex;
  justify-content: space-between;
  gap: 22px;
  padding: 24px clamp(24px, 8vw, 120px);
  background: var(--navy-dark);
  color: #aebdca;
  font-size: 0.75rem;
}

.site-footer p {
  margin: 0;
}

.site-footer strong {
  color: var(--ivory);
}

.not-found {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 32px;
  text-align: center;
}

.not-found__content {
  max-width: 620px;
}

.not-found h1 {
  margin-inline: auto;
}

@media (max-width: 760px) {
  .site-header {
    min-height: 64px;
    padding: 14px 20px;
  }

  .company-status {
    display: none;
  }

  .hero {
    grid-template-columns: 1fr;
    gap: 26px;
    padding: 48px 24px 52px;
  }

  .hero-art {
    order: -1;
    justify-items: start;
  }

  .hero-art img {
    width: 170px;
  }

  .trust-strip,
  .feature-grid,
  .privacy-flow,
  .about {
    grid-template-columns: 1fr;
  }

  .trust-item {
    border-right: 0;
    border-bottom: 1px solid rgb(245 241 232 / 16%);
  }

  .trust-item:last-child {
    border-bottom: 0;
  }

  .section {
    padding: 52px 24px;
  }

  .privacy-step:not(:last-child)::after {
    top: auto;
    right: auto;
    bottom: -9px;
    left: 28px;
    content: "↓";
  }

  .about {
    gap: 22px;
  }

  .contact {
    align-items: flex-start;
    flex-direction: column;
    padding: 44px 24px;
  }

  .contact-address {
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .site-footer {
    flex-direction: column;
    padding: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition: none !important;
  }
}
```

- [ ] **Step 4: Run all tests**

Run:

```bash
npm test
```

Expected: 8 tests PASS.

- [ ] **Step 5: Preview the page at desktop and mobile widths**

Run the server:

```bash
npm run serve
```

Open `http://localhost:4173/` and inspect at 1280×900 and 390×844. Confirm that the hero art does not obscure text, all multi-column sections stack at 390 pixels, the email remains readable, the skip link appears on keyboard focus, and there is no horizontal scrollbar.

- [ ] **Step 6: Commit the approved presentation**

Run:

```bash
git add tests/site-style.test.mjs styles.css index.html
git commit -m "feat: apply Civic Ledger presentation"
```

---

### Task 3: Domain Support Files and Deployment Guide

**Files:**
- Create: `tests/support-files.test.mjs`
- Create: `CNAME`
- Create: `robots.txt`
- Create: `sitemap.xml`
- Create: `404.html`
- Create: `docs/deployment.md`
- Create: `README.md`

**Interfaces:**
- Consumes: Canonical domain, homepage stylesheet, and legal identity from Tasks 1–2.
- Produces: GitHub Pages custom-domain configuration, crawler endpoints, a branded fallback route, and the exact deployment procedure used in Task 5.

- [ ] **Step 1: Write the failing support-files contract**

Create `tests/support-files.test.mjs`:

```js
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

test('documents exact DNS records without removing email records', async () => {
  const guide = await read('docs/deployment.md');
  for (const address of [
    '185.199.108.153',
    '185.199.109.153',
    '185.199.110.153',
    '185.199.111.153',
  ]) {
    assert.match(guide, new RegExp(address.replaceAll('.', '\\.')));
  }
  assert.match(guide, /www.*jwonz\.github\.io/is);
  assert.match(guide, /Do not delete or replace the existing MX records/i);
  assert.match(guide, /apple-domain-verification=/i);
  assert.match(guide, /two verification methods/i);
});
```

- [ ] **Step 2: Run the contract to verify it fails**

Run:

```bash
node --test tests/support-files.test.mjs
```

Expected: FAIL with `ENOENT` for `CNAME`.

- [ ] **Step 3: Add the GitHub Pages and crawler files**

Create `CNAME`:

```text
moderntownhall.com
```

Create `robots.txt`:

```text
User-agent: *
Allow: /

Sitemap: https://moderntownhall.com/sitemap.xml
```

Create `sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://moderntownhall.com/</loc>
    <lastmod>2026-08-17</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 4: Add the branded 404 page**

Create `404.html`:

```html
<!doctype html>
<html lang="en-US">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <meta name="theme-color" content="#102a43">
    <title>Page not found | Modern Town Hall</title>
    <link rel="icon" type="image/png" href="assets/highcontrast-logo.png">
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <main class="not-found">
      <div class="not-found__content">
        <p class="eyebrow">Modern Town Hall</p>
        <h1>Page not found.</h1>
        <p class="hero-lead">The address you followed does not point to a page on this pre-launch company site.</p>
        <a class="button" href="/">Return to the homepage <span aria-hidden="true">→</span></a>
      </div>
    </main>
  </body>
</html>
```

- [ ] **Step 5: Write the exact deployment guide**

Create `docs/deployment.md`:

```markdown
# Deployment and Apple Verification Guide

## GitHub repository and Pages

1. Publish this repository as the public repository `JWonz/moderntownhall`.
2. In repository settings, configure GitHub Pages to deploy from the `main` branch and the `/` folder.
3. Set the custom domain to `moderntownhall.com` before changing Namecheap web records.
4. Verify the custom domain in the JWonz GitHub account by adding the exact TXT record generated by GitHub, then select Verify in GitHub.

## Namecheap DNS

The Namecheap nameservers remain in place. Do not delete or replace the existing MX records or email-related TXT records; they provide the working `contact@moderntownhall.com` forwarding service.

In Namecheap Advanced DNS, remove only conflicting parked-page, URL-redirect, apex A/AAAA, and `www` records. Add these web records:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | @ | 185.199.108.153 | Automatic |
| A | @ | 185.199.109.153 | Automatic |
| A | @ | 185.199.110.153 | Automatic |
| A | @ | 185.199.111.153 | Automatic |
| CNAME | www | jwonz.github.io | Automatic |

Do not add a wildcard DNS record.

## HTTPS and public checks

After DNS resolves to GitHub Pages, enable Enforce HTTPS in the repository's Pages settings. Confirm that:

- `https://moderntownhall.com/` loads without authentication.
- `http://moderntownhall.com/` redirects to HTTPS.
- `https://www.moderntownhall.com/` redirects to the canonical root domain.
- The certificate is valid for the custom domain.
- `contact@moderntownhall.com` still receives a message sent from an unrelated email account.

## Apple Business verification

Apple currently requires two verification methods. Use domain validation as one method and an EIN, D-U-N-S Number, supported official document, or another method shown in Apple Business as the second.

When Apple supplies the DNS value, add it in Namecheap as a TXT record at the host Apple specifies. Its value begins with:

`apple-domain-verification=`

Keep the Apple TXT record alongside the GitHub domain-verification TXT record and the existing email TXT records. Do not replace unrelated TXT records.
```

- [ ] **Step 6: Add the repository README**

Create `README.md`:

````markdown
# Modern Town Hall

Public pre-launch company website for ModernTownhall LLC, hosted at [moderntownhall.com](https://moderntownhall.com).

## Local verification

```sh
npm test
npm run serve
```

Then open `http://localhost:4173/`.

Deployment and DNS instructions are in [`docs/deployment.md`](docs/deployment.md).
````

- [ ] **Step 7: Run all tests**

Run:

```bash
npm test
```

Expected: 12 tests PASS.

- [ ] **Step 8: Commit the deployment support**

Run:

```bash
git add tests/support-files.test.mjs CNAME robots.txt sitemap.xml 404.html docs/deployment.md README.md
git commit -m "docs: add Pages and verification support"
```

---

### Task 4: Local Regression and Visual Verification

**Files:**
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `404.html`
- Verify: `assets/moderntownhall-logo.png`
- Verify: `assets/highcontrast-logo.png`

**Interfaces:**
- Consumes: Complete static site from Tasks 1–3.
- Produces: A clean, locally verified commit ready to publish; any visual fixes remain within the approved design and rerun the complete test suite.

- [ ] **Step 1: Run the complete automated suite from a clean shell**

Run:

```bash
npm test
```

Expected: 12 tests PASS with zero failures.

- [ ] **Step 2: Check file and repository hygiene**

Run:

```bash
git status --short
git diff --check
find . -type f -size +2M -not -path './.git/*' -print
```

Expected: Clean worktree, no whitespace errors, and no repository file larger than 2 MB.

- [ ] **Step 3: Start the local site**

Run:

```bash
npm run serve
```

Expected: The local server listens at `http://localhost:4173/`.

- [ ] **Step 4: Verify HTTP behavior locally**

Run:

```bash
curl -I http://localhost:4173/
curl -I http://localhost:4173/404.html
curl -I http://localhost:4173/assets/moderntownhall-logo.png
```

Expected: Each request returns `HTTP/1.0 200 OK` or `HTTP/1.1 200 OK`.

- [ ] **Step 5: Perform desktop visual review**

Open `http://localhost:4173/` at 1280×900 and verify:

- The supplied logo is fully visible and does not overlap the headline.
- The MT monogram is centered in its circle.
- The headline, legal name, Columbus location, contact address, and pre-launch disclosure are visible.
- The trust strip, purpose grid, privacy flow, about section, contact band, and footer follow the approved Civic Ledger hierarchy.
- The browser console has no errors.

- [ ] **Step 6: Perform mobile and keyboard review**

Open `http://localhost:4173/` at 390×844 and verify:

- No horizontal scrollbar appears.
- Hero art precedes the hero copy and remains legible.
- Every three-column layout stacks into one column.
- `contact@moderntownhall.com` wraps without clipping.
- The skip link appears when Tab is pressed first.
- Focus rings remain visible on the home, contact, and return-home links.

- [ ] **Step 7: Verify the 404 page and image-failure fallback**

Open `http://localhost:4173/404.html`, confirm the return-home link works, then temporarily disable image loading in browser developer tools and confirm the homepage still communicates the complete company identity and purpose through text.

- [ ] **Step 8: Fix only observed regressions and reverify**

If a review step fails, modify only `index.html`, `styles.css`, or `404.html`, then run:

```bash
npm test
git diff --check
```

Expected: 12 tests PASS and no whitespace errors.

- [ ] **Step 9: Commit any verification fixes**

If Task 4 changed files, run:

```bash
git add index.html styles.css 404.html
git commit -m "fix: polish responsive public presence"
```

If Task 4 required no changes, do not create an empty commit.

---

### Task 5: Publish to GitHub Pages and Connect Namecheap

**Files:**
- Read: `docs/deployment.md`
- Read: `CNAME`
- External state: public GitHub repository `JWonz/moderntownhall`
- External state: Namecheap DNS zone for `moderntownhall.com`

**Interfaces:**
- Consumes: Clean, verified local `main` branch and exact DNS values from Task 3.
- Produces: Public HTTPS website at `https://moderntownhall.com`, preserved email forwarding, and a domain ready for Apple's TXT verification.

- [ ] **Step 1: Confirm GitHub authentication and remote safety**

Run:

```bash
gh auth status
gh repo view JWonz/moderntownhall
```

Expected: GitHub authentication is active. If the repository does not exist, `gh repo view` returns a not-found error and Step 2 creates it. If it exists and contains unrelated work, stop and ask the user before changing it.

- [ ] **Step 2: Create or connect the public repository and push `main`**

If the repository does not exist, run:

```bash
gh repo create JWonz/moderntownhall --public --source=. --remote=origin --push
```

If the repository exists and is confirmed safe for this site, run:

```bash
git remote add origin https://github.com/JWonz/moderntownhall.git
git push -u origin main
```

Expected: `main` is visible in the public GitHub repository and the local branch tracks `origin/main`.

- [ ] **Step 3: Verify the custom domain at the GitHub account level**

In GitHub, open **Settings → Pages → Add a domain**, enter `moderntownhall.com`, and copy the generated TXT host and value. In Namecheap **Advanced DNS**, add that exact TXT record without changing MX or other TXT records. Return to GitHub and select **Verify**.

Expected: GitHub reports `moderntownhall.com` as a verified domain for the JWonz account.

- [ ] **Step 4: Enable GitHub Pages from `main` and set the custom domain**

Run:

```bash
gh api --method POST repos/JWonz/moderntownhall/pages -F 'source[branch]=main' -F 'source[path]=/'
gh api --method PUT repos/JWonz/moderntownhall/pages -f cname=moderntownhall.com -F 'source[branch]=main' -F 'source[path]=/'
```

Expected: The create request returns the Pages site object and the update request returns no content. If the create request reports that Pages already exists, continue with the update request.

- [ ] **Step 5: Record existing email DNS before web changes**

Run:

```bash
dig +short MX moderntownhall.com
dig +short TXT moderntownhall.com
```

Expected: The MX output includes Namecheap forwarding hosts under `registrar-servers.com`. Save the output in the task transcript for comparison after web DNS changes.

- [ ] **Step 6: Replace only conflicting Namecheap web records**

In Namecheap **Domain List → Manage → Advanced DNS**, keep all MX and email-related TXT records. Remove only parked-page, URL-redirect, conflicting apex A/AAAA, and conflicting `www` records. Add:

```text
A      @      185.199.108.153      Automatic
A      @      185.199.109.153      Automatic
A      @      185.199.110.153      Automatic
A      @      185.199.111.153      Automatic
CNAME  www    jwonz.github.io      Automatic
```

Expected: Namecheap shows four GitHub Pages A records for `@`, one `www` CNAME, and the original email MX/TXT records.

- [ ] **Step 7: Verify public DNS and Pages status**

Run:

```bash
dig +short A moderntownhall.com
dig +short CNAME www.moderntownhall.com
dig +short MX moderntownhall.com
gh api repos/JWonz/moderntownhall/pages --jq '{status,html_url,cname,https_enforced,certificate:.https_certificate.state}'
```

Expected:

- Apex A output contains all four `185.199.10x.153` GitHub Pages addresses.
- `www` resolves through `jwonz.github.io`.
- MX output still contains the same Namecheap forwarding hosts captured in Step 5.
- GitHub reports `cname` as `moderntownhall.com` and the certificate state progresses to `approved`.

- [ ] **Step 8: Enforce HTTPS after certificate approval**

When the Pages API reports the certificate state as `approved`, run:

```bash
gh api --method PUT repos/JWonz/moderntownhall/pages -F https_enforced=true
```

Expected: The request returns no content and a subsequent Pages API read reports `https_enforced` as `true`.

- [ ] **Step 9: Verify the public website**

Run:

```bash
curl -I https://moderntownhall.com/
curl -I http://moderntownhall.com/
curl -I https://www.moderntownhall.com/
```

Expected:

- The canonical HTTPS URL returns `200`.
- HTTP redirects to HTTPS.
- `www` redirects to `https://moderntownhall.com/`.

Open the canonical site in a private browser window and confirm that it is public without authentication and displays the legal name, Columbus location, contact address, company purpose, pre-launch disclosure, and address-deletion language.

- [ ] **Step 10: Re-test email forwarding after DNS changes**

Send a message to `contact@moderntownhall.com` from an account other than its forwarding destination.

Expected: The message arrives in the configured personal Gmail inbox. If it does not, compare the current MX output with Step 5 before changing any record.

- [ ] **Step 11: Complete Apple's two-method verification when Apple supplies the token**

In Apple Business, choose domain validation and copy the generated value beginning with `apple-domain-verification=`. Add it as a new Namecheap TXT record at the host Apple specifies, keep the GitHub and email TXT records, wait for propagation, then select Verify in Apple Business.

Complete a second method using the company's EIN, D-U-N-S Number, a supported official document, App Store Connect if available, or another method Apple presents for the account.

Expected: Both verification methods are submitted while the website remains publicly accessible over HTTPS.

---

## Final Completion Gate

Before reporting completion, run or confirm all of the following:

```bash
npm test
git status --short
git log --oneline -5
dig +short A moderntownhall.com
dig +short MX moderntownhall.com
curl -I https://moderntownhall.com/
gh api repos/JWonz/moderntownhall/pages --jq '{status,html_url,cname,https_enforced,certificate:.https_certificate.state}'
```

Completion requires 12 passing tests, a clean worktree, a public `200` response over HTTPS, enforced HTTPS, a valid Pages certificate, preserved Namecheap MX records, a successful forwarded contact-email test, and both Apple verification methods ready or submitted.
