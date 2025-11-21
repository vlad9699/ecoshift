import React from 'react';
import { Globe, Plane } from 'lucide-react';
import { CampaignCity } from '../../types';
import { useLanguage } from '../../i18n';

interface CityCompleteModalProps {
  currentCity: CampaignCity;
  nextCity: CampaignCity;
  onTravel: () => void;
}

export const CityCompleteModal: React.FC<CityCompleteModalProps> = ({ 
  currentCity, 
  nextCity, 
  onTravel 
}) => {
  const { t, format } = useLanguage();
  
  return (
    <div className="absolute inset-0 z-[50] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-700 px-4">
      <div className="max-w-2xl w-full p-8 text-center">
        <Globe size={80} className="text-emerald-500 mx-auto mb-6 animate-pulse" />
        <h2 className="text-5xl font-black text-white font-Fredoka mb-4 tracking-tighter">{t.modals.cityComplete.title}</h2>
        <p className="text-xl text-slate-300 mb-8">
          {format(t.modals.cityComplete.excellentWork, { cityName: currentCity.name })}
        </p>
        
        <div className="flex justify-center gap-4">
          <button 
            onClick={onTravel}
            className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-xl transition-all hover:scale-105 flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
          >
            <Plane className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
            {t.modals.cityComplete.deployTo} {nextCity.name.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

