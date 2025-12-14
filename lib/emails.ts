
import nodemailer from 'nodemailer';

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_APP_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `"Sharing Minds" <${process.env.GMAIL_APP_USER}>`,
    to,
    subject,
    html,
  });
}

export async function sendApplicationReceivedEmail(email: string, name: string) {
  try {
    const subject = 'We\'ve Received Your Sharing Minds Application!';
    const html = `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0056b3;">Thank You for Applying to Sharing Minds!</h2>
          <p>Hi ${name},</p>
          <p>We\'re thrilled you want to join our community of mentors. This email confirms we\'ve successfully received your application.</p>
          <p>Our team will carefully review your profile. We\'ll get back to you within <strong>5-7 business days</strong> with the next steps.</p>
          <p>In the meantime, feel free to explore our website and learn more about our mission.</p>
          <p>Best regards,</p>
          <p><strong>The Sharing Minds Team</strong></p>
        </div>
      `;

    await sendEmail({ to: email, subject, html });

    return { success: true, message: 'Application received email sent successfully' };
  } catch (error) {
    console.error('Error sending application received email:', error);
    return { success: false, error: 'Failed to send application received email' };
  }
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export async function sendContactSubmissionEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>');

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #0f172a;">
        <h2 style="color: #4f46e5; margin-bottom: 12px;">New Contact Enquiry</h2>
        <p style="margin: 6px 0;"><strong>Name:</strong> ${safeName}</p>
        <p style="margin: 6px 0;"><strong>Email:</strong> ${safeEmail}</p>
        <p style="margin: 6px 0;"><strong>Subject:</strong> ${safeSubject}</p>
        <div style="margin-top: 16px; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
          <p style="margin: 0 0 8px 0; font-weight: 600;">Message</p>
          <p style="margin: 0; line-height: 1.6;">${safeMessage}</p>
        </div>
      </div>
    `;

    await sendEmail({
      to: 'community@sharingminds.in, support@sharingminds.in, abdur.rahman.shawl@gmail.com',
      subject: `New Contact Enquiry: ${safeSubject}`,
      html,
    });

    return { success: true, message: 'Contact enquiry email sent successfully' };
  } catch (error) {
    console.error('Error sending contact submission email:', error);
    return { success: false, error: 'Failed to send contact submission email' };
  }
}
