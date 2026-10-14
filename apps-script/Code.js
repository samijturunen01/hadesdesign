/**
 * Contact form backend – Google Apps Script web app
 * =================================================
 *
 * Shared template (based on the Okkuva backend). Site-specific settings are in
 * Site.js; this file should be the same for every site.
 *
 * Script properties (saved once by setup() in the generated Setup.js):
 *   RECAPTCHA_SECRET  reCAPTCHA secret key               required
 *   TO_EMAIL          where messages are delivered      required
 *   SHEET_ID          Google Sheet id for a message log optional, needs the spreadsheets scope
 *   MIN_SCORE         overrides SITE.minScore           optional
 *
 * Request:  POST with Content-Type text/plain and a JSON body: the fields in
 *           SITE.fields, plus token (reCAPTCHA v3), website (honeypot, must stay
 *           empty), elapsed (ms since the form was shown, optional) and page
 *           (URL, optional). text/plain avoids a CORS preflight, which Apps
 *           Script cannot answer.
 * Response: { ok: true } or { ok: false, error: code }, where code is one of
 *           bad-request, validation, recaptcha, recaptcha-score, rate-limit, server.
 */

var LIMITS = {
  MIN_ELAPSED_MS: 2500, // form filled in faster than this = probably a bot
  RATE_LIMIT_PER_EMAIL_SECONDS: 60,
  RATE_LIMIT_GLOBAL_PER_HOUR: 40,
  MAX_TOKEN_LENGTH: 5000,
}

var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
var PHONE_RE = /^[+\d][\d\s()-]{5,}$/

/* ------------------------------------------------------------------ */
/* Entry points                                                          */
/* ------------------------------------------------------------------ */

/** Health check: open the web app URL in a browser. */
function doGet() {
  return jsonResponse({ ok: true, service: SITE.name + ' – contact form' })
}

function doPost(e) {
  try {
    var payload = parseBody(e)
    if (!payload) return jsonResponse({ ok: false, error: 'bad-request' })

    // Honeypot: real users never see this field. Report success so bots learn nothing.
    if (payload.website) return jsonResponse({ ok: true })

    var validation = validatePayload(payload)
    if (validation.errors.length) {
      return jsonResponse({ ok: false, error: 'validation', details: validation.errors })
    }

    if (typeof payload.elapsed === 'number' && payload.elapsed >= 0 && payload.elapsed < LIMITS.MIN_ELAPSED_MS) {
      return jsonResponse({ ok: false, error: 'recaptcha' })
    }

    // Verify first so requests without a valid token cannot use up the rate limit.
    var captcha = verifyRecaptcha(validation.token)
    if (!captcha.ok) return jsonResponse({ ok: false, error: captcha.error })

    if (!checkRateLimit(fieldValue(validation.data, 'email'))) {
      return jsonResponse({ ok: false, error: 'rate-limit' })
    }

    var meta = { score: captcha.score, page: str(payload.page).slice(0, 500) }
    sendEmail(validation.data, meta)
    appendToSheet(validation.data, meta)

    return jsonResponse({ ok: true })
  } catch (err) {
    console.error(err && err.stack ? err.stack : err)
    return jsonResponse({ ok: false, error: 'server' })
  }
}

/* ------------------------------------------------------------------ */
/* Request parsing & validation                                          */
/* ------------------------------------------------------------------ */

function parseBody(e) {
  if (!e || !e.postData || !e.postData.contents) return null
  try {
    var body = JSON.parse(e.postData.contents)
    return body && typeof body === 'object' ? body : null
  } catch (err) {
    return null
  }
}

/** Trimmed string without control characters (newlines and tabs are kept). */
function str(value) {
  if (value === undefined || value === null) return ''
  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
}

/**
 * Checks the payload against SITE.fields.
 * @returns {{ errors: string[], data: Array<{ field: Object, value: string }>, token: string }}
 */
function validatePayload(payload) {
  var errors = []

  var data = SITE.fields.map(function (field) {
    var value = str(payload[field.key])
    if (field.type !== 'long') value = value.replace(/[\r\n]+/g, ' ')

    var max = field.max || 500
    var invalid =
      (field.required && !value) ||
      (value && field.min && value.length < field.min) ||
      value.length > max ||
      (value && field.type === 'email' && !EMAIL_RE.test(value)) ||
      (value && field.type === 'phone' && !PHONE_RE.test(value)) ||
      (value && field.options && !Object.prototype.hasOwnProperty.call(field.options, value))
    if (invalid) errors.push(field.key)

    return { field: field, value: value }
  })

  // Older sites send the token as recaptchaToken.
  var token = payload.token || payload.recaptchaToken
  if (!token || typeof token !== 'string' || token.length > LIMITS.MAX_TOKEN_LENGTH) errors.push('token')

  return { errors: errors, data: data, token: token }
}

function fieldValue(data, key) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].field.key === key) return data[i].value
  }
  return ''
}

/** Value as shown to people: option labels instead of option values, '–' for empty. */
function displayValue(item) {
  if (!item.value) return '–'
  return item.field.options ? item.field.options[item.value] : item.value
}

/* ------------------------------------------------------------------ */
/* reCAPTCHA v3                                                          */
/* ------------------------------------------------------------------ */

function verifyRecaptcha(token) {
  var props = PropertiesService.getScriptProperties()
  var secret = props.getProperty('RECAPTCHA_SECRET')
  if (!secret) {
    console.error('RECAPTCHA_SECRET is missing from Script properties – run setup() once')
    return { ok: false, error: 'server' }
  }
  var minScore = parseFloat(props.getProperty('MIN_SCORE') || SITE.minScore || 0.5)

  var response = UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'post',
    payload: { secret: secret, response: token },
    muteHttpExceptions: true,
  })
  var result
  try {
    result = JSON.parse(response.getContentText())
  } catch (err) {
    console.error('Unreadable siteverify response: ' + response.getContentText())
    return { ok: false, error: 'recaptcha' }
  }

  if (!result.success) {
    console.warn('reCAPTCHA rejected the token: ' + JSON.stringify(result['error-codes'] || []))
    return { ok: false, error: 'recaptcha' }
  }
  if (result.action && result.action !== SITE.recaptchaAction) {
    console.warn('Unexpected reCAPTCHA action: ' + result.action)
    return { ok: false, error: 'recaptcha' }
  }
  if (typeof result.score === 'number' && result.score < minScore) {
    console.warn('reCAPTCHA score too low: ' + result.score)
    return { ok: false, error: 'recaptcha-score' }
  }
  if (!isAllowedHostname(result.hostname)) {
    console.warn('Token from an unexpected hostname: ' + result.hostname)
    return { ok: false, error: 'recaptcha' }
  }
  return { ok: true, score: result.score }
}

/** Same rule as the reCAPTCHA key: an allowed domain also covers its subdomains. */
function isAllowedHostname(hostname) {
  var allowed = SITE.allowedHostnames || []
  if (!allowed.length) return true
  var host = String(hostname || '').toLowerCase()
  return allowed.some(function (domain) {
    domain = domain.toLowerCase()
    return host === domain || host.slice(-(domain.length + 1)) === '.' + domain
  })
}

/* ------------------------------------------------------------------ */
/* Rate limiting (CacheService, best effort)                             */
/* ------------------------------------------------------------------ */

function checkRateLimit(email) {
  var cache = CacheService.getScriptCache()
  var emailKey = 'rl:' + Utilities.base64EncodeWebSafe(email.toLowerCase())
  if (cache.get(emailKey)) return false
  cache.put(emailKey, '1', LIMITS.RATE_LIMIT_PER_EMAIL_SECONDS)

  var hourKey = 'rl:global:' + Math.floor(Date.now() / 3600000)
  var count = parseInt(cache.get(hourKey) || '0', 10) + 1
  cache.put(hourKey, String(count), 3600)
  return count <= LIMITS.RATE_LIMIT_GLOBAL_PER_HOUR
}

/* ------------------------------------------------------------------ */
/* Email                                                                 */
/* ------------------------------------------------------------------ */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 * @param {Array} data validated fields
 * @param {{ score: number, page: string }} meta
 * @param {string} [testRecipient] send a test message here instead of TO_EMAIL
 */
function sendEmail(data, meta, testRecipient) {
  var to = testRecipient || PropertiesService.getScriptProperties().getProperty('TO_EMAIL')
  if (!to) throw new Error('TO_EMAIL is missing from Script properties – run setup() once')

  var name = fieldValue(data, 'name')
  var subject = (testRecipient ? '[TESTI] ' : '') + SITE.subjectPrefix + (name ? ': ' + name : '')
  var shortItems = data.filter(function (item) {
    return item.field.type !== 'long'
  })
  var longItems = data.filter(function (item) {
    return item.field.type === 'long'
  })
  var footer = [
    'Lähetetty sivulta: ' + (meta.page || '–'),
    'reCAPTCHA-pisteet: ' + (meta.score !== undefined ? meta.score : '–'),
    'Aika: ' + Utilities.formatDate(new Date(), 'Europe/Helsinki', 'd.M.yyyy HH:mm'),
  ]

  var plain =
    shortItems
      .map(function (item) {
        return item.field.label + ': ' + displayValue(item)
      })
      .join('\n') +
    longItems
      .map(function (item) {
        return '\n\n' + item.field.label + ':\n' + displayValue(item)
      })
      .join('') +
    '\n\n—\n' +
    footer.join('\n') +
    '\nVastaa tähän viestiin, niin vastaus menee suoraan lähettäjälle.'

  var html =
    '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#1a1a1a">' +
    '<h2 style="margin:0 0 16px">Uusi yhteydenotto verkkosivuilta</h2>' +
    '<table cellpadding="6" style="border-collapse:collapse">' +
    shortItems
      .map(function (item) {
        return (
          '<tr><td style="color:#666;padding-right:16px;vertical-align:top"><strong>' +
          escapeHtml(item.field.label) +
          '</strong></td><td>' +
          escapeHtml(displayValue(item)) +
          '</td></tr>'
        )
      })
      .join('') +
    '</table>' +
    longItems
      .map(function (item) {
        return (
          '<h3 style="margin:20px 0 8px">' +
          escapeHtml(item.field.label) +
          '</h3>' +
          '<p style="white-space:pre-wrap;background:#f4f4f5;padding:12px 14px;border-left:4px solid ' +
          (SITE.accentColor || '#888') +
          ';border-radius:6px">' +
          escapeHtml(displayValue(item)) +
          '</p>'
        )
      })
      .join('') +
    '<p style="color:#888;font-size:12px;margin-top:24px">' +
    footer.map(escapeHtml).join('<br>') +
    '</p></div>'

  var replyTo = fieldValue(data, 'email')
  var message = { to: to, name: SITE.senderName, subject: subject, body: plain, htmlBody: html }
  if (replyTo) message.replyTo = replyTo
  MailApp.sendEmail(message)
}

/** Called by setup(): sends a sample message so the email layout and permissions can be checked. */
function sendTestEmail_(to) {
  var samples = { email: to, phone: '040 123 4567', long: 'Tämä on testiviesti yhteydenottolomakkeen taustapalvelusta.' }
  var data = SITE.fields.map(function (field) {
    var value = field.options ? Object.keys(field.options)[0] : samples[field.key] || samples[field.type] || 'Testi Testinen'
    return { field: field, value: value }
  })
  sendEmail(data, { score: 0.9, page: 'setup()' }, to)
  console.log('Test email sent to ' + to)
}

/* ------------------------------------------------------------------ */
/* Google Sheet log (optional)                                           */
/* ------------------------------------------------------------------ */

function appendToSheet(data, meta) {
  var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID')
  if (!sheetId) return
  try {
    var sheet = SpreadsheetApp.openById(sheetId).getSheets()[0]
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(
        ['Aika']
          .concat(
            data.map(function (item) {
              return item.field.label
            }),
          )
          .concat(['reCAPTCHA', 'Sivu']),
      )
    }
    sheet.appendRow(
      [new Date()]
        .concat(
          data.map(function (item) {
            return cell(item.value)
          }),
        )
        .concat([meta.score !== undefined ? meta.score : '', cell(meta.page)]),
    )
  } catch (err) {
    // Logging must never break the submission itself.
    console.error('Sheet logging failed: ' + err)
  }
}

/** Store user input as plain text: "+358…" or "=…" would otherwise be parsed as a formula. */
function cell(value) {
  var s = String(value)
  return /^[=+\-@]/.test(s) ? "'" + s : s
}

/* ------------------------------------------------------------------ */
/* Helpers                                                               */
/* ------------------------------------------------------------------ */

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}
