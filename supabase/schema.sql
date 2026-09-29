-- ============================================================================
-- JATINGAA TOURS B2B TOURISM OPERATOR NETWORK - SUPABASE / POSTGRESQL SCHEMA
-- ============================================================================
-- Production Schema for Multi-Tenant Travel Agency Collaboration,
-- Inventory Slot Blocking, Tiered Wholesale Pricing & Ledger Integration.
-- ============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. ENUMS & DOMAINS
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE agency_verification_status AS ENUM ('pending', 'verified', 'suspended');
    CREATE TYPE b2b_partner_tier AS ENUM ('Silver', 'Gold', 'Platinum');
    CREATE TYPE operator_category AS ENUM ('DMC', 'Inbound Agency', 'Travel Agent', 'Cooperative Society', 'Homestay Cluster');
    CREATE TYPE hold_status AS ENUM ('active', 'expired', 'converted', 'released');
    CREATE TYPE ledger_transaction_type AS ENUM ('advance_payment', 'slot_hold_deposit', 'booking_payout', 'commission_credit', 'refund');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 3. B2B AGENCIES & VERIFICATION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.b2b_agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_name TEXT NOT NULL,
    trade_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    designation TEXT DEFAULT 'Director',
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    gstin TEXT NOT NULL,
    pan_number TEXT NOT NULL,
    msme_reg_no TEXT,
    tourism_license_no TEXT NOT NULL,
    state TEXT NOT NULL,
    city TEXT NOT NULL,
    office_address TEXT,
    operator_type operator_category DEFAULT 'DMC',
    tier b2b_partner_tier DEFAULT 'Gold',
    wholesale_margin_percent NUMERIC(5,2) DEFAULT 18.00,
    status agency_verification_status DEFAULT 'pending',
    verification_notes TEXT,
    approved_at TIMESTAMPTZ,
    approved_by UUID, -- Ref to admin user
    wallet_balance NUMERIC(12,2) DEFAULT 0.00 CHECK (wallet_balance >= 0),
    credit_limit NUMERIC(12,2) DEFAULT 50000.00,
    custom_logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for agency lookup and verification filtering
CREATE INDEX IF NOT EXISTS idx_b2b_agencies_status ON public.b2b_agencies(status);
CREATE INDEX IF NOT EXISTS idx_b2b_agencies_tier ON public.b2b_agencies(tier);
CREATE INDEX IF NOT EXISTS idx_b2b_agencies_email ON public.b2b_agencies(email);

-- ============================================================================
-- 4. TOUR INVENTORY & DATE-BASED SLOTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.b2b_inventory_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id TEXT NOT NULL,
    package_title TEXT NOT NULL,
    departure_date DATE NOT NULL,
    max_batch_capacity INT NOT NULL DEFAULT 8,
    booked_seats INT NOT NULL DEFAULT 0,
    held_seats INT NOT NULL DEFAULT 0,
    retail_rate_per_person NUMERIC(10,2) NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'filling_fast', 'sold_out', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT chk_slot_capacity CHECK (booked_seats + held_seats <= max_batch_capacity)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_inventory_package_date ON public.b2b_inventory_slots(package_id, departure_date);

-- ============================================================================
-- 5. REAL-TIME INVENTORY SLOTS HOLD TABLE (TEMPORARY HOLD ENGINE)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.b2b_slot_holds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hold_code TEXT UNIQUE NOT NULL, -- e.g. "HOLD-2026-NE-8812"
    slot_id UUID REFERENCES public.b2b_inventory_slots(id) ON DELETE SET NULL,
    package_id TEXT NOT NULL,
    package_title TEXT NOT NULL,
    agency_id UUID NOT NULL REFERENCES public.b2b_agencies(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_contact TEXT NOT NULL,
    travel_date DATE NOT NULL,
    slots_held INT NOT NULL CHECK (slots_held > 0),
    retail_price_per_person NUMERIC(10,2) NOT NULL,
    wholesale_rate_per_person NUMERIC(10,2) NOT NULL,
    total_wholesale_net_cost NUMERIC(12,2) NOT NULL,
    deposit_paid NUMERIC(10,2) DEFAULT 0.00,
    razorpay_deposit_payment_id TEXT,
    held_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL, -- Calculated as NOW() + INTERVAL '24 hours' or '48 hours'
    status hold_status DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_b2b_holds_status_expiry ON public.b2b_slot_holds(status, expires_at);
CREATE INDEX IF NOT EXISTS idx_b2b_holds_agency ON public.b2b_slot_holds(agency_id);

-- ============================================================================
-- 6. CUSTOM BRANDED QUOTATIONS & ITINERARIES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.b2b_quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quotation_code TEXT UNIQUE NOT NULL, -- e.g. "QT-2026-NE-4491"
    agency_id UUID NOT NULL REFERENCES public.b2b_agencies(id) ON DELETE CASCADE,
    package_id TEXT NOT NULL,
    package_title TEXT NOT NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    travel_date DATE NOT NULL,
    travelers_count INT NOT NULL DEFAULT 1,
    wholesale_net_payable NUMERIC(12,2) NOT NULL,
    retail_quoted_price NUMERIC(12,2) NOT NULL,
    agency_markup_amount NUMERIC(12,2) NOT NULL,
    inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    exclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    day_itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
    custom_notes TEXT,
    valid_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_b2b_quotations_agency ON public.b2b_quotations(agency_id);

-- ============================================================================
-- 7. CONFIRMED B2B BOOKINGS TABLE (INTEGRATED WITH RAZORPAY)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.b2b_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT UNIQUE NOT NULL, -- e.g. "JT-2026-NORTHEAST-8821"
    agency_id UUID NOT NULL REFERENCES public.b2b_agencies(id) ON DELETE RESTRICT,
    package_id TEXT NOT NULL,
    package_title TEXT NOT NULL,
    travel_date DATE NOT NULL,
    travelers_count INT NOT NULL,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    total_retail_price NUMERIC(12,2) NOT NULL,
    wholesale_net_cost NUMERIC(12,2) NOT NULL,
    advance_paid NUMERIC(12,2) NOT NULL,
    arrival_balance_due NUMERIC(12,2) NOT NULL,
    payment_method TEXT NOT NULL,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT NOT NULL,
    razorpay_signature TEXT NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled')),
    booking_timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_b2b_bookings_agency ON public.b2b_bookings(agency_id);
CREATE INDEX IF NOT EXISTS idx_b2b_bookings_code ON public.b2b_bookings(booking_code);

-- ============================================================================
-- 8. DOUBLE-ENTRY FINANCIAL LEDGER TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.b2b_ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID NOT NULL REFERENCES public.b2b_agencies(id) ON DELETE CASCADE,
    entry_type ledger_transaction_type NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('credit', 'debit')),
    reference_id TEXT NOT NULL, -- e.g. bookingCode or holdCode
    description TEXT NOT NULL,
    balance_after NUMERIC(12,2) NOT NULL,
    razorpay_payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_b2b_ledger_agency ON public.b2b_ledger_entries(agency_id);

-- ============================================================================
-- 9. AUTOMATED CRON / FUNCTION: RELEASE EXPIRED INVENTORY HOLDS
-- ============================================================================
CREATE OR REPLACE FUNCTION public.release_expired_holds()
RETURNS INT AS $$
DECLARE
    released_count INT;
BEGIN
    UPDATE public.b2b_slot_holds
    SET status = 'expired', updated_at = NOW()
    WHERE status = 'active' AND expires_at < NOW();

    GET DIAGNOSTICS released_count = ROW_COUNT;
    RETURN released_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.b2b_agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_slot_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.b2b_ledger_entries ENABLE ROW LEVEL SECURITY;

-- Verified agencies can read and manage their own holds
CREATE POLICY "Agencies can read own holds"
    ON public.b2b_slot_holds
    FOR SELECT
    USING (auth.uid() = agency_id OR status = 'active');

CREATE POLICY "Agencies can create holds"
    ON public.b2b_slot_holds
    FOR INSERT
    WITH CHECK (auth.uid() = agency_id);

-- Agencies can read own quotations
CREATE POLICY "Agencies can manage own quotes"
    ON public.b2b_quotations
    FOR ALL
    USING (auth.uid() = agency_id);
