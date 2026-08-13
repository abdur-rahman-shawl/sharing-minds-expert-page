import { describe, expect, it } from 'vitest'

import { renderMentorApplicationReceivedEmail } from './email-templates'

const templateInput = {
  fullName: 'Asha Rao',
  email: 'asha@example.com',
  logoUrl: 'https://sharingminds.in/brand/sharingminds-infinity-email.png',
}

describe('mentor application received email', () => {
  it('renders the premium sharingminds confirmation contract', () => {
    const email = renderMentorApplicationReceivedEmail(templateInput)

    expect(email.subject).toBe(
      'Your sharingminds expert application is now under review',
    )
    expect(email.preheader).toContain('5-10 business days')
    expect(email.html).toContain('>sharingminds</div>')
    expect(email.html).toContain('Application received')
    expect(email.html).toContain('Thank you, Asha Rao.')
    expect(email.html).toContain('5&ndash;10 business days')
    expect(email.html).toContain(`src="${templateInput.logoUrl}"`)
    expect(email.html).toContain('role="presentation"')
    expect(email.html).not.toContain('View application status')
    expect(email.html).not.toContain('<a ')
  })

  it('provides a complete plaintext fallback', () => {
    const email = renderMentorApplicationReceivedEmail(templateInput)

    expect(email.text).toContain('Thank you, Asha Rao.')
    expect(email.text).toContain('5-10 business days')
    expect(email.text).toContain('use the same address')
    expect(email.text).not.toContain('View application status')
  })

  it('uses account-backed language for live registrations', () => {
    const email = renderMentorApplicationReceivedEmail({
      ...templateInput,
      accountBacked: true,
    })

    expect(email.text).toContain('SharingMinds account email address')
    expect(email.text).toContain('securely connected to your SharingMinds account')
    expect(email.text).not.toContain('secured by this verified email')
  })

  it('escapes applicant-controlled HTML and collapses control characters', () => {
    const email = renderMentorApplicationReceivedEmail({
      ...templateInput,
      fullName: 'Asha <script>alert("x")</script>\nRao',
      email: 'asha+<expert>@example.com\r\n',
    })

    expect(email.html).not.toContain('<script>alert("x")</script>')
    expect(email.html).toContain(
      'Asha &lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; Rao',
    )
    expect(email.html).toContain('asha+&lt;expert&gt;@example.com')
    expect(email.text).toContain('Asha <script>alert("x")</script> Rao')
    expect(email.text).not.toContain('\nRao')
  })

  it('does not expose private application answers or uploaded-file details', () => {
    const email = renderMentorApplicationReceivedEmail(templateInput)
    const rendered = `${email.html}\n${email.text}`.toLowerCase()

    expect(rendered).not.toContain('linkedin')
    expect(rendered).not.toContain('resume')
    expect(rendered).not.toContain('hourly rate')
    expect(rendered).not.toContain('supporting evidence file')
  })
})
