/**
 * ICS education programs (MA-EL and MWS-E) — application receiver
 * (Google Apps Script web app)
 *
 * The online form on /mael-apply-new/ and /mwse-apply-new/ (js/application.js) takes
 * the application fee through PayPal, then posts the application here. This
 * script:
 *
 *   1. checks every answer again (never trusts the browser),
 *   2. asks PayPal directly whether the order was paid in full to ICS (once
 *      the PayPal secret is added), and refuses an order number used before,
 *   3. creates a Drive folder for the applicant holding their uploaded
 *      documents and a PDF of their answers,
 *   4. adds a row to the Applications Google Sheet,
 *   5. emails the Registrar and Program Director (PDF attached) and sends the
 *      applicant a confirmation.
 *
 * Setup and yearly maintenance: see _scripts/SETUP.md.
 * The same code runs the MA & PhD form (philosophy repo,
 * _scripts/ma-phd-applications.gs); only CONFIG differs.
 * The PayPal client ID below is public (it is also on the website). The PayPal
 * secret is optional: without it every application is saved and marked
 * "CHECK PAYMENT" for the Registrar to match in PayPal; with it, payments are
 * checked automatically. The secret lives in Project Settings → Script
 * properties as PAYPAL_SECRET, never in this file and never on the website.
 */

/* ── Settings you may change ─────────────────────────────────────────────── */

var CONFIG = {
  TITLE: 'MA-EL/MWS-E',                // used in email subjects and the PDF
  SERVICE: 'ICS education applications',
  REF_PATTERN: /^EDU-\d{4}-[A-Z0-9]{6}$/,
  FEE: 90,                        // CAD, by the deadline
  LATE_FEE: 120,                  // CAD, after the deadline
  CURRENCY: 'CAD',
  // ICS's live PayPal app: the same client ID as application.js, ART in Orvieto, F2BF and the MA & PhD form.
  PAYPAL_CLIENT_ID: 'AdZ0cWK3Bl7wjgmrmgk_On-ac13XCdpZxx8te_4IPlRDVoYx3ZNoGG8vK7mb8VXdKH2L-TM1M3sMj6oI',
  ROOT_FOLDER_NAME: 'ICS MA-EL and MWS-E Applications',
  SHEET_NAME: 'ICS MA-EL and MWS-E Applications',
  // People who receive every application and get edit access to the folder.
  STAFF: ['academic-registrar@icscanada.edu', 'evanderboom@icscanada.edu'],
  REPLY_TO: 'academic-registrar@icscanada.edu',
  SENDER_NAME: 'Institute for Christian Studies · Education programs',
  // Keep in step with PROGRAMS in application.js. Deadlines: [month, day, years before the start].
  PROGRAMS: {
    mael: { name: 'MA in Educational Leadership (MA-EL)', referees: 2, terms: { winter: [11, 1, 1], summer: [4, 1, 0], fall: [4, 1, 0] } },
    mwse: { name: 'Master of Worldview Studies in Education (MWS-E)', referees: 2, terms: { winter: [12, 1, 1], summer: [4, 1, 0], fall: [8, 1, 0] } }
  },
  CONCENTRATIONS: { instructional: 'Instructional Leadership', administration: 'School Administration', inclusion: 'Inclusion', literacy: 'Literacy' },
  CONCENTRATION_FOR: ['mael'],    // which programs ask for a concentration
  THESES: false,                  // ask for baccalaureate and master's thesis titles
  DOCUMENTS: { statement: 'Statement of purpose', sample: 'Writing sample', ielts: 'IELTS Test Report Form' },
  MAX_FILE_BYTES: 10 * 1024 * 1024,
  ALLOWED_TYPES: {
    'application/pdf': 'pdf', 'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.oasis.opendocument.text': 'odt', 'application/rtf': 'rtf',
    'image/jpeg': 'jpg', 'image/png': 'png'
  }
};

/* ── Everything below is shared with the MA & PhD script ─────────────────── */

var TERMS = { winter: { label: 'Winter', month: 1 }, summer: { label: 'Summer', month: 5 }, fall: { label: 'Fall', month: 9 } };
var ENGLISH = { first: 'English is my first language', toefl: 'TOEFL (sent by ETS)', ielts: 'IELTS' };

function headers_() {
  return [].concat(
    ['Submitted', 'Reference', 'Payment status', 'Fee', 'Program'],
    CONFIG.CONCENTRATIONS ? ['Concentration'] : [],
    ['Start', 'First name', 'Last name', 'Email', 'Phone', 'Street address', 'City', 'Province / State',
      'Postal code', 'Country', 'Permanent address', 'Education'],
    CONFIG.THESES ? ['Baccalaureate thesis', 'Master’s thesis'] : [],
    ['First language', 'Other languages', 'English proficiency', 'Academic referees', 'Personal referee'],
    Object.keys(CONFIG.DOCUMENTS).map(function (k) { return CONFIG.DOCUMENTS[k]; }),
    ['Signature', 'Folder', 'Application PDF', 'PayPal order ID', 'PayPal capture ID', 'Amount paid', 'PayPal payer email']
  );
}

/* ── One-time setup (run from the editor) ─────────────────────────────────── */

/**
 * Creates the Drive folder and the Sheet, shares the folder with STAFF as
 * editors, and remembers both IDs. Safe to run again: it reuses what exists.
 */
function setup() {
  var props = PropertiesService.getScriptProperties();
  var folder = getRootFolder_();
  if (!folder) {
    folder = DriveApp.createFolder(CONFIG.ROOT_FOLDER_NAME);
    props.setProperty('ROOT_FOLDER_ID', folder.getId());
  }
  CONFIG.STAFF.forEach(function (email) { folder.addEditor(email); });

  var sheet = getSheet_();
  if (!sheet) {
    var headers = headers_();
    var ss = SpreadsheetApp.create(CONFIG.SHEET_NAME);
    DriveApp.getFileById(ss.getId()).moveTo(folder);
    sheet = ss.getSheets()[0];
    sheet.setName('Applications');
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);
    // Everything below the header is stored as plain text, never as formulas.
    sheet.getRange(2, 1, sheet.getMaxRows() - 1, headers.length).setNumberFormat('@');
    props.setProperty('SHEET_ID', ss.getId());
  }
  Logger.log('Folder: ' + folder.getUrl());
  Logger.log('Sheet:  ' + SpreadsheetApp.openById(props.getProperty('SHEET_ID')).getUrl());
  Logger.log('PayPal: ' + checkPayPal_());
}

/* ── Web endpoints ────────────────────────────────────────────────────────── */

/** GET: a health check you can open in a browser after deploying. */
function doGet() {
  return json_({
    ok: true,
    service: CONFIG.SERVICE,
    storage: !!(getRootFolder_() && getSheet_()),
    paypal: hasSecret_() ? (checkPayPal_() === 'connected' ? 'checked automatically' : 'secret not working') : 'not checked automatically'
  });
}

/** POST: one application, sent by application.js after PayPal approves. */
function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'bad_request', message: 'The application could not be read.' });
  }

  var problems = validate_(data);
  if (problems.length) {
    return json_({ ok: false, error: 'invalid', message: 'Some answers need attention: ' + problems.join('; ') + '.' });
  }

  var payment = verifyPayment_(data.orderId, data.ref, data.fee);
  if (payment.status === 'rejected') {
    return json_({ ok: false, error: 'payment', message: payment.reason });
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var sheet = getSheet_();
    if (!sheet) throw new Error('Run setup() first: the Applications sheet does not exist.');

    var existing = findOrder_(sheet, data.orderId);
    if (existing) {
      // The same applicant retrying after a dropped connection: already saved.
      if (existing.ref === data.ref) return json_({ ok: true, ref: data.ref, duplicate: true });
      return json_({ ok: false, error: 'payment', message: 'This PayPal payment has already been used for another application.' });
    }

    var record = buildRecord_(data, payment);
    var folder = getRootFolder_().createFolder(record.folderName);
    Object.keys(CONFIG.DOCUMENTS).forEach(function (key) {
      var doc = data.documents[key];
      if (!doc || !doc.file) return;
      var f = doc.file;
      var name = CONFIG.DOCUMENTS[key] + ' - ' + data.lastName + ', ' + data.firstName;
      var ext = CONFIG.ALLOWED_TYPES[f.type];
      var blob = Utilities.newBlob(Utilities.base64Decode(f.data), f.type, safeName_(name + '.' + ext, ext));
      record.files[key] = folder.createFile(blob).getName();
    });

    var pdf = folder.createFile(buildPdf_(record));

    var row = rowFor_(record, folder, pdf);
    sheet.appendRow(headers_().map(function (h) { return plain_(row[h]); }));
    SpreadsheetApp.flush();

    notifyStaff_(record, folder, pdf);
    confirmApplicant_(record);

    return json_({ ok: true, ref: record.ref });
  } catch (err) {
    console.error(err && err.stack || err);
    MailApp.sendEmail(Session.getEffectiveUser().getEmail(),
      CONFIG.TITLE + ': an application failed to save',
      'Reference ' + data.ref + ', PayPal order ' + data.orderId + ', ' + data.email + '\n\n' + (err && err.stack || err));
    return json_({ ok: false, error: 'server', message: 'Your application could not be saved.' });
  } finally {
    lock.releaseLock();
  }
}

/* ── Validation ───────────────────────────────────────────────────────────── */

function validate_(d) {
  var p = [];
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function str(v, max) { return String(v == null ? '' : v).trim().slice(0, max); }
  function text(key, label, max, required) {
    var v = d[key];
    if (v == null || v === '') { if (required) p.push(label + ' is required'); d[key] = ''; return; }
    if (typeof v !== 'string') { p.push(label + ' is not valid'); return; }
    d[key] = v.trim();
    if (required && !d[key]) p.push(label + ' is required');
    if (d[key].length > max) p.push(label + ' is too long');
  }

  text('ref', 'Reference', 40, true);
  if (d.ref && !CONFIG.REF_PATTERN.test(d.ref)) p.push('reference is not valid');
  text('orderId', 'PayPal order', 40, true);
  if (d.orderId && !/^[A-Z0-9]{8,30}$/.test(d.orderId)) p.push('PayPal order is not valid');
  d.fee = Number(d.fee);
  if (d.fee !== CONFIG.FEE && d.fee !== CONFIG.LATE_FEE) p.push('the application fee is not valid');

  text('firstName', 'First name', 100, true);
  text('lastName', 'Last name', 100, true);
  text('email', 'Email', 200, true);
  if (d.email && !EMAIL.test(d.email)) p.push('email address is not valid');
  text('phone', 'Phone', 40, true);
  text('street', 'Street address', 200, true);
  text('city', 'City', 100, true);
  text('region', 'Province / State', 100, true);
  text('postal', 'Postal code', 20, true);
  text('country', 'Country', 100, true);
  text('permanentAddress', 'Permanent address', 400, false);

  var program = own_(CONFIG.PROGRAMS, d.program) ? CONFIG.PROGRAMS[d.program] : null;
  if (!program) p.push('choose a program');
  if (CONFIG.CONCENTRATIONS && CONFIG.CONCENTRATION_FOR.indexOf(d.program) !== -1) {
    if (!own_(CONFIG.CONCENTRATIONS, d.concentration)) p.push('choose a concentration');
  } else {
    d.concentration = '';
  }
  var start = /^(winter|summer|fall)-(\d{4})$/.exec(String(d.start || ''));
  var year = new Date().getFullYear();
  if (!start || !program || !own_(program.terms, start[1]) || +start[2] > year + 4 ||
      new Date(+start[2], TERMS[start[1]].month - 1, 1) < new Date(Date.now() - 31 * 86400000)) p.push('choose a start term that has not begun');

  if (!Array.isArray(d.education) || !d.education.length) {
    p.push('list at least one institution');
  } else if (d.education.length > 8) {
    p.push('too many education entries');
  } else {
    d.education = d.education.map(function (row) {
      row = row || {};
      return { institution: str(row.institution, 200), degree: str(row.degree, 150), year: str(row.year, 30) };
    }).filter(function (row) { return row.institution; });
    if (!d.education.length) p.push('list at least one institution');
  }
  text('baccThesis', 'Baccalaureate thesis', 300, false);
  text('mastersThesis', 'Master’s thesis', 300, false);
  if (!CONFIG.THESES) { d.baccThesis = ''; d.mastersThesis = ''; }

  text('firstLanguage', 'First language', 100, true);
  text('otherLanguages', 'Other languages', 300, false);
  if (!own_(ENGLISH, d.english)) p.push('choose how you will show English proficiency');

  var refs = Array.isArray(d.referees) ? d.referees : [];
  d.referees = refs.slice(0, 3).map(function (r) {
    r = r || {};
    return { name: str(r.name, 150), institution: str(r.institution, 200), email: str(r.email, 200) };
  });
  if (program && (d.referees.length < program.referees || d.referees.slice(0, program.referees).some(function (r) { return !r.name || !r.institution; }))) {
    p.push('list ' + program.referees + ' academic referees');
  }
  if (program) d.referees = d.referees.slice(0, program.referees);
  var pr = d.personal || {};
  d.personal = { name: str(pr.name, 150), relationship: str(pr.relationship, 150), email: str(pr.email, 200) };
  if (!d.personal.name || !d.personal.relationship) p.push('name your personal referee');
  d.referees.concat([d.personal]).forEach(function (r) {
    if (r.email && !EMAIL.test(r.email)) p.push('check the email address for ' + (r.name || 'a referee'));
  });

  var docs = d.documents && typeof d.documents === 'object' ? d.documents : {};
  d.documents = {};
  Object.keys(CONFIG.DOCUMENTS).forEach(function (key) {
    var wanted = key !== 'ielts' || d.english === 'ielts';
    var doc = docs[key];
    if (!wanted) return;
    if (!doc || (!doc.later && !doc.file)) { p.push('add your ' + CONFIG.DOCUMENTS[key].toLowerCase() + ' or say you will send it'); return; }
    if (doc.file) {
      var f = doc.file;
      if (!f || typeof f.data !== 'string' || !own_(CONFIG.ALLOWED_TYPES, f.type)) { p.push(CONFIG.DOCUMENTS[key] + ' must be a PDF or Word file'); return; }
      if (f.data.length * 0.75 > CONFIG.MAX_FILE_BYTES + 3) { p.push(CONFIG.DOCUMENTS[key] + ' must be 10 MB or smaller'); return; }
      d.documents[key] = { file: { name: str(f.name, 200), type: f.type, data: f.data } };
    } else {
      d.documents[key] = { later: true };
    }
  });

  if (d.transcripts !== true) p.push('confirm your transcripts will be sent');
  if (d.references !== true) p.push('confirm your referees will send their letters');
  if (d.declaration !== true) p.push('confirm the declaration');
  text('signature', 'Signature', 200, true);
  return p;
}

/* ── Fees ─────────────────────────────────────────────────────────────────── */

/** The fee due for this start term on a given date: the late fee after the deadline. */
function feeDue_(d, when) {
  var m = /^(winter|summer|fall)-(\d{4})$/.exec(d.start);
  var dl = CONFIG.PROGRAMS[d.program].terms[m[1]];
  var deadline = new Date(+m[2] - dl[2], dl[0] - 1, dl[1], 23, 59, 59);
  return when > deadline ? CONFIG.LATE_FEE : CONFIG.FEE;
}

/* ── PayPal ───────────────────────────────────────────────────────────────── */

function paypalBase_() {
  return PropertiesService.getScriptProperties().getProperty('PAYPAL_ENV') === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
}

function paypalToken_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('PAYPAL_CLIENT_ID') || CONFIG.PAYPAL_CLIENT_ID;
  var secret = props.getProperty('PAYPAL_SECRET');
  if (!secret) throw new Error('PayPal secret is not set in Script properties.');
  var res = UrlFetchApp.fetch(paypalBase_() + '/v1/oauth2/token', {
    method: 'post',
    headers: { Authorization: 'Basic ' + Utilities.base64Encode(id + ':' + secret) },
    payload: { grant_type: 'client_credentials' },
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) throw new Error('PayPal sign-in failed (' + res.getResponseCode() + ').');
  return JSON.parse(res.getContentText()).access_token;
}

function hasSecret_() {
  return !!PropertiesService.getScriptProperties().getProperty('PAYPAL_SECRET');
}

function checkPayPal_() {
  if (!hasSecret_()) return 'not checked automatically (no PAYPAL_SECRET); applications will be marked CHECK PAYMENT';
  try { paypalToken_(); return 'connected'; } catch (err) { return String(err.message || err); }
}

/**
 * Looks the order up with ICS's own PayPal credentials. An order made with any
 * other PayPal account can't be looked up at all, so a found, completed order
 * for at least the regular fee is ICS's money.
 *
 * Returns status 'paid' | 'pending' | 'unverified' | 'rejected'.
 * 'unverified' means PayPal itself could not be reached (or there is no
 * secret yet): the application is kept and flagged for a manual check.
 */
function verifyPayment_(orderId, ref, fee) {
  if (!hasSecret_()) {
    return { status: 'unverified', note: 'Payments are not checked automatically yet; find this PayPal order ID in PayPal to confirm the CAD $' + fee + ' fee.' };
  }
  var res;
  try {
    var token = paypalToken_();
    res = UrlFetchApp.fetch(paypalBase_() + '/v2/checkout/orders/' + encodeURIComponent(orderId), {
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true
    });
  } catch (err) {
    console.error('PayPal unreachable: ' + err);
    return { status: 'unverified', note: 'PayPal could not be reached; check this payment in PayPal.' };
  }

  var code = res.getResponseCode();
  if (code >= 500) return { status: 'unverified', note: 'PayPal returned an error; check this payment in PayPal.' };
  if (code !== 200) return { status: 'rejected', reason: 'We could not find this PayPal payment.' };

  var order = JSON.parse(res.getContentText());
  var unit = (order.purchase_units || [])[0] || {};
  var capture = ((unit.payments || {}).captures || [])[0] || {};
  var amount = capture.amount || unit.amount || {};

  if (order.status !== 'COMPLETED') return { status: 'rejected', reason: 'This PayPal payment was not completed.' };
  if (amount.currency_code !== CONFIG.CURRENCY || Number(amount.value) < CONFIG.FEE) {
    return { status: 'rejected', reason: 'This PayPal payment is not the CAD $' + CONFIG.FEE + ' application fee.' };
  }
  if (unit.custom_id && unit.custom_id !== ref) {
    return { status: 'rejected', reason: 'This PayPal payment belongs to a different application.' };
  }

  var result = {
    status: capture.status === 'COMPLETED' ? 'paid' : 'pending',
    captureId: capture.id || '',
    paid: Number(amount.value),
    amount: amount.value + ' ' + amount.currency_code,
    payerEmail: (order.payer || {}).email_address || ''
  };
  if (result.status === 'pending') result.note = 'PayPal shows this payment as ' + (capture.status || 'pending') + '.';
  return result;
}

/* ── Records, PDF, emails ─────────────────────────────────────────────────── */

function buildRecord_(d, payment) {
  var now = new Date();
  var tz = Session.getScriptTimeZone();
  var m = /^(winter|summer|fall)-(\d{4})$/.exec(d.start);
  // A day's grace: the applicant saw the fee when they started paying.
  var due = feeDue_(d, new Date(now.getTime() - 36 * 3600 * 1000));
  var paid = payment.paid || d.fee;
  if (paid < due) {
    payment.note = (payment.note ? payment.note + ' ' : '') + 'This is a late application: CAD $' + due + ' was due and CAD $' + paid + ' was paid.';
  }
  return {
    ref: d.ref,
    submitted: Utilities.formatDate(now, tz, 'yyyy-MM-dd HH:mm'),
    submittedLong: Utilities.formatDate(now, tz, "MMMM d, yyyy 'at' h:mm a z"),
    folderName: Utilities.formatDate(now, tz, 'yyyy-MM-dd') + ' ' + d.lastName + ', ' + d.firstName + ' (' + d.ref + ')',
    d: d,
    payment: payment,
    paymentLabel: { paid: 'Paid', pending: 'Payment pending', unverified: 'CHECK PAYMENT' }[payment.status],
    feeLabel: 'CAD $' + d.fee + (d.fee === CONFIG.LATE_FEE ? ' (late)' : ''),
    programName: CONFIG.PROGRAMS[d.program].name,
    concentrationName: d.concentration ? CONFIG.CONCENTRATIONS[d.concentration] : '',
    startName: TERMS[m[1]].label + ' ' + m[2],
    files: {}
  };
}

function educationText_(rows) {
  return rows.map(function (r) { return [r.institution, r.degree, r.year].filter(String).join(' · '); }).join('\n');
}
function refereeText_(r, second) {
  return [r.name, r[second], r.email].filter(String).join(' · ');
}
function documentText_(rec, key) {
  var doc = rec.d.documents[key];
  if (!doc) return key === 'ielts' ? 'Not applicable' : '';
  return doc.file ? rec.files[key] + ' (in the applicant’s folder)' : 'Will be sent separately';
}

function rowFor_(r, folder, pdf) {
  var d = r.d;
  var row = {
    'Submitted': r.submitted, 'Reference': r.ref, 'Payment status': r.paymentLabel + (r.payment.note ? ': ' + r.payment.note : ''),
    'Fee': r.feeLabel, 'Program': r.programName, 'Concentration': r.concentrationName, 'Start': r.startName,
    'First name': d.firstName, 'Last name': d.lastName, 'Email': d.email, 'Phone': d.phone,
    'Street address': d.street, 'City': d.city, 'Province / State': d.region, 'Postal code': d.postal, 'Country': d.country,
    'Permanent address': d.permanentAddress || 'Same as mailing address',
    'Education': educationText_(d.education),
    'Baccalaureate thesis': d.baccThesis, 'Master’s thesis': d.mastersThesis,
    'First language': d.firstLanguage, 'Other languages': d.otherLanguages, 'English proficiency': ENGLISH[d.english],
    'Academic referees': d.referees.map(function (x) { return refereeText_(x, 'institution'); }).join('\n'),
    'Personal referee': refereeText_(d.personal, 'relationship'),
    'Signature': d.signature, 'Folder': folder.getUrl(), 'Application PDF': pdf.getUrl(), 'PayPal order ID': d.orderId,
    'PayPal capture ID': r.payment.captureId || '', 'Amount paid': r.payment.amount || '', 'PayPal payer email': r.payment.payerEmail || ''
  };
  Object.keys(CONFIG.DOCUMENTS).forEach(function (k) { row[CONFIG.DOCUMENTS[k]] = documentText_(r, k); });
  return row;
}

/** The application, laid out as a document. Used for the PDF and the staff email. */
function applicationHtml_(r) {
  var d = r.d;
  function row(label, value) {
    return '<tr><th>' + esc_(label) + '</th><td>' + esc_(value || '—').replace(/\n/g, '<br>') + '</td></tr>';
  }
  var edu = d.education.map(function (e) {
    return '<tr><td>' + esc_(e.institution) + '</td><td>' + esc_(e.degree || '—') + '</td><td>' + esc_(e.year || '—') + '</td></tr>';
  }).join('');
  var refs = d.referees.map(function (x, i) {
    return row('Academic referee ' + (i + 1), [x.name, x.institution, x.email].filter(String).join('\n'));
  }).join('');

  return '<html><head><meta charset="utf-8"><style>' +
    'body{font-family:Arial,Helvetica,sans-serif;color:#2E2A28;font-size:10.5pt;line-height:1.45;margin:0}' +
    'h1{color:#073146;font-size:20pt;margin:0 0 2pt}' +
    'h2{color:#073146;font-size:11pt;border-bottom:1.5pt solid #073146;padding-bottom:3pt;margin:18pt 0 6pt}' +
    '.meta{color:#7B3F49;font-size:9.5pt;margin:0 0 4pt}' +
    'table{border-collapse:collapse;width:100%}' +
    'th,td{text-align:left;vertical-align:top;padding:4pt 6pt 4pt 0;border-bottom:0.5pt solid #D9CFC6}' +
    'th{width:34%;color:#5B5550;font-weight:normal}' +
    '.edu th{width:auto;color:#073146;font-weight:bold}' +
    '.note{color:#5B5550;font-size:9pt}' +
    '</style></head><body>' +
    '<p class="meta">Institute for Christian Studies · ' + esc_(CONFIG.TITLE) + ' application</p>' +
    '<h1>' + esc_(d.firstName + ' ' + d.lastName) + '</h1>' +
    '<p class="note">Reference ' + esc_(r.ref) + ' · submitted ' + esc_(r.submittedLong) + '</p>' +

    '<h2>Program</h2><table>' +
    row('Program', r.programName) +
    (r.concentrationName ? row('Concentration', r.concentrationName) : '') +
    row('Intended start', r.startName) +
    '</table>' +

    '<h2>Applicant</h2><table>' +
    row('Email', d.email) + row('Telephone', d.phone) +
    row('Mailing address', [d.street, d.city + ', ' + d.region, d.postal, d.country].join('\n')) +
    row('Permanent address', d.permanentAddress || 'Same as mailing address') +
    '</table>' +

    '<h2>Academic history</h2><table class="edu"><tr><th>Institution and location</th><th>Degree</th><th>Year</th></tr>' + edu + '</table>' +
    (CONFIG.THESES ? '<table>' + row('Baccalaureate thesis', d.baccThesis) + row('Master’s thesis', d.mastersThesis) + '</table>' : '') +

    '<h2>Languages</h2><table>' +
    row('First language', d.firstLanguage) + row('Other languages', d.otherLanguages) + row('English proficiency', ENGLISH[d.english]) +
    '</table>' +

    '<h2>References</h2><table>' + refs +
    row('Personal referee', [d.personal.name, d.personal.relationship, d.personal.email].filter(String).join('\n')) +
    '</table>' +

    '<h2>Documents</h2><table>' +
    Object.keys(CONFIG.DOCUMENTS).map(function (k) { return row(CONFIG.DOCUMENTS[k], documentText_(r, k)); }).join('') +
    row('Transcripts', 'Applicant confirms they have requested, or will request, official transcripts') +
    '</table>' +

    '<h2>Declaration</h2><table>' +
    row('Declaration', 'Applicant confirms the application is complete and accurate') +
    row('Signature', d.signature) + row('Date', r.submittedLong) +
    '</table>' +

    '<h2>Application fee</h2><table>' +
    row('Status', r.paymentLabel + (r.payment.note ? ' (' + r.payment.note + ')' : '')) +
    row('Fee charged', r.feeLabel) +
    row('Amount', r.payment.amount || 'not confirmed') +
    row('PayPal order', d.orderId) + row('PayPal capture', r.payment.captureId) +
    row('PayPal payer email', r.payment.payerEmail) +
    '</table></body></html>';
}

function buildPdf_(r) {
  var name = 'Application - ' + r.d.lastName + ', ' + r.d.firstName + ' (' + r.ref + ').pdf';
  return Utilities.newBlob(applicationHtml_(r), MimeType.HTML, 'application.html')
    .getAs(MimeType.PDF).setName(safeName_(name, 'pdf'));
}

function notifyStaff_(r, folder, pdf) {
  var d = r.d;
  var flag = r.payment.status === 'paid' && !/late application/.test(r.payment.note || '') ? '' : '[' + r.paymentLabel + '] ';
  MailApp.sendEmail({
    to: CONFIG.STAFF.join(','),
    replyTo: d.email,
    name: CONFIG.SENDER_NAME,
    subject: flag + CONFIG.TITLE + ' application: ' + d.firstName + ' ' + d.lastName + ' (' + r.programName + ', ' + r.startName + ')',
    htmlBody: '<p><a href="' + folder.getUrl() + '">Open the applicant’s folder</a> (PDF and documents) · ' +
      '<a href="' + getSheet_().getParent().getUrl() + '">Open the Applications sheet</a></p>' +
      (r.payment.note ? '<p style="color:#7B3F49"><b>' + esc_(r.payment.note) + '</b></p>' : '') +
      applicationHtml_(r).replace(/^[\s\S]*<body>|<\/body>[\s\S]*$/g, ''),
    attachments: [pdf.getBlob()]
  });
}

function confirmApplicant_(r) {
  var d = r.d;
  var later = Object.keys(CONFIG.DOCUMENTS).filter(function (k) { return d.documents[k] && d.documents[k].later; })
    .map(function (k) { return CONFIG.DOCUMENTS[k].toLowerCase(); });
  var td = 'padding:3px 16px 3px 0;color:#5B5550';
  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#2E2A28;font-size:15px;line-height:1.55;max-width:560px">' +
    '<p style="color:#7B3F49;font-size:13px;margin:0 0 16px">Institute for Christian Studies · ' + esc_(CONFIG.TITLE) + '</p>' +
    '<p>Dear ' + esc_(d.firstName) + ',</p>' +
    '<p>Thank you for applying to ICS. We have received your application and your CAD $' + d.fee + ' application fee.</p>' +
    '<table style="border-collapse:collapse;margin:8px 0 20px">' +
    '<tr><td style="' + td + '">Reference</td><td>' + esc_(r.ref) + '</td></tr>' +
    '<tr><td style="' + td + '">Applying for</td><td>' + esc_(r.programName) + (r.concentrationName ? ', ' + esc_(r.concentrationName) : '') + '</td></tr>' +
    '<tr><td style="' + td + '">Intended start</td><td>' + esc_(r.startName) + '</td></tr>' +
    '<tr><td style="' + td + '">PayPal order</td><td>' + esc_(d.orderId) + '</td></tr>' +
    '</table>' +
    '<p><b>To complete your application</b></p><ul style="padding-left:20px">' +
    (later.length ? '<li>Email your ' + esc_(later.join(' and ')) + ' to the Academic Registrar, quoting reference ' + esc_(r.ref) + '.</li>' : '') +
    (d.english === 'toefl' ? '<li>Ask ETS to send your TOEFL score to ICS (institution code 9541).</li>' : '') +
    '<li>Ask every post-secondary institution you have attended to send an official transcript directly to ICS.</li>' +
    '<li>Ask your referees to send their letters directly to the Academic Registrar.</li>' +
    '</ul>' +
    '<p>The Academic Registrar will write to you about admission once your application is complete. Your PayPal receipt arrives separately.</p>' +
    '<p>If you have any questions, reply to this email or write to the Academic Registrar at ' +
    '<a href="mailto:academic-registrar@icscanada.edu" style="color:#073146">academic-registrar@icscanada.edu</a>.</p>' +
    '<p style="margin-top:28px">Institute for Christian Studies<br>59 St. George Street, Toronto, Ontario M5S 2E6<br>1-416-979-2331 · toll free 1-888-326-5347</p>' +
    '</div>';
  MailApp.sendEmail({
    to: d.email,
    replyTo: CONFIG.REPLY_TO,
    name: CONFIG.SENDER_NAME,
    subject: 'Your ICS ' + CONFIG.TITLE + ' application (' + r.ref + ')',
    htmlBody: html
  });
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function getRootFolder_() {
  var id = PropertiesService.getScriptProperties().getProperty('ROOT_FOLDER_ID');
  if (!id) return null;
  try { return DriveApp.getFolderById(id); } catch (err) { return null; }
}

function getSheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) return null;
  try { return SpreadsheetApp.openById(id).getSheets()[0]; } catch (err) { return null; }
}

/** Finds an earlier row for this PayPal order; returns { ref } or null. */
function findOrder_(sheet, orderId) {
  var headers = headers_();
  var col = headers.indexOf('PayPal order ID') + 1;
  var cell = sheet.getRange(1, col, Math.max(sheet.getLastRow(), 1), 1)
    .createTextFinder(orderId).matchEntireCell(true).findNext();
  if (!cell) return null;
  return { ref: sheet.getRange(cell.getRow(), headers.indexOf('Reference') + 1).getDisplayValue() };
}

/** Text that Sheets must never treat as a formula. */
function own_(obj, key) {
  return !!obj && typeof key === 'string' && Object.prototype.hasOwnProperty.call(obj, key);
}

function plain_(v) {
  v = v == null ? '' : String(v);
  return /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
}

function esc_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** A filesystem-safe name with the right extension. */
function safeName_(name, ext) {
  var base = String(name || 'file').replace(/\.[^.]*$/, '').replace(/[^\w\s.,()'-]+/g, '_').trim().slice(0, 80) || 'file';
  return base + '.' + ext;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
