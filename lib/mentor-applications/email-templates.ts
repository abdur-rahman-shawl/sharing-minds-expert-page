export type TransactionalEmail = {
  subject: string
  preheader: string
  html: string
  text: string
}

export type MentorApplicationReceivedEmailTemplateInput = {
  fullName: string
  email: string
  logoUrl: string
  accountBacked?: boolean
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function collapsePlainText(value: string, fallback: string): string {
  return value.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim() || fallback
}

export function renderMentorApplicationReceivedEmail(
  input: MentorApplicationReceivedEmailTemplateInput,
): TransactionalEmail {
  const fullName = collapsePlainText(input.fullName, 'there')
  const email = collapsePlainText(input.email, 'your verified email address')
  const safeFullName = escapeHtml(fullName)
  const safeEmail = escapeHtml(email)
  const safeLogoUrl = escapeHtml(input.logoUrl)
  const contactDescription = input.accountBacked
    ? 'your SharingMinds account email address'
    : 'this verified email address'
  const securityNote = input.accountBacked
    ? 'Your application is securely connected to your SharingMinds account. Use this account to access future verification and dashboard updates.'
    : 'Your application is secured by this verified email. When you later join sharingminds, use the same address so your approved expert profile can be connected to your account.'
  const sentReason = input.accountBacked
    ? 'an expert verification application was submitted through your SharingMinds account.'
    : 'an expert verification application was submitted using this verified address.'
  const subject = 'Your sharingminds expert application is now under review'
  const preheader =
    'We have received your application. Our verification team will review it within 5-10 business days.'

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${subject}</title>
    <style>
      @media only screen and (max-width: 640px) {
        .email-shell { width: 100% !important; }
        .email-card { padding: 28px 22px !important; }
        .email-header { padding: 24px 22px !important; }
        .email-title { font-size: 28px !important; line-height: 36px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f3f6fb;color:#172033;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${preheader}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f3f6fb;">
      <tr>
        <td align="center" style="padding:32px 12px;">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" class="email-shell" style="width:640px;max-width:640px;">
            <tr>
              <td class="email-header" style="padding:28px 36px;background:#0c1631;border-radius:20px 20px 0 0;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td width="78" valign="middle" style="width:78px;">
                      <img src="${safeLogoUrl}" width="64" height="33" alt="sharingminds infinity logo" style="display:block;width:64px;height:33px;border:0;" />
                    </td>
                    <td valign="middle">
                      <div style="font-size:24px;line-height:28px;font-weight:700;letter-spacing:-0.5px;color:#ffffff;">sharingminds</div>
                      <div style="margin-top:3px;font-size:12px;line-height:18px;color:#aebce0;">a human intelligence network</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td class="email-card" style="padding:42px 44px;background:#ffffff;border:1px solid #e3e9f3;border-top:0;">
                <div style="display:inline-block;padding:7px 12px;border-radius:999px;background:#edf2ff;color:#334bc5;font-size:12px;line-height:16px;font-weight:700;letter-spacing:0.7px;text-transform:uppercase;">Application received</div>
                <h1 class="email-title" style="margin:22px 0 16px;font-size:34px;line-height:42px;letter-spacing:-0.8px;color:#111a2e;">Thank you, ${safeFullName}.<br />Your expertise is now under consideration.</h1>
                <p style="margin:0;font-size:16px;line-height:27px;color:#4d5870;">We have received your application to join <strong style="color:#172033;">sharingminds</strong> as a verified expert. Every application is considered individually to preserve the quality, relevance, and professional integrity of our network.</p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:32px;border-collapse:separate;border-spacing:0;">
                  <tr>
                    <td style="padding:22px;background:#f7f9fc;border:1px solid #e5eaf3;border-radius:14px;">
                      <div style="font-size:13px;line-height:18px;font-weight:700;color:#172033;text-transform:uppercase;letter-spacing:0.7px;">What happens next</div>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:16px;">
                        <tr>
                          <td width="34" valign="top" style="width:34px;padding-bottom:15px;"><div style="width:24px;height:24px;border-radius:12px;background:#4169e1;color:#ffffff;font-size:12px;line-height:24px;text-align:center;font-weight:700;">1</div></td>
                          <td valign="top" style="padding:2px 0 15px;font-size:14px;line-height:21px;color:#4d5870;"><strong style="color:#172033;">Structured review.</strong> We will assess your professional background, expertise, and supporting evidence.</td>
                        </tr>
                        <tr>
                          <td width="34" valign="top" style="width:34px;padding-bottom:15px;"><div style="width:24px;height:24px;border-radius:12px;background:#4169e1;color:#ffffff;font-size:12px;line-height:24px;text-align:center;font-weight:700;">2</div></td>
                          <td valign="top" style="padding:2px 0 15px;font-size:14px;line-height:21px;color:#4d5870;"><strong style="color:#172033;">Personal follow-up, if needed.</strong> If we require additional context, we will write to ${contactDescription}.</td>
                        </tr>
                        <tr>
                          <td width="34" valign="top" style="width:34px;"><div style="width:24px;height:24px;border-radius:12px;background:#4169e1;color:#ffffff;font-size:12px;line-height:24px;text-align:center;font-weight:700;">3</div></td>
                          <td valign="top" style="padding-top:2px;font-size:14px;line-height:21px;color:#4d5870;"><strong style="color:#172033;">Review update.</strong> Most applications are reviewed within approximately 5&ndash;10 business days.</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <p style="margin:28px 0 0;font-size:15px;line-height:24px;color:#4d5870;">No further action is required at this stage. If we need any additional context, our verification team will contact you at ${contactDescription}.</p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:34px;">
                  <tr>
                    <td style="padding:16px 18px;background:#f8fafc;border-left:3px solid #8aa4f4;font-size:13px;line-height:20px;color:#5b667d;">${securityNote}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 34px 8px;background:#ffffff;border:1px solid #e3e9f3;border-top:0;border-radius:0 0 20px 20px;text-align:center;">
                <p style="margin:0;font-size:12px;line-height:19px;color:#7a8499;">This message was sent to ${safeEmail} because ${sentReason}</p>
                <p style="margin:12px 0 18px;font-size:12px;line-height:18px;color:#9aa3b5;">sharingminds &middot; A human intelligence network</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = `Your sharingminds expert application is now under review

Thank you, ${fullName}.

We have received your application to join sharingminds as a verified expert. Every application is considered individually to preserve the quality, relevance, and professional integrity of our network.

What happens next
1. Structured review: We will assess your professional background, expertise, and supporting evidence.
2. Personal follow-up, if needed: If we require additional context, we will write to ${contactDescription}.
3. Review update: Most applications are reviewed within approximately 5-10 business days.

No further action is required at this stage. If we need any additional context, our verification team will contact you at ${contactDescription}.

${securityNote}

This message was sent to ${email} because ${sentReason}

sharingminds - A human intelligence network`

  return { subject, preheader, html, text }
}
