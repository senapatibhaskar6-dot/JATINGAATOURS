export interface GuideProfile {
  id: string;
  name: string;
  licenseNo: string;
  region: string;
  state: string;
  agencyAffiliation: string;
  agencyId: string;
  experienceYears: number;
  phone: string;
  whatsapp: string;
  languages: string[];
  specialty: string;
  rating: number;
  totalExpeditions: number;
  status: 'active' | 'on_expedition' | 'available';
  avatarInitials: string;
  verifiedSince: string;
  emergencyCertified: boolean;
}

export const INITIAL_GUIDES_DATA: GuideProfile[] = [
  {
    id: 'gd-01',
    name: 'Bapman Nongrum',
    licenseNo: 'MEGH-TOU-GD-2018-044',
    region: 'East Khasi Hills & Nongriat',
    state: 'Meghalaya',
    agencyAffiliation: 'Sohra Living Root Co-Op',
    agencyId: 'agency-01',
    experienceYears: 11,
    phone: '+91 94361 77201',
    whatsapp: '+91 94361 77201',
    languages: ['Khasi', 'English', 'Assamese', 'Hindi'],
    specialty: 'Living Root Bridges & Deep Rainforest Bio-navigation',
    rating: 4.96,
    totalExpeditions: 342,
    status: 'available',
    avatarInitials: 'BN',
    verifiedSince: '2019',
    emergencyCertified: true,
  },
  {
    id: 'gd-02',
    name: 'Deben Bora',
    licenseNo: 'ASM-WLD-NAT-2015-882',
    region: 'Kaziranga National Park & Majuli',
    state: 'Assam',
    agencyAffiliation: 'Brahmaputra Heritage Expeditions',
    agencyId: 'agency-02',
    experienceYears: 14,
    phone: '+91 94350 44109',
    whatsapp: '+91 94350 44109',
    languages: ['Assamese', 'Bengali', 'Hindi', 'English'],
    specialty: 'One-Horned Rhino Habitat Tracker & Riverine Ecology Naturalist',
    rating: 4.98,
    totalExpeditions: 410,
    status: 'active',
    avatarInitials: 'DB',
    verifiedSince: '2017',
    emergencyCertified: true,
  },
  {
    id: 'gd-03',
    name: 'Tundup Dorje',
    licenseNo: 'LAD-MNT-EXP-2016-102',
    region: 'Zanskar Valley & Hemis Monasteries',
    state: 'Ladakh',
    agencyAffiliation: 'Zanskar Nomad Mountain Guides',
    agencyId: 'agency-03',
    experienceYears: 12,
    phone: '+91 94191 88312',
    whatsapp: '+91 94191 88312',
    languages: ['Ladakhi', 'Tibetan', 'Hindi', 'English'],
    specialty: 'High-Altitude Pass Crossing & Monastic Buddhist History',
    rating: 4.97,
    totalExpeditions: 288,
    status: 'available',
    avatarInitials: 'TD',
    verifiedSince: '2018',
    emergencyCertified: true,
  },
  {
    id: 'gd-04',
    name: 'Mebanshan Lyngdoh',
    licenseNo: 'MEGH-CAV-GD-2020-119',
    region: 'Mawsmai & Krem Liat Prah Caves',
    state: 'Meghalaya',
    agencyAffiliation: 'Sohra Living Root Co-Op',
    agencyId: 'agency-01',
    experienceYears: 7,
    phone: '+91 98560 33281',
    whatsapp: '+91 98560 33281',
    languages: ['Khasi', 'English', 'Hindi'],
    specialty: 'Speleology & Limestone Subterranean Cave Exploration',
    rating: 4.92,
    totalExpeditions: 174,
    status: 'available',
    avatarInitials: 'ML',
    verifiedSince: '2021',
    emergencyCertified: true,
  },
  {
    id: 'gd-05',
    name: 'Karma Tsering Wangdi',
    licenseNo: 'ARU-TAW-TRK-2017-093',
    region: 'Tawang & Sela Pass High Himalayas',
    state: 'Arunachal Pradesh',
    agencyAffiliation: 'Monpa Himalayan Trails',
    agencyId: 'agency-05',
    experienceYears: 9,
    phone: '+91 94360 88204',
    whatsapp: '+91 94360 88204',
    languages: ['Monpa', 'Hindi', 'English', 'Assamese'],
    specialty: 'Monpa Tribal Culture, Glacier Lakes & High Altitude Trekking',
    rating: 4.95,
    totalExpeditions: 215,
    status: 'on_expedition',
    avatarInitials: 'KW',
    verifiedSince: '2020',
    emergencyCertified: true,
  },
  {
    id: 'gd-06',
    name: 'Pranab Saikia',
    licenseNo: 'ASM-TOU-CUL-2016-521',
    region: 'Majuli Island & Neo-Vaishnavite Satras',
    state: 'Assam',
    agencyAffiliation: 'Majuli Riverine Eco-Village Collective',
    agencyId: 'agency-06',
    experienceYears: 13,
    phone: '+91 98640 11928',
    whatsapp: '+91 98640 11928',
    languages: ['Assamese', 'English', 'Hindi'],
    specialty: 'Traditional Mask Making, Sattriya Dance Heritage & Birdwatching',
    rating: 4.94,
    totalExpeditions: 360,
    status: 'available',
    avatarInitials: 'PS',
    verifiedSince: '2017',
    emergencyCertified: false,
  },
  {
    id: 'gd-07',
    name: 'Rawat Singh Bhati',
    licenseNo: 'RAJ-DES-SAF-2014-411',
    region: 'Jaisalmer & Thar Desert Dunes',
    state: 'Rajasthan',
    agencyAffiliation: 'Marwar Heritage Caravans',
    agencyId: 'agency-07',
    experienceYears: 15,
    phone: '+91 98290 55412',
    whatsapp: '+91 98290 55412',
    languages: ['Marwari', 'Hindi', 'English'],
    specialty: 'Desert Camel Caravan Navigation & Stargazing Astronomy',
    rating: 4.93,
    totalExpeditions: 490,
    status: 'available',
    avatarInitials: 'RS',
    verifiedSince: '2016',
    emergencyCertified: true,
  },
  {
    id: 'gd-08',
    name: 'Unnikrishnan Nair',
    licenseNo: 'KER-WND-TRK-2018-302',
    region: 'Wayanad Western Ghats & Chembra Peak',
    state: 'Kerala',
    agencyAffiliation: 'Sahyadri Rainforest Expeditions',
    agencyId: 'agency-08',
    experienceYears: 10,
    phone: '+91 94471 22904',
    whatsapp: '+91 94471 22904',
    languages: ['Malayalam', 'Tamil', 'English', 'Hindi'],
    specialty: 'Endemic Spice Forest Botany & Shola Grassland Ecology',
    rating: 4.96,
    totalExpeditions: 265,
    status: 'active',
    avatarInitials: 'UN',
    verifiedSince: '2019',
    emergencyCertified: true,
  },
];

const GUIDES_STORAGE_KEY = 'jatingaa_guides_directory_v1';

export function getPlatformGuides(): GuideProfile[] {
  try {
    const raw = localStorage.getItem(GUIDES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to load guides from storage:', err);
  }
  return INITIAL_GUIDES_DATA;
}

export function savePlatformGuides(guides: GuideProfile[]) {
  try {
    localStorage.setItem(GUIDES_STORAGE_KEY, JSON.stringify(guides));
  } catch (err) {
    console.warn('Failed to save guides to storage:', err);
  }
}
