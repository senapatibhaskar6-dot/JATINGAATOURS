import { createClient } from '@supabase/supabase-js';

// Supabase credentials provided for Jatingaa Tours Platform
const SUPABASE_PROJECT_ID = 'dpjqthlfwpugymdkeyde';
const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;
const SUPABASE_ANON_KEY = 'sb_publishable_L9M39nkTPRLfweOyklSDyg_TWm28b-L';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export interface SupabaseAgencyRow {
  id?: string;
  agency_name: string;
  owner_name: string;
  phone: string;
  email: string;
  location: string;
  bank_details?: string | Record<string, unknown>;
  created_at?: string;
  // Optional extra columns that might be present or supported
  status?: string;
  license_number?: string;
  state?: string;
  city?: string;
  whatsapp?: string;
}

/**
 * Inserts a newly registered agency into Supabase 'agencies' table.
 * Strictly adheres to target columns:
 * - agency_name
 * - owner_name
 * - phone
 * - email
 * - location
 * - bank_details
 */
export async function insertAgencyToSupabase(data: {
  agencyName: string;
  ownerName: string;
  phone: string;
  email: string;
  location: string;
  bankDetails: {
    bankName?: string;
    bankAccountName?: string;
    bankAccountNumber?: string;
    bankIfsc?: string;
    upiId?: string;
    licenseNumber?: string;
    specialty?: string;
  };
}) {
  const payload: Record<string, unknown> = {
    agency_name: data.agencyName,
    owner_name: data.ownerName,
    phone: data.phone,
    email: data.email,
    location: data.location,
    // Bank details stored as formatted string or JSON to be robust across schema types
    bank_details: JSON.stringify(data.bankDetails),
  };

  try {
    const { data: result, error } = await supabase
      .from('agencies')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase insert warning/error:', error);
      // Attempt fallback with string bank_details if json/text requirement
      return { success: false, error, data: null };
    }

    return { success: true, error: null, data: result };
  } catch (err: any) {
    console.error('Failed to insert agency into Supabase:', err);
    return { success: false, error: err, data: null };
  }
}

/**
 * Fetches all registered agencies from Supabase 'agencies' table.
 */
export async function fetchAgenciesFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('agencies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error:', error);
      return { success: false, error, data: [] };
    }

    return { success: true, error: null, data: data || [] };
  } catch (err: any) {
    console.error('Failed to fetch agencies from Supabase:', err);
    return { success: false, error: err, data: [] };
  }
}

/**
 * Invokes the 'send-email-notification' Supabase Edge Function to send
 * the Welcome Email (via Resend API) and generate WhatsApp links.
 */
export async function triggerAgencyWelcomeEmail(agencyData: {
  agencyName: string;
  email: string;
  phone: string;
}) {
  try {
    const { data, error } = await supabase.functions.invoke('send-email-notification', {
      body: {
        type: 'agency',
        agencyName: agencyData.agencyName,
        agencyEmail: agencyData.email,
        agencyPhone: agencyData.phone,
      },
    });

    if (error) {
      console.warn('Supabase Edge Function invocation note:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Edge Function trigger caught error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Invokes the 'send-email-notification' Supabase Edge Function to send
 * the Booking Confirmation Email (via Resend API) to a traveler.
 */
export async function triggerBookingConfirmationEmail(bookingData: {
  travelerName: string;
  email: string;
  phone: string;
  bookingCode?: string;
}) {
  try {
    const { data, error } = await supabase.functions.invoke('send-email-notification', {
      body: {
        type: 'booking',
        travelerName: bookingData.travelerName,
        travelerEmail: bookingData.email,
        travelerPhone: bookingData.phone,
        bookingCode: bookingData.bookingCode,
      },
    });

    if (error) {
      console.warn('Supabase Edge Function invocation note:', error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Edge Function trigger caught error:', err);
    return { success: false, error: err.message };
  }
}

