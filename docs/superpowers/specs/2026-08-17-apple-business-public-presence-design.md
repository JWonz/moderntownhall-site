# Modern Town Hall Public Presence Design

**Date:** August 17, 2026  
**Status:** Approved in conversation; pending written-spec review  
**Company:** ModernTownhall LLC  
**Public brand:** Modern Town Hall  
**Primary domain:** `https://moderntownhall.com`

## Objective

Create a secure, operational, publicly accessible company website that establishes a credible public presence for ModernTownhall LLC and supports Apple Business verification. The site must accurately present the company as a pre-launch civic technology business rather than imply that the product is already available.

The website supports verification but does not guarantee Apple approval. Apple's current organization-verification process requires two verification methods. Domain validation, a business identifier such as an EIN or D-U-N-S Number, App Store Connect where applicable, and official documents are among the available methods.

## Public identity

The site uses **Modern Town Hall** as the readable public brand and **ModernTownhall LLC** as the exact legal name. The footer, organization metadata, and structured data include the legal name.

Public company details are:

- Brand: Modern Town Hall
- Legal entity: ModernTownhall LLC
- Business location: Columbus, Ohio, United States
- Contact: `contact@moderntownhall.com`
- Stage: Pre-launch
- Founder identity: Not displayed

The contact address currently forwards through Namecheap to the owner's personal Gmail account. The website must not claim that it is a standalone mailbox or imply that replies originate from the domain.

## Positioning and approved copy direction

Modern Town Hall is a civic technology company building a platform that connects Americans with the policies, representatives, and public discussions that affect where they live. The future product is designed around anonymous accounts whose residential addresses are used to establish district and jurisdiction eligibility, then deleted after verification.

The approved hero headline is:

> A stronger voice in the policies that shape your life.

The supporting sentence is:

> Modern Town Hall is building a platform that connects Americans with the policies, representatives, and public discussions that affect where they live.

All product descriptions use future-tense or design-intent language. The site explicitly states that product access and account registration are not yet available.

## Information architecture

The website is a focused single-page experience with the following order:

1. **Header** — MT monogram, Modern Town Hall wordmark, pre-launch status, and Columbus location.
2. **Hero** — pre-launch eyebrow, approved headline, plain-English company description, contact action, and the supplied full-color company logo.
3. **Trust strip** — three concise design principles:
   - Verify once, then delete.
   - Anonymous to the platform.
   - Locally relevant.
4. **Company purpose** — jurisdictions, shared public knowledge, and local public forums.
5. **Privacy flow** — verify an address privately, delete the submitted address, then participate anonymously.
6. **About the company** — legal stage, Columbus location, mission, and explicit pre-launch disclosure.
7. **Contact** — visible `contact@moderntownhall.com` address and a `mailto:` link for company, partnership, and verification inquiries.
8. **Footer** — ModernTownhall LLC, Columbus, Ohio, copyright year, and rights statement.

The page does not include a waitlist, account form, newsletter field, social-media claims, customer logos, testimonials, fabricated metrics, or unavailable product controls.

## Visual direction

The approved direction is **Civic Ledger**: editorial, established, politically neutral, and institutionally credible without appearing to be a government website.

The visual system uses:

- Warm ivory as the primary page surface.
- Deep navy for structural sections and primary text.
- Blue and green accents derived from the supplied logo.
- A restrained serif for display headings and system sans-serif fonts for interface and body text.
- Thin rules, generous spacing, Roman-numeral steps, and circular civic motifs.
- No remote web fonts or third-party visual resources.

The supplied `moderntownhall_logo.png` appears as the primary hero artwork. The header retains the approved circular **MT** monogram because the high-contrast logo did not remain optically legible within the small circular crop. The supplied `highcontrast_logo.png` may be reused as a favicon or browser icon where it remains legible.

The page must remain fully usable and visually coherent at widths from 320 pixels through large desktop screens. Mobile layouts stack the hero, trust strip, feature columns, privacy flow, contact section, and footer without horizontal scrolling.

## Privacy language

The page distinguishes the future product's design from the current marketing site's behavior.

For the future platform, the approved design intent is:

- A residential address is submitted privately to determine districts and jurisdiction eligibility.
- The submitted street address is deleted after verification.
- The system retains only the derived access or eligibility information needed for relevant civic spaces.
- Public activity is not connected to a retained street address or required public real-name identity.
- The copy describes these behaviors as design goals because the platform is pre-launch.

For the current marketing site:

- There are no forms, accounts, cookies, analytics, trackers, databases, or client-side data collection.
- The only contact interaction is a `mailto:` link.
- No secrets, personal addresses, or unpublished business records are included in the repository.
- GitHub may process ordinary hosting request data under its own service terms; the site does not make an absolute claim that no infrastructure logs exist.

## Technical architecture

The implementation is a dependency-free static website hosted with GitHub Pages.

```text
Namecheap DNS
├── Website records → GitHub Pages
├── Email MX/TXT records → existing Namecheap forwarding
└── Apple domain-verification TXT record → added when Apple provides it

GitHub repository: JWonz/moderntownhall
└── main branch, repository root → GitHub Pages
```

The site uses semantic HTML and a focused CSS file. JavaScript is not required for the page experience. Assets are stored locally in the public repository.

Expected repository artifacts are:

- `index.html`
- `styles.css`
- `404.html`
- `CNAME`
- `robots.txt`
- `sitemap.xml`
- `assets/moderntownhall-logo.png`
- `assets/highcontrast-logo.png`
- automated static-site tests
- a concise deployment and DNS guide

The `CNAME` file contains `moderntownhall.com`. GitHub Pages publishes from the root of the `main` branch.

## Search, sharing, and business metadata

The home page includes:

- A unique title centered on Modern Town Hall and public-policy participation.
- A concise meta description that identifies the company, pre-launch status, and purpose.
- Canonical URL `https://moderntownhall.com/`.
- Open Graph and social-sharing metadata using a local logo asset.
- Theme color and favicon declarations.
- `Organization` JSON-LD containing the public brand, legal name, URL, contact email, Columbus locality, Ohio region, and United States country.

The structured data does not include a street address, phone number, founder, founding date, social profile, or other information that has not been approved for public display.

`robots.txt` allows public crawling and identifies the sitemap. `sitemap.xml` contains the canonical home-page URL. The site does not claim search-engine indexing as a prerequisite for Apple verification; direct public accessibility is the immediate requirement.

## Accessibility and resilience

The implementation must:

- Use semantic landmarks and a logical heading hierarchy.
- Provide descriptive alternative text for meaningful logo artwork and empty alternative text for decorative marks.
- Maintain visible keyboard focus and a working skip link.
- Meet WCAG AA text contrast targets.
- Respect reduced-motion preferences.
- Avoid animation that is required to understand content.
- Keep the visible email address available even when a local mail application is not configured.
- Remain readable if the hero image fails to load.
- Use only local assets and system fonts so third-party failures cannot block rendering.
- Provide a branded `404.html` with a clear route back to the home page.

## DNS and deployment design

The Namecheap nameservers remain authoritative. The existing MX and email-related TXT records must not be removed or replaced.

At deployment time, Namecheap web records are configured for GitHub Pages using the current official GitHub values:

- Four apex `A` records for `@`:
  - `185.199.108.153`
  - `185.199.109.153`
  - `185.199.110.153`
  - `185.199.111.153`
- One `CNAME` record for `www` pointing to `jwonz.github.io`.

Any conflicting parked-page, URL-redirect, apex `A`, apex `AAAA`, or `www` record is resolved before publishing. Email MX records remain unchanged. Wildcard DNS records are not added.

The custom domain is added in the GitHub Pages repository settings before DNS is redirected to prevent domain-takeover risk. Both `moderntownhall.com` and `www.moderntownhall.com` resolve to the site, with GitHub Pages handling the canonical redirect. HTTPS enforcement is enabled after certificate provisioning.

Apple's domain-verification TXT record can coexist with the website and email records. It is added exactly as Apple supplies it and is verified independently of the GitHub Pages setup.

## Error handling

The static architecture removes most runtime failure modes. Remaining failures are handled as follows:

- Missing route: show the branded 404 page and home link.
- Missing image: preserve the company name and complete textual explanation.
- No configured email client: keep the contact address visible and selectable.
- DNS propagation delay: retain the GitHub-provided Pages URL as a deployment diagnostic until the custom domain resolves.
- HTTPS certificate delay: wait for DNS propagation, recheck custom-domain status, and enable HTTPS only when GitHub reports the certificate ready.
- Email regression: recheck the preserved Namecheap MX records and send a test from an unrelated address.

## Testing and acceptance criteria

Automated tests use only locally available runtime capabilities and verify that:

- The page contains the brand name, exact legal name, Columbus location, contact address, approved headline, and pre-launch disclosure.
- Privacy copy states that the submitted address is deleted after verification and avoids presenting the feature as currently available.
- Canonical, Open Graph, favicon, and Organization structured-data fields are present and internally consistent.
- All referenced local assets exist.
- The primary contact link uses `mailto:contact@moderntownhall.com`.
- No remote scripts, analytics identifiers, forms, or cookie-setting code are present.
- `CNAME`, `robots.txt`, `sitemap.xml`, and `404.html` contain the expected domain and navigation values.

Visual verification covers desktop and mobile rendering, keyboard navigation, focus visibility, overflow, contrast, image loading, the 404 page, and the mail link.

Post-deployment verification confirms:

- `https://moderntownhall.com` returns a successful response.
- HTTP redirects to HTTPS.
- The HTTPS certificate is valid for the custom domain.
- The `www` and apex hostnames converge on one canonical URL.
- The page is publicly reachable without authentication.
- The legal name, business location, contact address, and company purpose are visible in rendered content.
- The contact forwarding address still receives a test message.
- Apple's TXT record is publicly resolvable after it is added.

The project is ready for the Apple verification submission when all acceptance checks pass and the separate second verification method is available.

## Non-goals

This MVP does not include the civic platform itself, user accounts, address verification, forums, representative or policy data, a content-management system, analytics, a waitlist, outbound email infrastructure, social profiles, or paid hosting.

## References

- [Apple: Sign up and verify your organization](https://support.apple.com/guide/business/sign-up-and-verify-your-organization-axm402206497/web)
- [GitHub: Manage a custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [GitHub: Secure a GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [Namecheap: Set up free email forwarding](https://www.namecheap.com/support/knowledgebase/article.aspx/308/2214/how-to-set-up-free-email-forwarding/)
