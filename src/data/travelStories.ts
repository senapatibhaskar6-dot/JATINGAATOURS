import { TravelStory } from '../types';
import { TOUR_PACKAGES } from './packages';

import meghalayaImg from '../assets/images/hero_jatingaa_landscape_1790299532077.jpg';
import ladakhImg from '../assets/images/tour_ladakh_himalayas_1790299546121.jpg';
import keralaImg from '../assets/images/tour_kerala_backwaters_1790299559090.jpg';
import rajasthanImg from '../assets/images/tour_rajasthan_heritage_1790299571893.jpg';
import vibrantImg from '../assets/images/hero_vibrant_landscape_1790322285172.jpg';

export const INITIAL_TRAVEL_STORIES: TravelStory[] = [
  {
    id: 'story-khasi-living-root-bridges',
    title: 'Walking on Living Wood: How Our Khasi Ancestors Engineered the Bridges of Meghalaya',
    subtitle: 'An insider field guide to the 250-year-old Ficus elastica bridges in Nongriat and how to walk them respectfully.',
    slug: 'walking-living-root-bridges-meghalaya',
    coverImage: meghalayaImg,
    galleryImages: [meghalayaImg, vibrantImg],
    region: 'northeast',
    regionLabel: 'Northeast India',
    destination: 'Nongriat, Sohra (Cherrapunji), Meghalaya',
    authorAgency: TOUR_PACKAGES[0].agency,
    authorRole: 'Native Khasi Elder & Conservation Guide',
    readTimeMinutes: 5,
    publishedDate: '2026-09-18',
    contentParagraphs: [
      'In our Khasi hills, when a river swells with ferocious monsoon rains, iron rusts and concrete collapses within a generation. Hundreds of years ago, our ancestors looked at the aerial roots of the rubber fig (Ficus elastica) growing along the river banks and realized something profound: what if the bridge was not built, but grown?',
      'By weaving young aerial roots through hollowed betel nut trunks directed across the gorge, each generation guides the living roots into the opposite bank’s soil. The roots graft onto each other, growing thicker and stronger with every passing decade. Today, the double-decker root bridge of Nongriat holds over fifty travelers at once and will endure for centuries.',
      'When you descend the 3,500 stone steps into Nongriat gorge, the forest envelopes you in mist, scent of wild cinnamon, and the thundering roar of Rainbow Falls. We ask our guests to walk softly, touch the roots with reverence, and never leave non-biodegradable plastics in the river basins.',
      'Our local cooperative ensures that 100% of village homestay fees go directly to the families providing the clean bed, hot bamboo-cooked supper, and natural spring water.'
    ],
    insiderTips: [
      'Start the 3,500-step descent before 7:30 AM to beat the humid afternoon heat and enjoy the emerald pools in solitude.',
      'Carry natural bamboo walking sticks (available from local village elders at the trailhead for ₹20) — they take 40% of the strain off your knees.',
      'Try the local organic Khasi wildflower honey and sweet pineapples sold by mothers along the river trail.'
    ],
    culturalEtiquette: [
      'Never carve initials or scratch the bark of living root bridges; they are sacred living structures cared for across clan generations.',
      'Seek permission before taking portraits of village elders weaving bamboo baskets.',
      'Wear modest trekking attire when entering the community village paths and homestays.'
    ],
    bestVisitingMonths: 'October through April (Crystal clear natural pools and pleasant hiking)',
    associatedPackageId: 'pkg-meghalaya-cloud-valleys',
    tags: ['Root Bridges', 'Indigenous Engineering', 'Meghalaya', 'Eco-Trek', 'Homestays'],
    moderationStatus: 'published',
    likesCount: 142,
  },
  {
    id: 'story-ladakh-winter-monasteries',
    title: 'Chants in the Snow: Monastic Life and High Passes in Ladakh',
    subtitle: 'Beyond peak summer tourism lies the true spiritual silence of ancient Indus valley Gompas.',
    slug: 'chants-snow-monastic-life-ladakh',
    coverImage: ladakhImg,
    galleryImages: [ladakhImg],
    region: 'himalayas',
    regionLabel: 'Himalayan Frontier',
    destination: 'Thiksey, Hemis & Zanskar Valley, Ladakh',
    authorAgency: TOUR_PACKAGES[1].agency,
    authorRole: 'High Altitude Mountaineer & Ladakhi Native Guide',
    readTimeMinutes: 6,
    publishedDate: '2026-09-12',
    contentParagraphs: [
      'Most visitors know Ladakh only through sunny postcards of Pangong Tso in July. But as native Ladakhi guides who grew up in the shadow of the Stok mountain range, our favorite season is the quiet shoulder months when the high-altitude air turns crystalline and monastery courtyards echo with sacred deep-throated chants.',
      'At 5:30 AM in Thiksey Gompa, the novice monks sound the copper conch horns across the frozen valley. Steam rises from copper bowls of salty butter tea (Gur-Gur Chai). Sitting quietly beside the red-robed monks during morning prayers provides a level of peace that city dwellers rarely get to experience.',
      'Crossing Khardung La and Chang La requires patience and genuine respect for high altitude. We always insist on 48 hours of strict rest in Leh before attempting 17,000-foot passes, and we travel with medical-grade pulse oximeters and oxygen cylinders.',
      'Through our direct local guide model, travelers support local Changpa nomadic families who supply authentic wool and dairy, rather than commercial middlemen.'
    ],
    insiderTips: [
      'Drink 3 to 4 liters of warm water and garlic soup daily in Leh to speed up your body’s red blood cell production.',
      'Sit on the outer cushions in the prayer hall; remove footwear at the wooden threshold and step over (never on) the door sill.',
      'Visit the Hemis museum early morning to see 8th-century silk thangkas before tour buses arrive.'
    ],
    culturalEtiquette: [
      'Always walk around stupas (chortens) and mani stone walls in a clockwise direction.',
      'Never take flash photographs inside prayer halls or point your feet toward Buddha idols or lamas.',
      'Dress warmly in non-rustling layers during ceremonies to avoid breaking meditation silence.'
    ],
    bestVisitingMonths: 'May through October for road access; January/February for monastic Cham dance festivals',
    associatedPackageId: 'pkg-ladakh-monasteries-himalayas',
    tags: ['Ladakh', 'Monasteries', 'Buddhism', 'High Altitude', 'Zanskar'],
    moderationStatus: 'published',
    likesCount: 98,
  },
  {
    id: 'story-malabar-secret-canals',
    title: 'The Silent Waters: Exploring Munroe Island’s Hidden Canoe Waterways',
    subtitle: 'Leave motorized houseboats behind for hand-paddled canoes through canopy-covered coir-spinning canals.',
    slug: 'silent-waters-munroe-island-canals',
    coverImage: keralaImg,
    galleryImages: [keralaImg],
    region: 'south',
    regionLabel: 'South India',
    destination: 'Munroe Island & Ashtamudi Lake, Kerala',
    authorAgency: TOUR_PACKAGES[2].agency,
    authorRole: 'Malabar Native Naturalist & Kayak Instructor',
    readTimeMinutes: 4,
    publishedDate: '2026-09-05',
    contentParagraphs: [
      'Large diesel houseboats often churn the mud and disturb the delicate estuarine ecosystems of Vembanad. Ten years ago, our collective decided to offer an authentic alternative: small wooden canoes propelled only by hand bamboo poles through the narrow palm canals of Munroe Island.',
      'In these narrow waterways, low branches of mangrove trees touch your hair as Kingfishers and Brahminy kites swoop past. You glide past the front porches of village homes where grandmothers spin golden coir fiber from coconut husks using antique wooden wheels.',
      'You are invited to join an authentic sadya meal served fresh on banana leaves with pearl spot fish (Karimeen Pollichathu) roasted in fragrant coconut leaves and spices crushed on stone rollers that morning.',
      'Because travelers book directly through Jatingaa Tours, our canoe boatmen earn fair wages 3x higher than what large online booking aggregators previously paid.'
    ],
    insiderTips: [
      'Take the sunrise canoe at 6:00 AM when the water is mirror-flat and dawn mist rises between coconut groves.',
      'Ask the boatman to stop at the toddy tapper’s hut to taste fresh, unfermented sweet neera directly from coconut blossoms.',
      'Bring binoculars for birding — over 40 species of wetland birds nest in the mangrove shallows.'
    ],
    culturalEtiquette: [
      'Greet canal-side residents with a warm "Namaskaram" and a smile; they welcome respectful visitors warmly.',
      'Avoid dipping sunscreen-coated hands into fish-nursery mangrove roots.',
      'Do not throw plastic trash or bottles into waterways; take everything back to the mainland.'
    ],
    bestVisitingMonths: 'September to March for lush weather; June to August for serene monsoon reflections',
    associatedPackageId: 'pkg-kerala-backwaters-canals',
    tags: ['Kerala', 'Backwaters', 'Canoeing', 'Munroe Island', 'Sustainable Travel'],
    moderationStatus: 'published',
    likesCount: 115,
  },
  {
    id: 'story-thar-desert-stargazing',
    title: 'Night Sky Over Khuri: Stargazing in the Remote Sand Dunes of Marwar',
    subtitle: 'Why deep dune camping with native desert camel herders beats commercial tent cities.',
    slug: 'night-sky-khuri-sand-dunes-marwar',
    coverImage: rajasthanImg,
    galleryImages: [rajasthanImg],
    region: 'west',
    regionLabel: 'Western Deserts',
    destination: 'Khuri Dunes, Jaisalmer, Rajasthan',
    authorAgency: TOUR_PACKAGES[3].agency,
    authorRole: 'Native Marwari Desert Guide & Folk Musician',
    readTimeMinutes: 5,
    publishedDate: '2026-08-28',
    contentParagraphs: [
      'Thirty kilometers past the noisy tourist camps of Sam lies the quiet village of Khuri. Here, the sand waves shift gently with the desert wind, and no electric generators disturb the desert silence.',
      'We bring our guests out on camels led by local herders whose families have traversed these dunes for eight hundred years. As the golden desert sun sinks beneath the horizon turning the sand crimson, we light a small dry-wood fire and prepare hot bajre ki roti (millet flatbread) over cow-dung embers with spicy garlic chutney.',
      'When night falls, there is zero light pollution. The Milky Way arches from horizon to horizon, so bright that you can see your shadow on the white sand. We sit with local Manganiyar folk musicians who sing centuries-old songs of rainfall and star navigation with the kamaicha instrument.',
      'Our guests sleep on traditional charpai cots directly under the open sky, wrapped in warm handmade camel-wool quilts.'
    ],
    insiderTips: [
      'Temperatures in the Thar desert drop rapidly after dark — bring a windbreaker jacket even in October.',
      'Wake up 20 minutes before sunrise to see desert foxes and larks foraging on the cool sand ridges.',
      'Ask your guide to point out the navigational constellations used by desert caravans.'
    ],
    culturalEtiquette: [
      'Treat the camels with gentleness; they are essential family companions in the desert.',
      'Refrain from loud bluetooth speakers; the desert’s true magic is its absolute natural stillness.',
      'Tip your camel driver and folk musicians directly in cash.'
    ],
    bestVisitingMonths: 'October to March (Pleasant sunny days and cool starlit nights)',
    associatedPackageId: 'pkg-rajasthan-desert-nomad',
    tags: ['Thar Desert', 'Jaisalmer', 'Stargazing', 'Folk Music', 'Camping'],
    moderationStatus: 'published',
    likesCount: 87,
  }
];
