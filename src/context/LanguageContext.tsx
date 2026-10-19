import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type LanguageCode = 'en' | 'as' | 'hi' | 'bn';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'as', label: 'Assamese', nativeName: 'অসমীয়া', flag: '🌿' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা', flag: '🌊' },
];

export interface Translations {
  [key: string]: {
    [lang in LanguageCode]: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Navigation
  'nav.tours': {
    en: 'Tour Packages',
    as: 'ট্যুৰ পেকেজ',
    hi: 'टूर पैकेज',
    bn: 'ট্যুর প্যাকেজ',
  },
  'nav.feeModel': {
    en: '5% Fair Model',
    as: '৫% ন্যায্য মাচুল নীতি',
    hi: '5% निष्पक्ष मॉडल',
    bn: '৫% ন্যায্য মডেল',
  },
  'nav.howItWorks': {
    en: 'How It Works',
    as: 'ই কেনেকৈ কাম কৰে',
    hi: 'यह कैसे काम करता है',
    bn: 'কীভাবে কাজ করে',
  },
  'nav.forAgencies': {
    en: 'For Travel Agencies',
    as: 'ভ্ৰমণ এজেন্সীৰ বাবে',
    hi: 'ट्रैवल एजेंसियों के लिए',
    bn: 'ট্রাভেল এজেন্সির জন্য',
  },
  'nav.aboutUs': {
    en: 'About Us',
    as: 'আমাৰ বিষয়ে',
    hi: 'हमारे बारे में',
    bn: 'আমাদের সম্পর্কে',
  },
  'nav.dashboard': {
    en: 'Dashboard',
    as: 'ডেচব\'ৰ্ড',
    hi: 'डैशबोर्ड',
    bn: 'ড্যাশবোর্ড',
  },
  'nav.dashboardFull': {
    en: 'Agencies & Guides Roster',
    as: 'এজেন্সী মালিক আৰু গাইড তালিকা',
    hi: 'एजेंसियां और गाइड सूची',
    bn: 'এজেন্সি ও গাইড তালিকা',
  },
  'nav.registerAgency': {
    en: 'Register Agency & Tour',
    as: 'পঞ্জীয়ন আৰু সা-সুবিধা ফৰ্ম',
    hi: 'एजेंसी व टूर पंजीकरण',
    bn: 'নিবন্ধন ও ট্যুর ফর্ম',
  },
  'nav.agencyPortal': {
    en: 'Agency Portal',
    as: 'এজেন্সী প\'ৰ্টেল',
    hi: 'एजेंसी पोर्टल',
    bn: 'এজেন্সি পোর্টাল',
  },
  'nav.myBookings': {
    en: 'My Bookings',
    as: 'মোৰ বুকিং',
    hi: 'मेरी बुकिंग्स',
    bn: 'আমার বুকিং',
  },
  'nav.whatsapp': {
    en: 'WhatsApp Chat',
    as: 'হোৱাটছএপ চাট',
    hi: 'व्हाट्सएप चैट',
    bn: 'হোয়াটসঅ্যাপ চ্যাট',
  },
  'nav.language': {
    en: 'Language',
    as: 'ভাষা',
    hi: 'भाषा',
    bn: 'ভাষা',
  },

  // Hero Section
  'hero.titlePrefix': {
    en: 'Explore India with',
    as: 'ভাৰতৰ অপৰূপ প্ৰকৃতি ভ্ৰমণ কৰক',
    hi: 'भारत का भ्रमण करें',
    bn: 'ভারতের অপরূপ রূপ ঘুরে দেখুন',
  },
  'hero.titleHighlight': {
    en: 'Local Guides & Agencies',
    as: 'থলুৱা গাইড আৰু এজেন্সীৰ সৈতে',
    hi: 'स्थानीय गाइड और एजेंसियों के साथ',
    bn: 'স্থানীয় গাইড ও এজেন্সির সাথে',
  },
  'hero.subtitle': {
    en: 'Book authentic tours directly from verified local agency owners and certified guides. 100% transparent pricing, zero OTA commissions, and guaranteed upfront advances.',
    as: 'চৰকাৰী অনুজ্ঞাপত্ৰপ্ৰাপ্ত থলুৱা এজেন্সী আৰু প্ৰমাণিত গাইডৰ সৈতে পোনপটীয়া যোগাযোগ। ০% মধ্যভোগী মাচুল, সম্পূৰ্ণ স্বচ্ছতা আৰু তাৎক্ষণিক অগ্ৰিমৰ নিশ্চয়তা।',
    hi: 'सत्यापित स्थानीय एजेंसी मालिकों और प्रमाणित गाइडों से सीधे टूर बुक करें। शून्य कमीशन, पारदर्शी मूल्य और अग्रिम भुगतान की गारंटी।',
    bn: 'যাচাইকৃত স্থানীয় এজেন্সি মালিক এবং প্রত্যয়িত গাইডদের সাথে সরাসরি ট্যুর বুক করুন। শূন্য কমিশন, সম্পূর্ণ স্বচ্ছতা এবং তাৎক্ষণিক অগ্রিমের নিশ্চয়তা।',
  },
  'hero.searchPlaceholder': {
    en: 'Search destination (Kaziranga, Meghalaya, Haflong, Ladakh)...',
    as: 'ভ্ৰমণৰ স্থান সন্ধান কৰক (কাজিৰঙা, মেঘালয়, হাফলং, লাডাখ)...',
    hi: 'गंतव्य खोजें (काजीरंगा, मेघालय, हाफलोंग, लद्दाख)...',
    bn: 'গন্তব্য অনুসন্ধান করুন (কাজিরাংগা, মেঘালয়, হাফলং, লাদাখ)...',
  },
  'hero.searchButton': {
    en: 'Search Tours',
    as: 'ট্যুৰ সন্ধান কৰক',
    hi: 'टूर खोजें',
    bn: 'ট্যুর খুঁজুন',
  },
  'hero.becomePartner': {
    en: 'Become a Partner',
    as: 'অংশীদাৰ হওক',
    hi: 'पार्टनर बनें',
    bn: 'অংশীদার হন',
  },
  'hero.dashboardButton': {
    en: '🏢 Agency & Guide Roster (Dashboard)',
    as: '🏢 এজেন্সী মালিক আৰু গাইড ৰ\'ষ্টাৰ (ডেচব\'ৰ্ড)',
    hi: '🏢 एजेंसी व गाइड सूची (डैशबोर्ड)',
    bn: '🏢 এজেন্সি ও গাইড রোস্টার (ড্যাশবোর্ড)',
  },
  'hero.registerPackageButton': {
    en: 'Register & Add Tour Package (₹5,000 Form)',
    as: 'পঞ্জীয়ন আৰু সা-সুবিধা ফৰ্ম (₹৫,০০০/জন)',
    hi: 'पंजीकरण व पैकेज फॉर्म (₹५,०००/व्यक्ति)',
    bn: 'নিবন্ধন ও সুবিধা ফর্ম (₹৫,০০০/জন)',
  },
  'hero.photoGallery': {
    en: 'Photo Gallery (8 Destinations)',
    as: 'ফটো গেলৰী (৮ খন ছবি)',
    hi: 'फोटो गैलरी (८ गंतव्य)',
    bn: 'ফটো গ্যালারি (৮টি গন্তব্য)',
  },

  // Package Filters & Grid
  'packages.title': {
    en: 'Curated Expeditions & Tour Packages',
    as: 'বিশিষ্ট ভ্ৰমণ আৰু ট্যুৰ পেকেজসমূহ',
    hi: 'विशेष यात्रा और टूर पैकेज',
    bn: 'নির্বাচিত ট্যুর ও ভ্রমণ প্যাকেজ',
  },
  'packages.subtitle': {
    en: 'Every tour includes accommodation, authentic meals, dedicated vehicle, and certified local guide service.',
    as: 'প্ৰতিটো ট্যুৰতে থকাৰ সু-ব্যৱস্থা, খাঁটি পৰম্পৰাগত আহাৰ, ব্যক্তিগত বাহন আৰু প্ৰমাণিত থলুৱা গাইড অন্তৰ্ভুক্ত।',
    hi: 'प्रत्येक टूर में आवास, पारंपरिक भोजन, निजी वाहन और प्रमाणित स्थानीय गाइड शामिल हैं।',
    bn: 'প্রতিটি ট্যুরে থাকার ব্যবস্থা, খাঁটি ঐতিহ্যবাহী খাবার, নিজস্ব গাড়ি এবং প্রত্যয়িত গাইড অন্তর্ভুক্ত।',
  },
  'packages.all': {
    en: 'All Destinations',
    as: 'সকলো অঞ্চল',
    hi: 'सभी गंतव्य',
    bn: 'সকল গন্তব্য',
  },
  'packages.northeast': {
    en: 'Northeast India',
    as: 'উত্তৰ-পূব ভাৰত',
    hi: 'पूर्वोत्तर भारत',
    bn: 'উত্তর-পূর্ব ভারত',
  },
  'packages.himalayas': {
    en: 'Himalayas & Ladakh',
    as: 'হিমালয় আৰু লাডাখ',
    hi: 'हिमालय और लद्दाख',
    bn: 'হিমালয় ও লাদাখ',
  },
  'packages.south': {
    en: 'South India',
    as: 'দক্ষিণ ভাৰত',
    hi: 'दक्षिण भारत',
    bn: 'দক্ষিণ ভারত',
  },
  'packages.west': {
    en: 'Western Heritage',
    as: 'পশ্চিমীয়া ঐতিহ্য',
    hi: 'पश्चिमी धरोहर',
    bn: 'পশ্চিমী ঐতিহ্য',
  },
  'packages.perPerson': {
    en: 'per person',
    as: 'প্ৰতিজনৰ বাবে',
    hi: 'प्रति व्यक्ति',
    bn: 'প্রতি ব্যক্তি',
  },
  'packages.inclusions': {
    en: 'Inclusions Included',
    as: 'টা সা-সুবিধা অন্তৰ্ভুক্ত',
    hi: 'सुविधाएं शामिल',
    bn: 'টি সুবিধা অন্তর্ভুক্ত',
  },
  'packages.bookTour': {
    en: 'Book Tour',
    as: 'বুক কৰক',
    hi: 'टूर बुक करें',
    bn: 'বুক করুন',
  },
  'packages.viewDetails': {
    en: 'View Details & Amenities',
    as: 'সা-সুবিধা আৰু বিৱৰণ চাওক',
    hi: 'विवरण व सुविधाएं देखें',
    bn: 'সুবিধা ও বিবরণ দেখুন',
  },
  'packages.directHost': {
    en: 'Direct Host',
    as: 'পোনপটীয়া অপাৰেটৰ',
    hi: 'सीधा ऑपरेटर',
    bn: 'সরাসরি অপারেটর',
  },
  'packages.lockAdvance': {
    en: 'To lock slot: Instant advance',
    as: 'বুক কৰিবলৈ তাৎক্ষণিক অগ্ৰিম',
    hi: 'स्लॉट लॉक करने के लिए अग्रिम',
    bn: 'স্লট বুক করতে অগ্রিম',
  },

  // Financial Model
  'financial.badge': {
    en: '0% Host Commission Model',
    as: '০% হোষ্ট মাচুল ম\'ডেল',
    hi: '०% कमीशन मॉडल',
    bn: '০% কমিশন মডেল',
  },
  'financial.title': {
    en: 'Fair Pricing: 100% to Local Agencies, 5% Transparent Fee',
    as: 'স্বচ্ছ মূল্য: স্থানীয় এজেন্সীয়ে পায় ১০০%, গ্ৰাহকে দিয়ে কেৱল ৫% মাচুল',
    hi: 'निष्पक्ष मूल्य निर्धारण: १००% स्थानीय एजेंसी को, ५% पारदर्शी शुल्क',
    bn: 'ন্যায্য মূল্য: স্থানীয় এজেন্সি পায় ১০০%, গ্রাহক দেন মাত্র ৫% ফি',
  },
  'financial.subtitle': {
    en: 'Unlike traditional portals that cut 20% to 35% from local operators, Jatingaa never deducts a single rupee from your listed price.',
    as: 'অন্যান্য প\'ৰ্টেলে ২০% ৰ পৰা ৩৫% পৰ্যন্ত কমিছন কাটি লয়; কিন্তু জাতিঙ্গাই এজেন্সীৰ মূল্যৰ পৰা এটি টকাও নকটে।',
    hi: 'पारंपरिक पोर्टलों के विपरीत जो २०% से ३५% काटते हैं, जटिंगा आपके सूचीबद्ध मूल्य से एक भी रुपया नहीं काटता है।',
    bn: 'অন্যান্য পোর্টাল যেখানে ২০% থেকে ৩৫% কমিশন কেটে নেয়, জাতিঙ্গা আপনার তালিকাভুক্ত মূল্য থেকে এক টাকাও কাটে না।',
  },

  // Registration & Amenities Upload
  'register.modalTitle': {
    en: 'Agency & Guide Registration & Amenities Form',
    as: 'এজেন্সী / গাইড পঞ্জীয়ন আৰু সা-সুবিধা ফৰ্ম',
    hi: 'एजेंसी व गाइड पंजीकरण और सुविधा फॉर्म',
    bn: 'এজেন্সি ও গাইড নিবন্ধন ও সুবিধা ফর্ম',
  },
  'register.modalSubtitle': {
    en: 'Register your operator profile and fill out the tour amenities you provide for ₹5,000/person (or custom price).',
    as: 'পঞ্জীয়নৰ সময়তে আপোনাৰ প্ৰফাইল আৰু ১ জনৰ ₹৫,০০০ টকাত কি কি সা-সুবিধা (Khubidha) দিব তাৰ সম্পূৰ্ণ ফৰ্ম ফিলাপ কৰি আপলোড কৰক।',
    hi: 'पंजीकरण के समय अपनी प्रोफ़ाइल और ₹५,०००/व्यक्ति (या अपनी कीमत) में मिलने वाली सभी सुविधाओं का फॉर्म भरकर अपलोड करें।',
    bn: 'নিবন্ধনের সময় আপনার প্রোফাইল এবং ১ জনের ₹৫,০০০ টাকায় কী কী সুবিধা দেবেন তার সম্পূর্ণ ফর্ম পূরণ করে আপলোড করুন।',
  },
  'register.step1': {
    en: '1. Agency / Guide & Bank Account',
    as: '১. এজেন্সী / গাইড আৰু বেংক একাউণ্ট',
    hi: '१. एजेंसी / गाइड और बैंक खाता',
    bn: '১. এজেন্সি / গাইড ও ব্যাঙ্ক অ্যাকাউন্ট',
  },
  'register.step2': {
    en: '2. Tour Package & Khubidha Form (₹5,000/Person)',
    as: '২. ট্যুৰ পেকেজ আৰু সা-সুবিধাসমূহ (₹৫,০০০ Khubidha ফৰ্ম)',
    hi: '२. टूर पैकेज और सुविधाएं (₹५,००० फॉर्म)',
    bn: '২. ট্যুর প্যাকেজ ও সুবিধাসমূহ (₹৫,০০০ ফর্ম)',
  },
  'register.operatorType': {
    en: 'Choose Operator Type:',
    as: 'পঞ্জীয়নৰ ধৰণ বাছনি কৰক:',
    hi: 'ऑपरेटर का प्रकार चुनें:',
    bn: 'অপারেটরের ধরন নির্বাচন করুন:',
  },
  'register.agencyOwner': {
    en: 'Tourist Agency Owner',
    as: 'টুৰিষ্ট এজেন্সী মালিক',
    hi: 'टूरिस्ट एजेंसी मालिक',
    bn: 'ট্যুরিস্ট এজেন্সি মালিক',
  },
  'register.certifiedGuide': {
    en: 'Certified Local Guide',
    as: 'প্ৰমাণিত থলুৱা গাইড',
    hi: 'प्रमाणित स्थानीय गाइड',
    bn: 'প্রত্যয়িত স্থানীয় গাইড',
  },
  'register.agencyNameLabel': {
    en: 'Agency / Guide Brand Name: *',
    as: 'এজেন্সীৰ নাম / গাইড ব্ৰেণ্ড: *',
    hi: 'एजेंसी / ब्रांड का नाम: *',
    bn: 'এজেন্সির নাম / ব্র্যান্ড: *',
  },
  'register.founderLabel': {
    en: 'Founder / Lead Guide Name: *',
    as: 'মালিক / মূল গাইডৰ নাম: *',
    hi: 'मालिक / मुख्य गाइड का नाम: *',
    bn: 'মালিক / প্রধান গাইডের নাম: *',
  },
  'register.phoneLabel': {
    en: 'Direct Contact Phone Number: *',
    as: 'পোনপটীয়া যোগাযোগ / ফোন নম্বৰ: *',
    hi: 'सीधा संपर्क / फोन नंबर: *',
    bn: 'সরাসরি যোগাযোগ / ফোন নম্বর: *',
  },
  'register.stateLabel': {
    en: 'Operating State: *',
    as: 'পৰ্যটন ৰাজ্য: *',
    hi: 'राज्य: *',
    bn: 'রাজ্য: *',
  },
  'register.baseCityLabel': {
    en: 'Base City / HQ: *',
    as: 'মুখ্য কাৰ্যালয় / চহৰ: *',
    hi: 'शहर / मुख्यालय: *',
    bn: 'শহর / সদর দফতর: *',
  },
  'register.emailLabel': {
    en: 'Business Email:',
    as: 'ব্যৱসায়িক ইমেইল:',
    hi: 'व्यावसायिक ईमेल:',
    bn: 'ব্যবসায়িক ইমেইল:',
  },
  'register.specialtyLabel': {
    en: 'Tour Specialization:',
    as: 'ভ্ৰমণৰ বিশেষত্ব:',
    hi: 'विशेषज्ञता:',
    bn: 'বিশেষত্ব:',
  },
  'register.bankSection': {
    en: 'Bank Account & UPI (For Instant ₹1,000 Advance Payouts)',
    as: 'বেংক একাউণ্ট আৰু UPI (প্ৰতিটো বুকিঙৰ ₹১,০০০ তাৎক্ষণিক অগ্ৰিম পোৱাৰ বাবে)',
    hi: 'बैंक खाता और यूपीआई (तत्काल ₹१,००० अग्रिम के लिए)',
    bn: 'ব্যাঙ্ক অ্যাকাউন্ট ও ইউপিআই (তাৎক্ষণিক ₹১,০০০ অগ্রিমের জন্য)',
  },
  'register.accHolder': {
    en: 'Account Holder Name: *',
    as: 'একাউণ্টধাৰীৰ নাম: *',
    hi: 'खाताधारक का नाम: *',
    bn: 'অ্যাকাউন্টধারীর নাম: *',
  },
  'register.bankName': {
    en: 'Bank Name: *',
    as: 'বেংকৰ নাম: *',
    hi: 'बैंक का नाम: *',
    bn: 'ব্যাঙ্কের নাম: *',
  },
  'register.accNumber': {
    en: 'Account Number: *',
    as: 'একাউণ্ট নম্বৰ: *',
    hi: 'खाता संख्या: *',
    bn: 'অ্যাকাউন্ট নম্বর: *',
  },
  'register.ifsc': {
    en: 'IFSC Code: *',
    as: 'IFSC কোড: *',
    hi: 'आईएफएससी कोड: *',
    bn: 'আইএফএসসি কোড: *',
  },
  'register.upi': {
    en: 'UPI ID / VPA:',
    as: 'UPI আই-ডি / VPA:',
    hi: 'यूपीआई आईडी:',
    bn: 'ইউপিআই আইডি:',
  },
  'register.proceedToStep2Btn': {
    en: 'Proceed to Tour Package & Amenities Form (Step 2) →',
    as: 'ট্যুৰ পেকেজ আৰু সা-সুবিধা ফৰ্মলৈ আগবাঢ়ক (Step 2) →',
    hi: 'टूर पैकेज और सुविधा फॉर्म पर जाएं (स्टेप २) →',
    bn: 'ট্যুর প্যাকেজ ও সুবিধা ফর্মে এগিয়ে যান (ধাপ ২) →',
  },
  'register.backToStep1Btn': {
    en: '← Back to Profile & Bank',
    as: '← বেংক আৰু প্ৰফাইললৈ উভতি যাওক',
    hi: '← प्रोफ़ाइल और बैंक पर वापस जाएं',
    bn: '← প্রোফাইল ও ব্যাঙ্কে ফিরে যান',
  },
  'register.packageTitle': {
    en: 'Tour Package Title: *',
    as: 'ট্যুৰ পেকেজৰ নাম: *',
    hi: 'टूर पैकेज का शीर्षक: *',
    bn: 'ট্যুর প্যাকেজের নাম: *',
  },
  'register.destination': {
    en: 'Destination: *',
    as: 'ভ্ৰমণৰ স্থান: *',
    hi: 'गंतव्य: *',
    bn: 'গন্তব্য: *',
  },
  'register.duration': {
    en: 'Duration / Days:',
    as: 'সময়সীমা / দিন:',
    hi: 'अवधि / दिन:',
    bn: 'সময়সীমা / দিন:',
  },
  'register.region': {
    en: 'Region Category:',
    as: 'অঞ্চল শ্ৰেণী:',
    hi: 'क्षेत्र श्रेणी:',
    bn: 'অঞ্চল শ্রেণী:',
  },
  'register.coverPhoto': {
    en: 'Cover Photo Selection:',
    as: 'প্ৰচ্ছদ ফটো নিৰ্বাচন:',
    hi: 'कवर फ़ोटो चयन:',
    bn: 'কভার ফটো নির্বাচন:',
  },
  'register.amenitiesSubtitle': {
    en: 'Select all facilities included in this per-person price (Accommodation, Meals, Vehicle, Guide):',
    as: '১ জনৰ এই মূল্যৰ ভিতৰত থকা, খোৱা, বাহন আৰু গাইডৰ কি কি সুবিধা দিব নিৰ্বাচন কৰক:',
    hi: 'इस प्रति व्यक्ति मूल्य में शामिल सभी सुविधाएं चुनें (आवास, भोजन, वाहन, गाइड):',
    bn: 'এই প্রতি জন মূল্যে অন্তর্ভুক্ত সকল সুবিধা নির্বাচন করুন (থাকা, খাওয়া, গাড়ি, গাইড):',
  },
  'register.licenseLabel': {
    en: 'Tourism License / Reg ID: *',
    as: 'পৰ্যটন লাইচেন্স / পঞ্জীয়ন নম্বৰ: *',
    hi: 'पर्यटन लाइसेंस / पंजीकरण संख्या: *',
    bn: 'পর্যটন লাইসেন্স / রেজিস্ট্রেশন নম্বর: *',
  },
  'register.priceLabel': {
    en: 'Price Per Person (INR): *',
    as: '১ জন ভ্ৰমণকাৰীৰ মুঠ মূল্য (টকা): *',
    hi: 'प्रति व्यक्ति कुल मूल्य (रुपये): *',
    bn: 'প্রতি জনের মোট মূল্য (টাকা): *',
  },
  'register.amenitiesTitle': {
    en: 'What amenities are included in this price? (Khubidha Checklist) *',
    as: 'এই মূল্যত কি কি সা-সুবিধা দিব? (Khubidha Checklist) *',
    hi: 'इस मूल्य में क्या-क्या सुविधाएं मिलेंगी? (सुविधा सूची) *',
    bn: 'এই মূল্যে কী কী সুবিধা অন্তর্ভুক্ত থাকবে? (সুবিধা তালিকা) *',
  },
  'register.quickAmenities': {
    en: 'Quick preset facilities (click to add/remove):',
    as: 'দ্ৰুত বাছনিৰ সুবিধা (ক্লিক কৰি যোগ বা বাতিল কৰক):',
    hi: 'त्वरित चयन सुविधाएं (जोड़ने/हटाने के लिए क्लिक करें):',
    bn: 'দ্রুত নির্বাচনের সুবিধা (ক্লিক করে যোগ/বাতিল করুন):',
  },
  'register.addCustomAmenity': {
    en: 'Add Custom Amenity / Facility:',
    as: 'অন্য কোনো বিশেষ সুবিধা যোগ কৰক:',
    hi: 'कोई अन्य विशेष सुविधा जोड़ें:',
    bn: 'অন্য কোনো বিশেষ সুবিধা যোগ করুন:',
  },
  'register.submitBtn': {
    en: 'Register & Upload Tour Package Live',
    as: 'পঞ্জীয়ন আৰু ট্যুৰ পেকেজ লাইভ আপলোড কৰক',
    hi: 'पंजीकरण करें और टूर पैकेज लाइव अपलोड करें',
    bn: 'নিবন্ধন করুন এবং ট্যুর প্যাকেজ লাইভ আপলোড করুন',
  },

  // Admin Dashboard Modal
  'dashboard.title': {
    en: 'Tourist Agencies & Certified Guides Directory',
    as: 'টুৰিষ্ট এজেন্সী মালিক আৰু প্ৰমাণিত গাইড তালিকা',
    hi: 'टूरिस्ट एजेंसियां और प्रमाणित गाइड निर्देशिका',
    bn: 'ট্যুরিস্ট এজেন্সি ও প্রত্যয়িত গাইড ডিরেক্টরি',
  },
  'dashboard.tabAgencies': {
    en: 'Tourist Agencies',
    as: 'টুৰিষ্ট এজেন্সী মালিক',
    hi: 'टूरिस्ट एजेंसियां',
    bn: 'ট্যুরিস্ট এজেন্সিসমূহ',
  },
  'dashboard.tabGuides': {
    en: 'Certified Guides',
    as: 'প্ৰমাণিত থলুৱা গাইড',
    hi: 'प्रमाणित स्थानीय गाइड',
    bn: 'প্রত্যয়িত স্থানীয় গাইড',
  },
  'dashboard.tabOverview': {
    en: 'Overview & Audit',
    as: 'প্লেটফৰ্ম অডিট',
    hi: 'प्लेटफ़ॉर्म ऑडिट',
    bn: 'প্ল্যাটফর্ম অডিট',
  },
  'dashboard.tabBookings': {
    en: 'Monthly Bookings',
    as: 'মাহিলী বুকিং',
    hi: 'मासिक बुकिंग',
    bn: 'মাসিক বুকিং',
  },

  // Footer
  'footer.directContact': {
    en: 'Direct Contact',
    as: 'পোনপটীয়া যোগাযোগ',
    hi: 'सीधा संपर्क',
    bn: 'সরাসরি যোগাযোগ',
  },
  'footer.whatsappChat': {
    en: 'Official WhatsApp Chat',
    as: 'অফিচিয়েল হোৱাটছএপ চাট',
    hi: 'आधिकारिक व्हाट्सएप चैट',
    bn: 'অফিসিয়াল হোয়াটসঅ্যাপ চ্যাট',
  },
  'footer.rights': {
    en: 'All rights reserved.',
    as: 'সকলো স্বত্ব সংৰক্ষিত।',
    hi: 'सर्वाधिकार सुरक्षित।',
    bn: 'সর্বস্বত্ব সংরক্ষিত।',
  },
  'footer.verifiedNotice': {
    en: 'All listed tour agencies are verified under State Tourism Department Acts.',
    as: 'সকলো তালিকাভুক্ত ট্যুৰ এজেন্সী ৰাজ্যিক পৰ্যটন বিভাগৰ আইনৰ অধীনত প্ৰমাণিত।',
    hi: 'सभी सूचीबद्ध एजेंसियां राज्य पर्यटन विभाग के तहत सत्यापित हैं।',
    bn: 'সকল তালিকাভুক্ত ট্যুর এজেন্সি রাজ্য পর্যটন বিভাগের আইনের অধীনে যাচাইকৃত।',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  currentLangMeta: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Default language is strictly English ('en')
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const stored = localStorage.getItem('jatingaa_language_choice_v3');
      if (stored === 'en' || stored === 'hi' || stored === 'bn') {
        return stored;
      }
      // If none or previously set to 'as', default to 'en'
      localStorage.setItem('jatingaa_language_choice_v3', 'en');
    } catch (e) {
      console.warn('Could not read language from localStorage:', e);
    }
    return 'en'; // DEFAULT IS ENGLISH
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('jatingaa_language_choice_v3', lang);
    } catch (e) {
      console.warn('Could not store language to localStorage:', e);
    }
  };

  useEffect(() => {
    // Sync document language attribute
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    const entry = TRANSLATIONS[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    if (entry && entry['en']) {
      return entry['en'];
    }
    return fallback || key;
  };

  const currentLangMeta =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLangMeta }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
