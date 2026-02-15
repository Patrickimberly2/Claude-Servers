import { Resend } from 'resend';
import twilio from 'twilio';

export async function sendSms(to: string, body: string) {
  const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);
  return client.messages.create({
    from: process.env.TWILIO_FROM_NUMBER!,
    to,
    body,
  });
}

export async function sendEmail(to: string, body: string) {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: 'LeadPulse follow-up',
    text: body,
  });
}
