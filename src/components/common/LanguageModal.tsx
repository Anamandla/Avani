import React, { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { SupportedLanguage } from '../../i18n/types';
import { Globe, Check, X, Search, Sparkles } from 'lucide-react';

export const LanguageModal: React.FC = () => {
  const { 
    currentLanguage, 
    setLanguage, 
    languages, 
    isLanguageModalOpen, 
    closeLanguageModal,
    t
  } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');

  if (!isLanguageModalOpen) return null;

  const filteredLanguages = languages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.greeting.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    closeLanguageModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#0F1115]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="language-select-modal"
        className="w-full max-w-xl bg-white rounded-3xl border border-[#E2E7F0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E2E7F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2B3BF6]/10 text-[#2B3BF6] flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base sm:text-lg text-[#0F1115]">
                  {t('header.selectLanguage', 'Select Official Language')}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2B3BF6]/10 text-[#2B3BF6]">
                  11 Languages
                </span>
              </div>
              <p className="text-xs text-[#5A6A80] mt-0.5">
                {t('header.chooseLanguageDesc', 'Avani is available in all 11 official South African languages.')}
              </p>
            </div>
          </div>
          <button
            id="close-language-modal-btn"
            onClick={closeLanguageModal}
            className="p-2 rounded-xl text-[#5A6A80] hover:text-[#0F1115] hover:bg-[#E2E7F0] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 sm:p-4 border-b border-[#E2E7F0] bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-[#5A6A80] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search language (e.g. isiZulu, Afrikaans, Sepedi, Setswana)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-[#F4F6FA] border border-[#E2E7F0] focus:outline-hidden focus:ring-2 focus:ring-[#2B3BF6]/20 focus:border-[#2B3BF6] text-[#0F1115] placeholder:text-[#5A6A80]"
            />
          </div>
        </div>

        {/* Language Grid / List */}
        <div className="p-3 sm:p-4 overflow-y-auto space-y-2 divide-y-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredLanguages.map((lang) => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  id={`select-lang-${lang.code}`}
                  onClick={() => handleSelect(lang.code)}
                  className={`flex items-start justify-between p-3 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#2B3BF6]/5 border-[#2B3BF6] shadow-xs'
                      : 'bg-white border-[#E2E7F0] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-sm text-[#0F1115]">
                        {lang.nativeName}
                      </span>
                      {lang.nativeName !== lang.name && (
                        <span className="text-[11px] text-[#5A6A80]">
                          ({lang.name})
                        </span>
                      )}
                    </div>
                    
                    {/* Greeting & province info */}
                    <div className="flex items-center gap-1.5 mt-1 text-xs">
                      <span className="inline-flex items-center gap-1 text-[#00C49F] font-medium bg-[#00C49F]/10 px-1.5 py-0.2 rounded-md text-[10px]">
                        <Sparkles className="w-2.5 h-2.5" />
                        "{lang.greeting}!"
                      </span>
                    </div>

                    <div className="text-[10px] text-[#5A6A80] mt-1 truncate">
                      {lang.region}
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#2B3BF6] text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-[#CBD5E1]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {filteredLanguages.length === 0 && (
            <div className="text-center py-8 text-[#5A6A80] text-xs">
              No languages match "{searchQuery}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 sm:p-4 bg-[#F8FAFC] border-t border-[#E2E7F0] flex items-center justify-between text-xs text-[#5A6A80]">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🇿🇦</span>
            <span>Constitutionally recognized official languages</span>
          </div>
          <button
            onClick={closeLanguageModal}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[#E2E7F0] text-[#0F1115] hover:bg-[#F4F6FA] transition-colors"
          >
            {t('common.close', 'Close')}
          </button>
        </div>
      </div>
    </div>
  );
};
