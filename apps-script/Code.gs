/**
 * HexLogic — contact form backend (Google Apps Script)
 * Receives the website contact / "request assessment" form POST and emails
 * security@hexlogic.io from your own Google Workspace. No third party involved.
 *
 * Deploy:  Extensions/Project > Deploy > New deployment > Web app
 *          Execute as: Me (security@hexlogic.io)
 *          Who has access: Anyone
 * Then paste the resulting /exec URL into js/site.js -> CONTACT_ENDPOINT.
 */

var TO = 'security@hexlogic.io';   // where inquiries are delivered

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // Honeypot: bots fill hidden "_honey"; silently drop them.
    if (p._honey) return _ok();

    var email   = (p.email || '').toString().trim();
    var name    = (p.name || p.company || 'Website visitor').toString().trim();
    var topic   = (p.report || p.inquiry_type || p.scope || 'General inquiry').toString().trim();

    var subject = 'New website inquiry — ' + topic;
    var body =
      'New inquiry from the HexLogic website\n' +
      '----------------------------------------\n' +
      'Name:        ' + (p.name || '-') + '\n' +
      'Company:     ' + (p.company || '-') + '\n' +
      'Work email:  ' + (email || '-') + '\n' +
      'Inquiry:     ' + (p.inquiry_type || p.report || '-') + '\n' +
      'Scope:       ' + (p.scope || '-') + '\n' +
      'Message:\n' + (p.message || '-') + '\n' +
      '----------------------------------------\n' +
      'Submitted:   ' + new Date().toString() + '\n';

    var opts = { name: 'HexLogic Website' };
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) opts.replyTo = email;
    GmailApp.sendEmail(TO, subject, body, opts);

    // Optional auto-reply to the requester.
    if (opts.replyTo) {
      GmailApp.sendEmail(email, 'We received your message — HexLogic',
        'Thanks for reaching out to HexLogic.\n\n' +
        'We have received your message and a senior engineer will respond within 24 hours ' +
        'over your preferred secure channel.\n\n— HexLogic Security');
    }
    return _ok();
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet() {
  return ContentService.createTextOutput('HexLogic contact endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function _ok() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
