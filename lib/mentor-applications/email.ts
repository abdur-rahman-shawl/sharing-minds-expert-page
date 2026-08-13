import 'server-only'

import nodemailer from 'nodemailer'

import type { EmailOtpPurpose } from './constants'
import { renderMentorApplicationReceivedEmail } from './email-templates'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function purposeCopy(purpose: EmailOtpPurpose): { subject: string; action: string } {
  switch (purpose) {
    case 'MENTOR_APPLICATION_CLAIM':
      return {
        subject: 'Confirm your SharingMinds mentor application',
        action: 'claim your mentor application',
      }
    case 'ACCOUNT_EMAIL_VERIFICATION':
      return {
        subject: 'Verify your SharingMinds email',
        action: 'verify your SharingMinds email',
      }
    default:
      return {
        subject: 'Your SharingMinds mentor application code',
        action: 'continue your mentor application',
      }
  }
}

function getPublicUrl(pathname: string): string {
  const configuredBaseUrl = process.env.APP_BASE_URL || process.env.BETTER_AUTH_URL
  if (!configuredBaseUrl) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('APP_BASE_URL is required to render mentor application emails')
    }
    return new URL(pathname, 'http://localhost:3000').toString()
  }

  const url = new URL(pathname, configuredBaseUrl)
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('APP_BASE_URL must use HTTP or HTTPS')
  }
  return url.toString()
}

export async function sendEmailOtp(input: {
  email: string
  code: string
  purpose: EmailOtpPurpose
}): Promise<void> {
  const sender = process.env.GMAIL_APP_USER
  const password = process.env.GMAIL_APP_PASSWORD
  if (!sender || !password) {
    throw new Error('Gmail SMTP credentials are not configured')
  }

  const copy = purposeCopy(input.purpose)
  const safeCode = escapeHtml(input.code)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: sender, pass: password },
  })

  await transporter.sendMail({
    from: `"Sharing Minds" <${sender}>`,
    to: input.email,
    subject: copy.subject,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;color:#172033">
        <h2 style="margin:0 0 16px;color:#5239cc">Verify your email</h2>
        <p>Use this one-time code to ${copy.action}:</p>
        <p style="font-size:32px;font-weight:700;letter-spacing:8px;margin:24px 0">${safeCode}</p>
        <p>This code expires in 10 minutes and can be used only once.</p>
        <p style="color:#667085;font-size:13px">If you did not request this code, you can safely ignore this email.</p>
      </div>
    `,
  })
}

export async function sendMentorApplicationReceivedEmail(input: {
  email: string
  fullName: string
  accountBacked?: boolean
}): Promise<void> {
  const sender = process.env.GMAIL_APP_USER
  const password = process.env.GMAIL_APP_PASSWORD
  if (!sender || !password) return

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: sender, pass: password },
  })
  const email = renderMentorApplicationReceivedEmail({
    email: input.email,
    fullName: input.fullName,
    logoUrl: getPublicUrl('/brand/sharingminds-infinity-email.png'),
    accountBacked: input.accountBacked,
  })

  await transporter.sendMail({
    from: `"sharingminds" <${sender}>`,
    to: input.email,
    subject: email.subject,
    text: email.text,
    html: email.html,
  })
}
