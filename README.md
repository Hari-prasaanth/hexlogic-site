# HexLogic — production website

Static, framework-free site implementing the **HexLogic Design System**
(Fortune-100 enterprise direction). Drop-in replacement for the repo root —
deploys as-is on **GitHub Pages** (the `CNAME` points at `hexlogic.io`).

## Structure

```
index.html        Marketing homepage (hero, services, methodology, reports, CTA)
contact.html      Contact page with secure inquiry form
privacy.html      Privacy policy
terms.html        Terms of use
thanks.html       Form success page (form _next target)
404.html          Not-found page
css/hexlogic.css  The whole design system as vanilla CSS (tokens + components)
js/site.js        Theme toggle, sticky nav, mobile menu, contact modal
assets/           logo-light/dark/mark, favicon, social-preview
web_report.pdf    Sample sanitized report (linked from Reports)
CNAME, robots.txt, sitemap.xml, .well-known/security.txt
```

## How to deploy

1. Copy everything in this `site/` folder to the **root** of
   `Hari-prasaanth/hexlogic-site` (replacing the old files).
2. Commit and push. GitHub Pages serves it at `hexlogic.io`.

## What changed vs. the old site

- Rebuilt to the new enterprise design system: deep-ink surfaces, electric-cyan
  accent, amber secondary, IBM Plex Sans + JetBrains Mono, restrained gradient.
- Dark default with a **persisted light/dark toggle** (`data-theme` on `<html>`).
- New hero with a live "Assessment Summary" findings panel, a standards strip
  (OWASP · PTES · MITRE ATT&CK · NIST · OSSTMM), and a contact modal.
- All inline `<style>` blocks consolidated into one cacheable `css/hexlogic.css`.

## Media removed (unused / oversized)

Dropped from the repo to cut weight (~8 MB):

- `logo.png` (4.8 MB) and `hero.png` (2.5 MB) — unused.
- `favicon.ico` (82 KB) — replaced by a lean 128px `assets/favicon.png`.
- old root `favicon.png` (640 KB) — resized to 128px.
- `cyberpunk-fonts.css` — unused.

## Forms

`contact.html` and the homepage modal post to **FormSubmit**
(`https://formsubmit.co/security@hexlogic.io`), matching the original setup.
Update the endpoint/email if it changes.
