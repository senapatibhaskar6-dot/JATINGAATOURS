/**
 * Jatingaa Tours - Notifications, Messaging & Resend Email Service
 * 
 * Provides:
 * 1. WhatsApp click-to-chat URL generator with exact custom templates
 * 2. Resend email integration logic
 * 3. Supabase query helpers for agency and booking traveler notifications
 */

// Resend API endpoint (Works in Node.js, Vercel Serverless, and Supabase Edge Functions / Deno)
const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * Clean phone number into international format without symbols
 * E.g. "+91 98765-43210" -> "919876543210"
 */
export function formatPhoneForWhatsApp(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, '');
  // Default to India country code 91 if 10-digit mobile number provided
  if (digitsOnly.length === 10) {
    return `91${digitsOnly}`;
  }
  return digitsOnly;
}

/**
 * 1. Agency Registration Templates
 */
export function getAgencyWelcomeMessage(agencyName: string): string {
  return `Welcome to Jatingaa Tours, ${agencyName}! Your agency registration has been successfully completed. You can now connect directly with travelers from across world through our platform. Wishing you great success with your tours.`;
}

/**
 * Generates WhatsApp click-to-chat link for Agency Welcome Message
 */
export function generateAgencyWhatsAppLink(phone: string, agencyName: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const message = getAgencyWelcomeMessage(agencyName);
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * 2. Traveler Booking Confirmation Templates
 */
export function getTravelerConfirmationMessage(travelerName: string): string {
  return `Hello ${travelerName}, your booking with Jatingaa Tours is successfully confirmed! direct contact unlock feature to communicate seamlessly with verified local operators. Have a wonderful trip!`;
}

/**
 * Generates WhatsApp click-to-chat link for Traveler Booking Confirmation
 */
export function generateTravelerWhatsAppLink(phone: string, travelerName: string): string {
  const formattedPhone = formatPhoneForWhatsApp(phone);
  const message = getTravelerConfirmationMessage(travelerName);
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * 3. Send email using Resend API (Free tier: 3,000 emails/month, 100 emails/day)
 * Can be called from Vercel Serverless Function, Supabase Edge Function, or Node backend.
 */
export async function sendEmailViaResend({
  apiKey,
  fromEmail = 'Jatingaa Tours <onboarding@resend.dev>',
  toEmail,
  subject,
  textContent,
  htmlContent,
}: {
  apiKey: string;
  fromEmail?: string;
  toEmail: string;
  subject: string;
  textContent: string;
  htmlContent?: string;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: subject,
        text: textContent,
        html: htmlContent || `<div style="font-family: sans-serif; line-height: 1.6; color: #1c1917; padding: 20px;">
          <h2 style="color: #0b4619;">Jatingaa Tours</h2>
          <p style="font-size: 15px;">${textContent.replace(/\n/g, '<br/>')}</p>
          <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 20px 0;" />
          <p style="font-size: 12px; color: #78716c;">Jatingaa Tours — Empowering Local Tourism Across India</p>
        </div>`,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Failed to send email via Resend',
      };
    }

    return {
      success: true,
      data: result,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error while contacting Resend API',
    };
  }
}
