# HexLogic contact backend — Google Apps Script

The website's contact form and the "Request an assessment" pop-up post to a Google
Apps Script web app that emails **security@hexlogic.io** from your own Google
Workspace. No third-party form service is involved.

## One-time setup (about 5 minutes)

1. Sign in to Google as **security@hexlogic.io** (or a Workspace user who can send
   as that mailbox) and open **https://script.google.com → New project**.
2. Delete the default code, paste the contents of **`Code.gs`** (in this folder),
   and save.
3. Click **Deploy → New deployment**.
   - Select type: **Web app** (gear icon → Web app).
   - **Execute as:** *Me (security@hexlogic.io)*
   - **Who has access:** *Anyone*
   - Click **Deploy**, then **Authorize access** and grant the Gmail permission.
4. Copy the **Web app URL** — it looks like
   `https://script.google.com/macros/s/AKfycb..../exec`.
5. Open **`js/site.js`** and replace the placeholder on the `CONTACT_ENDPOINT` line:
   ```js
   var CONTACT_ENDPOINT = 'https://script.google.com/macros/s/AKfycb..../exec';
   ```
6. Commit & deploy the site. Submit a test from the contact page — the email should
   arrive at security@hexlogic.io within a few seconds. (No activation step.)

## Notes
- **No secrets in the website.** The browser only knows the public `/exec` URL; your
  mailbox/credentials never leave Google.
- **Spam control:** a hidden `_honey` honeypot field silently drops bot submissions.
  For more, add a shared-secret token check in `doPost` and the form.
- **Auto-reply:** the script also sends the requester a short confirmation. Remove
  that block in `Code.gs` if you don't want it.
- **Updating the script:** after editing `Code.gs`, redeploy with
  *Deploy → Manage deployments → edit → New version* (the `/exec` URL stays the same).
- **Quota:** Gmail send limits are generous for a contact form (≈100–1,500/day
  depending on account type) — far beyond normal inquiry volume.
