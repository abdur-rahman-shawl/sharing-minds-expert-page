
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

    return { success: true, message: 'Contact form email sent successfully' };
  } catch (error) {
    console.error('Error sending contact form email:', error);
    return { success: false, error: 'Failed to send contact form email' };
  }
}

// ============================================
// BOOKING EMAIL TEMPLATES
// ============================================

interface BookingEmailData {
  sessionId: string;
  sessionTitle: string;
  scheduledAt: Date;
  duration: number;
  meetingType: 'video' | 'audio' | 'chat';
}

/**
 * Format date for email display
 */
function formatEmailDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatEmailTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Email 1: Booking Confirmed (to Mentee)
 * Sent after successful payment
 */
export async function sendBookingConfirmedEmail(
  menteeEmail: string,
  menteeName: string,
  mentorName: string,
  booking: BookingEmailData
) {
  try {
    const subject = `Your Session with ${mentorName} is Confirmed!`;
    const scheduledDate = new Date(booking.scheduledAt);

    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px;">
        <h2 style="color: #0056b3;">🎉 Session Confirmed!</h2>
        <p>Hi ${menteeName},</p>
        <p>Great news! Your session has been successfully booked.</p>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px 0; color: #1e293b;">${booking.sessionTitle}</h3>
          <p style="margin: 6px 0;"><strong>Mentor:</strong> ${mentorName}</p>
          <p style="margin: 6px 0;"><strong>Date:</strong> ${formatEmailDate(scheduledDate)}</p>
          <p style="margin: 6px 0;"><strong>Time:</strong> ${formatEmailTime(scheduledDate)}</p>
          <p style="margin: 6px 0;"><strong>Duration:</strong> ${booking.duration} minutes</p>
          <p style="margin: 6px 0;"><strong>Meeting Type:</strong> ${booking.meetingType.charAt(0).toUpperCase() + booking.meetingType.slice(1)} Call</p>
        </div>
        
        <p>You can join the session from your dashboard when it's time.</p>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?section=sessions" style="display: inline-block; background-color: #0056b3; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px;">View Session Details</a>
        
        <p style="margin-top: 20px;">Best regards,</p>
        <p><strong>The SharingMinds Team</strong></p>
      </div>
    `;

    await sendEmail({
      to: menteeEmail,
      subject,
      html,
    });

    return { success: true, message: 'Booking confirmation email sent' };
  } catch (error) {
    console.error('Error sending booking confirmed email:', error);
    return { success: false, error: 'Failed to send booking confirmation email' };
  }
}

/**
 * Email 2: New Booking Alert (to Mentor)
 * Sent when a mentee books a session
 */
export async function sendNewBookingAlertEmail(
  mentorEmail: string,
  mentorName: string,
  menteeName: string,
  booking: BookingEmailData
) {
  try {
    const subject = `New Session Booked: ${booking.sessionTitle}`;
    const scheduledDate = new Date(booking.scheduledAt);

    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px;">
        <h2 style="color: #0056b3;">📅 New Session Booked!</h2>
        <p>Hi ${mentorName},</p>
        <p>A mentee has just booked a session with you.</p>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px 0; color: #1e293b;">${booking.sessionTitle}</h3>
          <p style="margin: 6px 0;"><strong>Mentee:</strong> ${menteeName}</p>
          <p style="margin: 6px 0;"><strong>Date:</strong> ${formatEmailDate(scheduledDate)}</p>
          <p style="margin: 6px 0;"><strong>Time:</strong> ${formatEmailTime(scheduledDate)}</p>
          <p style="margin: 6px 0;"><strong>Duration:</strong> ${booking.duration} minutes</p>
          <p style="margin: 6px 0;"><strong>Meeting Type:</strong> ${booking.meetingType.charAt(0).toUpperCase() + booking.meetingType.slice(1)} Call</p>
        </div>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?section=schedule" style="display: inline-block; background-color: #0056b3; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 55px; margin-top: 10px;">View Your Schedule</a>
        
        <p style="margin-top: 20px;">Best regards,</p>
        <p><strong>The SharingMinds Team</strong></p>
      </div>
    `;

    await sendEmail({
      to: mentorEmail,
      subject,
      html,
    });

    return { success: true, message: 'New booking alert email sent' };
  } catch (error) {
    console.error('Error sending new booking alert email:', error);
    return { success: false, error: 'Failed to send new booking alert email' };
  }
}
