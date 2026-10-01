// Supabase Edge Function: send-email-notification
// Location: supabase/functions/send-email-notification/index.ts
// Runtime: Deno (Supabase Edge Runtime)

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Standard CORS headers for cross-origin web app requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface WebhookOrDirectPayload {
  // Direct invocation properties
  type?: 'agency' | 'booking' | 'agency_registered' | 'booking_confirmed';
  record?: Record<string, any>;
  agencyName?: string;
  agencyEmail?: string;
  agencyPhone?: string;
  travelerName?: string;
  travelerEmail?: string;
  travelerPhone?: string;
  bookingCode?: string;

  // Supabase Database Webhook standard payload properties
  event?: 'INSERT' | 'UPDATE' | 'DELETE';
  table?: string;
  schema?: string;
  old_record?: Record<string, any>;
}

/**
 * Format phone number into clean WhatsApp international digits
 * E.g., "+91 98765-43210" -> "919876543210"
 */
function formatWhatsAppNumber(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'Missing RESEND_API_KEY in Supabase environment secrets. Please set it using: supabase secrets set RESEND_API_KEY=re_...',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const payload: WebhookOrDirectPayload = await req.json();

    let notificationType: 'agency' | 'booking' | null = null;
    let recipientEmail = '';
    let recipientName = '';
    let recipientPhone = '';
    let subject = '';
    let messageText = '';
    let whatsappLink = '';

    // -------------------------------------------------------------
    // 1. Detect if this is a Supabase Database Webhook (INSERT on agencies/bookings)
    // -------------------------------------------------------------
    if (payload.table && payload.record) {
      const rec = payload.record;
      if (payload.table === 'agencies' || payload.table === 'b2b_agencies') {
        notificationType = 'agency';
        recipientName = rec.agency_name || rec.name || 'Partner Agency';
        recipientEmail = rec.email || '';
        recipientPhone = rec.phone || rec.whatsapp || '';
      } else if (payload.table === 'bookings' || payload.table === 'b2b_bookings') {
        notificationType = 'booking';
        recipientName = rec.customer_name || rec.client_name || 'Traveler';
        recipientEmail = rec.customer_email || rec.client_email || '';
        recipientPhone = rec.customer_phone || rec.client_phone || '';
      }
    }

    // -------------------------------------------------------------
    // 2. Direct Invocation Handling
    // -------------------------------------------------------------
    if (!notificationType) {
      const explicitType = (payload.type || '').toLowerCase();
      if (explicitType === 'agency' || explicitType === 'agency_registered') {
        notificationType = 'agency';
        const rec = payload.record || {};
        recipientName = payload.agencyName || rec.agency_name || rec.name || 'Partner Agency';
        recipientEmail = payload.agencyEmail || rec.email || '';
        recipientPhone = payload.agencyPhone || rec.phone || rec.whatsapp || '';
      } else if (explicitType === 'booking' || explicitType === 'booking_confirmed') {
        notificationType = 'booking';
        const rec = payload.record || {};
        recipientName = payload.travelerName || rec.customer_name || rec.client_name || 'Traveler';
        recipientEmail = payload.travelerEmail || rec.customer_email || rec.client_email || '';
        recipientPhone = payload.travelerPhone || rec.customer_phone || rec.client_phone || '';
      }
    }

    if (!notificationType) {
      return new Response(
        JSON.stringify({
          error: 'Invalid notification type. Must be "agency" or "booking", or triggered via Database Webhook on agencies/bookings table.',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({
          error: 'Recipient email is missing from the record/payload.',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // -------------------------------------------------------------
    // 3. Format Exact Templates & WhatsApp Click-to-Chat Link
    // -------------------------------------------------------------
    if (notificationType === 'agency') {
      subject = `Welcome to Jatingaa Tours, ${recipientName}!`;
      // Exact Template 1:
      messageText = `Welcome to Jatingaa Tours, ${recipientName}! Your agency registration has been successfully completed. You can now connect directly with travelers from across world through our platform. Wishing you great success with your tours.`;
      
      const waNumber = formatWhatsAppNumber(recipientPhone);
      whatsappLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(messageText)}`;
    } else {
      subject = `Booking Confirmed - Jatingaa Tours`;
      // Exact Template 2:
      messageText = `Hello ${recipientName}, your booking with Jatingaa Tours is successfully confirmed! direct contact unlock feature to communicate seamlessly with verified local operators. Have a wonderful trip!`;
      
      const waNumber = formatWhatsAppNumber(recipientPhone);
      whatsappLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(messageText)}`;
    }

    // -------------------------------------------------------------
    // 4. Send Email via Resend API
    // -------------------------------------------------------------
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Jatingaa Tours <onboarding@resend.dev>', // Replace with your domain once verified on Resend
        to: [recipientEmail],
        subject: subject,
        text: messageText,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1c1917; background-color: #ffffff; border: 1px solid #e7e5e4; border-radius: 12px;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              <h2 style="color: #0b4619; margin: 0; font-size: 22px;">Jatingaa Tours</h2>
            </div>
            <p style="font-size: 15px; line-height: 1.6; color: #292524;">${messageText}</p>
            
            ${
              recipientPhone
                ? `
            <div style="margin: 24px 0;">
              <a href="${whatsappLink}" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-size: 13px; font-weight: bold;">
                Open in WhatsApp Click-to-Chat
              </a>
            </div>`
                : ''
            }

            <hr style="border: none; border-top: 1px solid #f5f5f4; margin: 24px 0;" />
            <p style="font-size: 12px; color: #a8a29e; margin: 0;">
              Jatingaa Tours — Empowering Local Tour Operators & Authentic Travel Experiences Across India
            </p>
          </div>
        `,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData);
      return new Response(
        JSON.stringify({
          success: false,
          error: resendData.message || 'Failed to dispatch email via Resend API',
          resendData,
          whatsappLink,
        }),
        {
          status: resendResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        type: notificationType,
        recipientEmail,
        recipientName,
        resendMessageId: resendData.id,
        whatsappLink,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: any) {
    console.error('Edge Function execution exception:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Internal Edge Function Error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
