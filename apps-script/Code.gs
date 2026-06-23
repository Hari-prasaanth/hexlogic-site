/**
 * HexLogic — contact form backend (Google Apps Script)
 * Emails security@hexlogic.io from your own Google Workspace. No third party.
 *
 * Deploy:  Deploy > New deployment > Web app
 *          Execute as: Me (security@hexlogic.io)   |   Who has access: Anyone
 * After EDITING this file you MUST redeploy the new version:
 *          Deploy > Manage deployments > edit (pencil) > Version: New version > Deploy
 *          (the /exec URL stays the same — no website change needed)
 */

var TO = 'security@hexlogic.io';
var LOGO = 'https://hexlogic.io/assets/logo-light.png';
var SITE = 'https://hexlogic.io/';

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};
    if (p._honey) return _ok();                       // honeypot: drop bots

    var email = (p.email || '').toString().trim();
    var name  = (p.name || '').toString().trim();
    var topic = (p.report || p.inquiry_type || p.scope || 'General inquiry').toString().trim();
    var valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

    GmailApp.sendEmail(TO, 'New website inquiry — ' + topic,
      teamPlain_(p, topic),
      { name: 'HexLogic Website', htmlBody: teamHtml_(p, topic), replyTo: valid ? email : undefined });

    if (valid) {
      GmailApp.sendEmail(email, 'We received your message — HexLogic',
        replyPlain_(name || 'there'),
        { name: 'HexLogic Security', htmlBody: replyHtml_(name || 'there') });
    }
    return _ok();
  } catch (err) {
    return ContentService.createTextOutput('error: ' + err).setMimeType(ContentService.MimeType.TEXT);
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
function esc_(s) { return (s == null ? '' : String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

/* ---------------- shared email chrome ---------------- */
function shell_(innerHtml) {
  return '' +
  '<div style="margin:0;padding:0;background:#060910;">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#060910;padding:26px 12px;">' +
  '<tr><td align="center">' +
  '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0b101b;border:1px solid #1c2435;border-radius:16px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">' +
    '<tr><td style="height:4px;line-height:4px;font-size:0;background:#22D3EE;background:linear-gradient(90deg,#22D3EE,#0E9DB8,#FFB02E,#FF6A2C);">&nbsp;</td></tr>' +
    '<tr><td align="center" style="padding:28px 30px 14px;background:#0a0e18;">' +
      '<img src="' + LOGO + '" alt="HexLogic" width="190" style="display:block;border:0;outline:none;max-width:190px;height:auto;">' +
      '<div style="margin-top:10px;color:#1fb6cf;font-size:11px;letter-spacing:3px;font-weight:bold;">ENTERPRISE OFFENSIVE SECURITY</div>' +
    '</td></tr>' +
    innerHtml +
    '<tr><td style="padding:18px 30px;background:#070a12;border-top:1px solid #1c2435;">' +
      '<p style="margin:0;color:#6b7894;font-size:12px;line-height:1.6;">Sent from <a href="mailto:security@hexlogic.io" style="color:#1fb6cf;text-decoration:none;">security@hexlogic.io</a>. All engagements are handled under NDA.</p>' +
      '<p style="margin:8px 0 0;color:#4f5a72;font-size:11px;">&copy; HexLogic — Confidential Security Assessment Firm</p>' +
    '</td></tr>' +
  '</table></td></tr></table></div>';
}

/* ---------------- auto-reply to the requester ---------------- */
function replyHtml_(name) {
  var body =
    '<tr><td style="padding:34px 36px 6px;background:#0b101b;">' +
      '<h1 style="margin:0 0 6px;color:#F5F8FC;font-size:24px;font-weight:bold;">Message received</h1>' +
      '<p style="margin:0 0 20px;color:#9aa6c0;font-size:14px;">Thank you for contacting HexLogic.</p>' +
      '<p style="margin:0 0 14px;color:#cdd5e6;font-size:15px;line-height:1.7;">Hi ' + esc_(name) + ',</p>' +
      '<p style="margin:0 0 22px;color:#cdd5e6;font-size:15px;line-height:1.7;">We&rsquo;ve received your message and it&rsquo;s now with our team. A senior, certified engineer will review it and respond personally &mdash; typically well within 24 hours &mdash; over your preferred secure channel.</p>' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e1626;border-radius:10px;margin:0 0 26px;">' +
        '<tr><td style="padding:14px 18px;border-left:3px solid #22D3EE;color:#bfe9f2;font-size:14px;line-height:1.6;">' +
          '<b style="color:#F5F8FC;">Response &lt; 24 hours</b> &nbsp;&middot;&nbsp; Encrypted comms available &nbsp;&middot;&nbsp; NDA on request</td></tr>' +
      '</table>' +
      '<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:8px;background:#22D3EE;">' +
        '<a href="' + SITE + '" style="display:inline-block;padding:12px 28px;color:#04141A;font-size:14px;font-weight:bold;text-decoration:none;">Visit hexlogic.io &rarr;</a>' +
      '</td></tr></table>' +
      '<p style="margin:26px 0 0;color:#8793ae;font-size:13px;">&mdash; HexLogic Security</p>' +
    '</td></tr>';
  return shell_(body);
}
function replyPlain_(name) {
  return 'Hi ' + name + ',\n\nThank you for contacting HexLogic. We have received your message and a senior ' +
    'engineer will respond personally within 24 hours over your preferred secure channel.\n\nVisit: ' + SITE +
    '\n\n— HexLogic Security';
}

/* ---------------- internal team notification ---------------- */
function teamHtml_(p, topic) {
  var email = (p.email || '').toString().trim();
  var valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  var who = (p.name || p.company || (valid ? email : 'Website visitor')).toString().trim();
  var initial = esc_((who.charAt(0) || 'H').toUpperCase());

  function rowIf(k, v) {
    v = (v || '').toString().trim();
    if (!v) return '';
    return '<tr>' +
      '<td style="padding:11px 16px;border-bottom:1px solid #1c2435;color:#8793ae;font-size:13px;white-space:nowrap;vertical-align:top;width:120px;">' + k + '</td>' +
      '<td style="padding:11px 16px;border-bottom:1px solid #1c2435;color:#E3E8F1;font-size:14px;line-height:1.5;">' + esc_(v) + '</td></tr>';
  }
  var rows = rowIf('Company', p.company) + rowIf('Inquiry type', p.inquiry_type || p.report) + rowIf('Scope', p.scope);
  var rowsBlock = rows
    ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e1626;border:1px solid #1c2435;border-radius:10px;overflow:hidden;margin:0 0 22px;">' + rows + '</table>'
    : '';
  var msg = (p.message || '').toString().trim();
  var msgBlock = msg
    ? '<p style="margin:0 0 8px;color:#8793ae;font-size:12px;letter-spacing:.06em;text-transform:uppercase;">Message</p>' +
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e1626;border-radius:10px;margin:0 0 22px;">' +
        '<tr><td style="padding:16px 18px;border-left:3px solid #FF6A2C;color:#E3E8F1;font-size:15px;line-height:1.7;white-space:pre-wrap;">' + esc_(msg) + '</td></tr>' +
      '</table>'
    : '';
  var replyBtn = valid
    ? '<table role="presentation" cellpadding="0" cellspacing="0"><tr><td style="border-radius:8px;background:#22D3EE;">' +
        '<a href="mailto:' + esc_(email) + '?subject=' + encodeURIComponent('Re: your HexLogic inquiry') +
        '" style="display:inline-block;padding:11px 24px;color:#04141A;font-size:14px;font-weight:bold;text-decoration:none;">Reply to ' + esc_(who) + ' &rarr;</a>' +
      '</td></tr></table>'
    : '';

  var body =
    '<tr><td style="padding:30px 36px 4px;background:#0b101b;">' +
      '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 4px;"><tr>' +
        '<td><span style="display:inline-block;background:#0e1626;border:1px solid #2a3a55;color:#7fe3f2;font-size:11px;font-weight:bold;letter-spacing:.05em;text-transform:uppercase;padding:5px 12px;border-radius:999px;">New inquiry</span></td>' +
      '</tr></table>' +
      '<h1 style="margin:12px 0 4px;color:#F5F8FC;font-size:22px;font-weight:bold;">' + esc_(topic) + '</h1>' +
      '<p style="margin:0 0 22px;color:#9aa6c0;font-size:14px;">A new message arrived via the HexLogic website.</p>' +

      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0e1626;border:1px solid #1c2435;border-radius:12px;margin:0 0 22px;"><tr>' +
        '<td width="52" style="padding:16px 0 16px 16px;vertical-align:middle;">' +
          '<div style="width:42px;height:42px;border-radius:50%;background:#13314a;color:#7fe3f2;font-size:18px;font-weight:bold;text-align:center;line-height:42px;">' + initial + '</div>' +
        '</td>' +
        '<td style="padding:14px 16px;vertical-align:middle;">' +
          '<div style="color:#F5F8FC;font-size:16px;font-weight:bold;">' + esc_(who) + '</div>' +
          (valid ? '<a href="mailto:' + esc_(email) + '" style="color:#1fb6cf;font-size:14px;text-decoration:none;">' + esc_(email) + '</a>' : '<span style="color:#8793ae;font-size:14px;">No email provided</span>') +
        '</td>' +
      '</tr></table>' +

      rowsBlock + msgBlock + replyBtn +
      '<p style="margin:22px 0 4px;color:#4f5a72;font-size:12px;">Submitted ' + esc_(new Date().toString()) + '</p>' +
    '</td></tr>';
  return shell_(body);
}
function teamPlain_(p, topic) {
  var L = function (k, v) { v = (v || '').toString().trim(); return v ? (k + ': ' + v + '\n') : ''; };
  return 'New website inquiry — ' + topic + '\n\n' +
    L('Name', p.name) + L('Company', p.company) + L('Email', p.email) +
    L('Inquiry', p.inquiry_type || p.report) + L('Scope', p.scope) +
    '\nMessage:\n' + ((p.message || '').toString().trim() || '(none provided)') + '\n\n' +
    'Submitted ' + new Date().toString();
}
