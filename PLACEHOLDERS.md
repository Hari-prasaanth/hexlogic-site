# HexLogic — placeholders to replace before launch

Everything below is live and working, but uses sample/illustrative content
or a placeholder URL. Swap in your real details when ready.

## 1. Booking link
- **Where:** `index.html` (CTA section) and every `*-security.html` / `ai-security.html` / `trust.html` CTA.
- **Placeholder:** `https://cal.com/hexlogic`
- **Action:** create a free Cal.com or Calendly account and replace that URL everywhere
  (find/replace `https://cal.com/hexlogic`).

## 2. Analytics (privacy-friendly, free)
- **Where:** `index.html` `<head>` — a commented-out Plausible snippet.
- **Action:** sign up at plausible.io (paid, cheap) **or** self-host Umami (free),
  then uncomment the `<script>` and set `data-domain`. Add the same snippet to other
  pages if you want full-site stats.

## 3. Contact / report form (FormSubmit — free, automatic)
- **Where:** `index.html` modal + `contact.html` form, posting to
  `https://formsubmit.co/(ajax/)security@hexlogic.io`.
- **One-time activation:** after deploy, submit the form once; FormSubmit emails
  `security@hexlogic.io` an activation link — click it once and all future
  submissions (plus the auto-reply to the requester) are delivered automatically.
- **To change the destination email:** replace `security@hexlogic.io` in both files.

## 4. Case studies (homepage "Selected work")
- **Where:** `index.html` `#work` section.
- **Status:** anonymized, illustrative metrics/outcomes. Replace with real
  (still-anonymized) engagement snapshots, or full case studies under NDA.

## 5. Team (homepage "The team")
- **Where:** `index.html` `#team` section.
- **Status:** role-based profiles (no real names) + certification chips.
- **Action:** add real names, photos and bios if you want named credibility.

## 6. Trust Center
- **Where:** `trust.html`.
- **PGP fingerprint** is a `0000…` placeholder — paste your real fingerprint and,
  ideally, host the public key (e.g. `/.well-known/hexlogic-pgp.asc`) and link it.
- **SOC 2 / ISO 27001** are marked "on request" — update if/when you hold them.

## 7. Sample report PDFs  →  assets/report/
All report links (homepage Reports grid + each service page's "View sample report"
button) now point into **`assets/report/`** with fixed filenames. To publish a real
report, just drop a PDF into that folder using the exact name below — the link goes
live automatically, no HTML edits needed.

| Domain            | File to upload              |
|-------------------|-----------------------------|
| Web Application   | `assets/report/web.pdf`     |
| Network           | `assets/report/network.pdf` |
| API               | `assets/report/api.pdf`     |
| Mobile            | `assets/report/mobile.pdf`  |
| IoT & Embedded    | `assets/report/iot.pdf`     |
| Cloud             | `assets/report/cloud.pdf`   |
| MCP               | `assets/report/mcp.pdf`     |
| LLM & AI          | `assets/report/llm.pdf`     |

`web.pdf` is your existing sanitized sample. The other seven are **placeholder PDFs**
(a branded cover page) so no link is broken today — overwrite each with the real,
sanitized report when ready, keeping the same filename.

## 8. Research blog
- **Where:** `blog.html` + `research-*.html`. Two starter articles are included,
  bylined "HexLogic Research". Edit/add posts as `*.html` and link them from `blog.html`.

## 9. Social / OG image
- `assets/social-preview.jpg` is generated with the new brand. Regenerate if you
  change the tagline.
