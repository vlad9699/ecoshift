import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'uk' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600 rounded-lg text-sm font-medium text-white transition-colors backdrop-blur-sm"
      title={language === 'en' ? 'Switch to Ukrainian' : 'Перемкнути на англійську'}
    >
      <Globe size={16} />
      <span className="uppercase">{language === 'en' ? 'EN' : 'UK'}</span>
    </button>
  );
};

