// Shared helpers for building RFC 2822 MIME messages and base64url-encoding
// them for the Gmail API messages.send endpoint.
// Used by backend functions that send email through the Gmail connector.

export function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function buildRawMime(from, to, subject, html) {
  const boundary = '----=_Part_' + Math.random().toString(36).slice(2);
  const mime = [
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    `MIME-Version: 1.0`,
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    base64UrlEncode(html),
    `--${boundary}--`,
    ``,
  ].join('\r\n');
  return base64UrlEncode(mime);
}

// Sends an HTML email through the connected Gmail (shared) connector.
// `base44` is a createClientFromRequest instance. Returns { ok: true } or throws.
export async function sendGmail(base44, to, subject, html, fromName = 'FastAudit Portal') {
  const { accessToken } = await base44.asServiceRole.connectors.getConnection('gmail');
  const raw = buildRawMime(`${fromName} <fastaudit@gmail.com>`, to, subject, html);
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gmail API error: ${err}`);
  }
  return { ok: true };
}