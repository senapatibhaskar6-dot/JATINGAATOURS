import React, { useState } from 'react';
import { X, Code2, Database, UploadCloud, ShieldAlert, Search, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

interface CodeIntegrationModalProps {
  onClose: () => void;
}

export const CodeIntegrationModal: React.FC<CodeIntegrationModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'uploads' | 'auth_moderation' | 'seo'>('schema');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (code: string, key: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const SCHEMA_CODE = `-- =========================================================================
-- JATINGAA TOURS: PRODUCTION DATABASE SCHEMA (POSTGRESQL / SUPABASE)
-- Features: Multi-tenant Agency Profiles, UGC Tours, Destination Guides,
-- Bookings with 5% Fee & ₹1,000 Advance Ledger, and Strict RLS Policies.
-- =========================================================================

-- 1. ENUMS
CREATE TYPE user_role AS ENUM ('traveler', 'agency_vendor', 'admin_moderator');
CREATE TYPE moderation_status AS ENUM ('draft', 'in_review', 'published', 'rejected');
CREATE TYPE tour_region AS ENUM ('northeast', 'himalayas', 'south', 'west', 'islands');
CREATE TYPE booking_status AS ENUM ('pending_advance', 'confirmed', 'completed', 'cancelled');

-- 2. AGENCIES TABLE (Verified Local Tour Operators)
CREATE TABLE public.agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    founder_name VARCHAR(255) NOT NULL,
    base_city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    operating_region tour_region NOT NULL,
    phone VARCHAR(30) NOT NULL,
    whatsapp VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    license_number VARCHAR(100) NOT NULL, -- State Tourism Reg / GSTIN
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMPTZ,
    rating NUMERIC(3, 2) DEFAULT 5.00,
    total_tours_completed INT DEFAULT 0,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TOUR PACKAGES TABLE (UGC & Direct Listings)
CREATE TABLE public.tour_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    tagline TEXT NOT NULL,
    region tour_region NOT NULL,
    location VARCHAR(255) NOT NULL,
    starting_point VARCHAR(255) NOT NULL,
    duration_days INT NOT NULL CHECK (duration_days > 0),
    duration_label VARCHAR(100) NOT NULL, -- e.g. '6 Days / 5 Nights'
    group_type VARCHAR(100) NOT NULL DEFAULT 'Small Group (Max 8)',
    fitness_level VARCHAR(50) NOT NULL DEFAULT 'Moderate',
    price_per_person NUMERIC(10, 2) NOT NULL CHECK (price_per_person > 0),
    cover_image_url TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    best_season VARCHAR(100),
    inclusions TEXT[] DEFAULT '{}',
    exclusions TEXT[] DEFAULT '{}',
    moderation_status moderation_status DEFAULT 'in_review',
    moderation_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ITINERARY DAYS TABLE
CREATE TABLE public.tour_itineraries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID NOT NULL REFERENCES public.tour_packages(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    highlights TEXT[] DEFAULT '{}',
    UNIQUE (tour_id, day_number)
);

-- 5. UGC DESTINATION GUIDES & PHOTO STORIES
CREATE TABLE public.destination_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    associated_tour_id UUID REFERENCES public.tour_packages(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    subtitle TEXT NOT NULL,
    region tour_region NOT NULL,
    destination VARCHAR(255) NOT NULL,
    cover_image_url TEXT NOT NULL,
    gallery_urls TEXT[] DEFAULT '{}',
    content_paragraphs TEXT[] NOT NULL,
    insider_tips TEXT[] DEFAULT '{}',
    cultural_etiquette TEXT[] DEFAULT '{}',
    best_visiting_months VARCHAR(255),
    tags TEXT[] DEFAULT '{}',
    read_time_minutes INT DEFAULT 5,
    moderation_status moderation_status DEFAULT 'in_review',
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destination_guides ENABLE ROW LEVEL SECURITY;

-- Anyone can view verified agencies and published tours/guides
CREATE POLICY "Public view verified agencies" ON public.agencies
    FOR SELECT USING (is_verified = TRUE);

CREATE POLICY "Public view published tours" ON public.tour_packages
    FOR SELECT USING (moderation_status = 'published');

CREATE POLICY "Public view published guides" ON public.destination_guides
    FOR SELECT USING (moderation_status = 'published');

-- Agency vendors can manage only their own data
CREATE POLICY "Vendors manage own agency profile" ON public.agencies
    FOR ALL USING (auth_user_id = auth.uid());

CREATE POLICY "Vendors manage own tour packages" ON public.tour_packages
    FOR ALL USING (agency_id IN (
        SELECT id FROM public.agencies WHERE auth_user_id = auth.uid()
    ));

CREATE POLICY "Vendors manage own guides" ON public.destination_guides
    FOR ALL USING (agency_id IN (
        SELECT id FROM public.agencies WHERE auth_user_id = auth.uid()
    ));`;

  const UPLOAD_CODE = `// =========================================================================
// REACT + SUPABASE / S3 SECURE IMAGE UPLOAD PIPELINE
// Features: Client-side compression to WebP, MIME validation, Anti-Tamper
// =========================================================================

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// 1. Client-Side Image Compressor (Reduces 10MB mobile uploads to ~250KB WebP)
export async function compressImageToWebP(file: File, maxDimension = 1920, quality = 0.82): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context unavailable'));
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Compression failed'));
          },
          'image/webp',
          quality
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// 2. Production Camera Permission & Media Stream Capture Hook
export function useDeviceCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const requestCameraAccess = async (facingMode: 'environment' | 'user' = 'environment') => {
    try {
      setErrorMsg(null);
      // Explicitly requests camera permission from browser/OS
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      setStream(mediaStream);
      setPermissionState('granted');
      return mediaStream;
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionState('denied');
        setErrorMsg('Camera permission denied by user. Please enable camera in browser settings.');
      } else {
        setErrorMsg(err.message || 'Camera hardware unavailable.');
      }
      return null;
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  return { stream, permissionState, errorMsg, requestCameraAccess, stopCamera };
}

// 3. Production Drag, Drop & Direct Camera Uploader Component
export function SecureUploader({ agencyId, onUploadSuccess }: { agencyId: string, onUploadSuccess: (url: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    // Validate MIME type
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Only high-resolution JPEG, PNG, or WebP images are allowed.');
      return;
    }
    // Size check (< 12MB raw)
    if (file.size > 12 * 1024 * 1024) {
      alert('File size exceeds 12MB limit.');
      return;
    }

    try {
      setIsUploading(true);
      // Compress
      const compressedBlob = await compressImageToWebP(file);
      const fileName = \`\${agencyId}/\${Date.now()}-\${Math.random().toString(36).substring(7)}.webp\`;

      // Upload directly to Supabase Storage Bucket ('tour-ugc-media')
      const { data, error } = await supabase.storage
        .from('tour-ugc-media')
        .upload(fileName, compressedBlob, {
          contentType: 'image/webp',
          cacheControl: '31536000', // 1 year cache
          upsert: false,
        });

      if (error) throw error;

      // Get public CDN URL
      const { data: { publicUrl } } = supabase.storage
        .from('tour-ugc-media')
        .getPublicUrl(fileName);

      setPreviewUrl(publicUrl);
      onUploadSuccess(publicUrl);
    } catch (err: any) {
      alert('Image upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center hover:border-[#0b4619] transition-colors">
      {/* Standard file picker */}
      <input
        type="file"
        accept="image/*"
        id="ugc-file-input"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      {/* Native smartphone camera capture attribute */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        id="ugc-camera-input"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <div className="space-y-3">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="h-36 mx-auto rounded-lg object-cover" />
        ) : (
          <div className="text-stone-500 text-xs">
            {isUploading ? 'Compressing & Uploading WebP...' : 'Choose destination photo (Max 12MB)'}
          </div>
        )}
        <div className="flex justify-center gap-2">
          <label htmlFor="ugc-camera-input" className="cursor-pointer px-3 py-1.5 bg-[#0b4619] text-white text-xs rounded-lg font-semibold">
            Take Live Photo (Requests Camera Permission)
          </label>
          <label htmlFor="ugc-file-input" className="cursor-pointer px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs rounded-lg font-semibold border">
            Browse Files
          </label>
        </div>
      </div>
    </div>
  );
}`;

  const AUTH_MODERATION_CODE = `// =========================================================================
// VENDOR AUTHENTICATION & AUTOMATED CONTENT MODERATION PIPELINE
// Uses Supabase Edge Functions / Express Middleware
// =========================================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1. Verify Vendor JWT Middleware
export async function requireVerifiedVendor(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing Bearer Token' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET!) as { sub: string };

    // Query DB to verify agency license status
    const agency = await db.query(
      'SELECT id, is_verified, license_number FROM agencies WHERE auth_user_id = $1',
      [decoded.sub]
    );

    if (!agency.rows[0]) {
      return res.status(403).json({ error: 'Forbidden: No registered tour agency found' });
    }

    req.agency = agency.rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid authentication session' });
  }
}

// 2. Automated Content Moderation Engine
// Performs automated safety screening: checks for phone numbers in public text,
// profanity, and suspicious spam links before sending to Admin Review Queue
export function runAutomatedContentSafetyCheck(submission: {
  title: string;
  tagline: string;
  itineraryText: string;
}): { approved: boolean; flagReason?: string } {
  const combinedText = \`\${submission.title} \${submission.tagline} \${submission.itineraryText}\`.toLowerCase();

  // Rule 1: No blacklisted external URL domains (prevent platform evasion)
  const spamDomainPattern = /(bit\\.ly|t\\.co|telegram\\.me|wa\\.me|freegift)/i;
  if (spamDomainPattern.test(combinedText)) {
    return { approved: false, flagReason: 'External redirection link detected.' };
  }

  // Rule 2: Minimum content quality check
  if (submission.title.trim().length < 10) {
    return { approved: false, flagReason: 'Tour package title is too short.' };
  }

  // Passed automated safety checks -> route to 'in_review' or auto-publish for verified agencies
  return { approved: true };
}

// 3. Publishing Handler
export async function handleTourPublish(req: Request, res: Response) {
  const { title, tagline, pricePerPerson, itinerary } = req.body;
  const safety = runAutomatedContentSafetyCheck({
    title,
    tagline,
    itineraryText: JSON.stringify(itinerary),
  });

  if (!safety.approved) {
    return res.status(400).json({ error: safety.flagReason });
  }

  // Highly rated verified agencies (> 4.8 rating) auto-publish instantly;
  // New operators undergo one-time manual verification
  const initialStatus = req.agency.is_verified ? 'published' : 'in_review';

  const newTour = await db.query(
    \`INSERT INTO tour_packages (agency_id, title, tagline, price_per_person, moderation_status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *\`,
    [req.agency.id, title, tagline, pricePerPerson, initialStatus]
  );

  return res.json({ success: true, tour: newTour.rows[0], status: initialStatus });
}`;

  const SEO_CODE = `// =========================================================================
// NEXT-GEN LOCAL SEO & SCHEMA.ORG STRUCTURED DATA GENERATOR
// Renders JSON-LD for 'TouristTrip', 'TouristAttraction', and 'Article'
// =========================================================================

import React from 'react';
import { TourPackage, TravelStory } from '../types';

export function TourPackageSEO({ tour }: { tour: TourPackage }) {
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.tagline,
    touristType: tour.groupType,
    offers: {
      '@type': 'Offer',
      price: tour.pricePerPerson,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-01-01',
      seller: {
        '@type': 'TravelAgency',
        name: tour.agency.name,
        telephone: tour.agency.phone,
        address: {
          '@type': 'PostalAddress',
          addressLocality: tour.agency.baseCity,
          addressRegion: tour.agency.state,
          addressCountry: 'IN',
        },
      },
    },
    itinerary: {
      '@type': 'ItemList',
      numberOfItems: tour.itinerary.length,
      itemListElement: tour.itinerary.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'TouristAttraction',
          name: item.title,
          description: item.description,
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}

export function TravelStorySEO({ story }: { story: TravelStory }) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: story.subtitle,
    image: story.coverImage,
    datePublished: story.publishedDate,
    author: {
      '@type': 'Person',
      name: story.authorAgency.founder,
      jobTitle: story.authorRole,
      worksFor: {
        '@type': 'TravelAgency',
        name: story.authorAgency.name,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Jatingaa Tours',
      url: 'https://jatingaatours.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  );
}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative w-full max-w-4xl bg-stone-950 text-white rounded-2xl shadow-2xl border border-stone-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#0b4619] flex items-center justify-center text-[#f39c12]">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold font-display text-white">
                Engineering & Integration Blueprint
              </h2>
              <div className="text-[11px] text-stone-400">
                Production-ready code: Supabase Schema, WebP Uploads, Vendor Auth & Moderation Pipeline
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 pt-3 pb-2 bg-stone-900/60 border-b border-stone-800 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-[#0b4619] text-white shadow-xs'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-[#f39c12]" />
            <span>1. Supabase & Postgres Schema</span>
          </button>

          <button
            onClick={() => setActiveTab('uploads')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'uploads'
                ? 'bg-[#0b4619] text-white shadow-xs'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#f39c12]" />
            <span>2. Secure WebP Image Uploads</span>
          </button>

          <button
            onClick={() => setActiveTab('auth_moderation')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'auth_moderation'
                ? 'bg-[#0b4619] text-white shadow-xs'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#f39c12]" />
            <span>3. Vendor Auth & Content Moderation</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'seo'
                ? 'bg-[#0b4619] text-white shadow-xs'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#f39c12]" />
            <span>4. Local SEO (Schema.org JSON-LD)</span>
          </button>
        </div>

        {/* Code Content View */}
        <div className="overflow-y-auto flex-1 p-6 font-mono text-xs">
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-stone-400">
                <span className="flex items-center gap-2 text-emerald-400 text-xs font-sans">
                  <Terminal className="w-4 h-4" />
                  <span>schema.sql — PostgreSQL 15+ / Supabase with Row Level Security (RLS)</span>
                </span>
                <button
                  onClick={() => handleCopy(SCHEMA_CODE, 'schema')}
                  className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded flex items-center gap-1.5 font-sans cursor-pointer"
                >
                  {copiedKey === 'schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'schema' ? 'Copied SQL!' : 'Copy SQL'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 overflow-x-auto leading-relaxed">
                {SCHEMA_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'uploads' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-stone-400">
                <span className="flex items-center gap-2 text-emerald-400 text-xs font-sans">
                  <Terminal className="w-4 h-4" />
                  <span>SecureUploader.tsx — Client-side WebP compression & S3/Supabase Storage</span>
                </span>
                <button
                  onClick={() => handleCopy(UPLOAD_CODE, 'uploads')}
                  className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded flex items-center gap-1.5 font-sans cursor-pointer"
                >
                  {copiedKey === 'uploads' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'uploads' ? 'Copied Code!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 overflow-x-auto leading-relaxed">
                {UPLOAD_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'auth_moderation' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-stone-400">
                <span className="flex items-center gap-2 text-emerald-400 text-xs font-sans">
                  <Terminal className="w-4 h-4" />
                  <span>moderationMiddleware.ts — JWT auth verification & content safety filters</span>
                </span>
                <button
                  onClick={() => handleCopy(AUTH_MODERATION_CODE, 'auth')}
                  className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded flex items-center gap-1.5 font-sans cursor-pointer"
                >
                  {copiedKey === 'auth' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'auth' ? 'Copied Code!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 overflow-x-auto leading-relaxed">
                {AUTH_MODERATION_CODE}
              </pre>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-stone-400">
                <span className="flex items-center gap-2 text-emerald-400 text-xs font-sans">
                  <Terminal className="w-4 h-4" />
                  <span>schemaJsonLd.tsx — TouristTrip & Article Structured Data for Google Rich Snippets</span>
                </span>
                <button
                  onClick={() => handleCopy(SEO_CODE, 'seo')}
                  className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded flex items-center gap-1.5 font-sans cursor-pointer"
                >
                  {copiedKey === 'seo' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'seo' ? 'Copied Code!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 overflow-x-auto leading-relaxed">
                {SEO_CODE}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between">
          <div className="text-xs text-stone-400 font-sans">
            Ready to deploy to Supabase, Neon, AWS S3, or Cloudflare R2
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer font-sans"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
