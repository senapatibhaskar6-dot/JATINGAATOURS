import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage, SUPPORTED_LANGUAGES, LanguageCode } from '../context/LanguageContext';

interface LanguageSwitcherProps {
  variant?: 'header' | 'mobile' | 'footer';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { language, setLanguage, currentLangMeta } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  if (variant === 'mobile') {
    return (
      <div className={`p-2 rounded-xl bg-stone-50 border border-stone-200 ${className}`}>
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 mb-2 px-1">
          <Globe className="w-3.5 h-3.5 text-[#0b4619]" />
          <span>Select Display Language / ভাষা নিৰ্বাচন:</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0b4619] text-white shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span>{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
        <span className="text-stone-500 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-emerald-800" />
          <span>Language:</span>
        </span>
        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#0b4619] shadow-2xs border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title={`Switch display language to ${lang.label}`}
              >
                <span className="mr-1">{lang.flag}</span>
                {lang.nativeName}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Header variant (Dropdown Popover)
  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-stone-800 bg-white hover:bg-stone-100 border border-stone-200 shadow-2xs transition-colors cursor-pointer"
        title="Change Display Language (English / অসমীয়া / हिन्दी / বাংলা)"
        aria-expanded={isOpen}
      >
        <Globe className="w-3.5 h-3.5 text-[#0b4619]" />
        <span>{currentLangMeta.flag}</span>
        <span className="hidden md:inline font-semibold">{currentLangMeta.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white border border-stone-200 shadow-xl py-1.5 z-50 text-xs animate-fade-in">
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 mb-1">
            Display Language
          </div>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 text-[#0b4619] font-bold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{lang.flag}</span>
                  <div>
                    <div className="font-semibold">{lang.nativeName}</div>
                    <div className="text-[10px] text-stone-500">{lang.label}</div>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#0b4619]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
