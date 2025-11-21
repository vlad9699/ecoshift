import React from 'react';
import { District, DistrictStatus, CampaignCity } from '../../types';
import { ExternalLink, BookOpen, Globe, HelpCircle, Target } from 'lucide-react';
import { getGameType, getGameLabel } from '../../hooks';
import { useLanguage } from '../../i18n';

interface DistrictIntelProps {
  activeDistrict: District | null;
  briefing: string;
  currentCity: CampaignCity;
  onLaunchMission: () => void;
  onShowTutorial: () => void;
}

export const DistrictIntel: React.FC<DistrictIntelProps> = ({
  activeDistrict,
  briefing,
  currentCity,
  onLaunchMission,
  onShowTutorial
}) => {
  const { t } = useLanguage();
  
  if (!activeDistrict) {
    return (
      <div id="intel-panel" className="lg:col-span-1 h-full flex flex-col min-h-[500px] lg:min-h-0 relative">
        <div className="h-full border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center opacity-50 bg-slate-900/20">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Target size={32} className="text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-500 mb-2">{t.dashboard.awaitingCoordinates}</h3>
          <p className="text-sm text-slate-600">{t.dashboard.selectSector}</p>
        </div>
      </div>
    );
  }

  const gameType = getGameType(activeDistrict);
  const gameLabel = getGameLabel(gameType);

  // Generate Google Maps URL with fallback
  const getGoogleMapsUrl = (): string => {
    if (activeDistrict.googleMapsUri && activeDistrict.googleMapsUri !== 'https://maps.google.com') {
      return activeDistrict.googleMapsUri;
    }
    // Fallback: create URL from district name + city for more accurate search
    // This ensures we search for "Mission District San Francisco" instead of just "Mission District"
    const searchQuery = activeDistrict.realAddress || `${activeDistrict.name}, ${currentCity.name}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`;
  };

  const mapsUrl = getGoogleMapsUrl();

  return (
    <div id="intel-panel" className="lg:col-span-1 h-full flex flex-col min-h-[500px] lg:min-h-0 relative">
      {activeDistrict && (
        <div className="hidden lg:block absolute top-1/2 -left-6 w-6 h-[2px] bg-gradient-to-r from-transparent to-emerald-500/50 z-0"></div>
      )}

      <div className="flex-1 bg-slate-900 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-in slide-in-from-right duration-300 z-10">
        {/* Header Image */}
        <div className="h-32 md:h-40 bg-black relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-emerald-900/20"></div>
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(0deg,transparent_24%,rgba(16,185,129,.3)_25%,rgba(16,185,129,.3)_26%,transparent_27%,transparent_74%,rgba(16,185,129,.3)_75%,rgba(16,185,129,.3)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(16,185,129,.3)_25%,rgba(16,185,129,.3)_26%,transparent_27%,transparent_74%,rgba(16,185,129,.3)_75%,rgba(16,185,129,.3)_76%,transparent_77%,transparent)] bg-[size:30px_30px]"></div>
          
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-xl md:text-2xl font-Fredoka font-black text-white leading-none truncate">{activeDistrict.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <a 
                href={mapsUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1 hover:text-blue-300 transition-colors"
              >
                <ExternalLink size={10} /> {t.dashboard.viewIntelOnMaps}
              </a>
            </div>
          </div>
        </div>

        {/* Briefing Content */}
        <div className="p-4 md:p-6 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t.dashboard.environmentalHazard}</h3>
              <span className="text-red-400 font-mono text-xs font-bold border border-red-500/30 px-1 rounded">{activeDistrict.pollutionLevel}% {t.dashboard.toxicity}</span>
            </div>
            <p className="text-white font-bold text-lg leading-tight mb-2">{activeDistrict.realWorldProblem}</p>
            <p className="text-sm text-slate-400 mb-4">{activeDistrict.description}</p>

            {activeDistrict.educationalTip && (
              <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 p-4 rounded-xl mb-6 relative overflow-hidden group hover:border-blue-400/50 transition-colors shadow-lg">
                <div className="absolute -right-4 -top-4 text-blue-500/10 rotate-12 transform group-hover:scale-110 transition-transform duration-700">
                  <BookOpen size={80} />
                </div>
                <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest mb-2 relative z-10">
                  <Globe size={14} /> {t.dashboard.realWorldContext}
                </div>
                <p className="text-sm text-blue-100 leading-relaxed relative z-10 font-medium italic">
                  "{activeDistrict.educationalTip}"
                </p>
              </div>
            )}
            
            <div className="bg-slate-800/50 p-3 rounded-lg border-l-2 border-emerald-500">
              <div className="text-[10px] uppercase text-emerald-500 font-bold mb-1">{t.dashboard.missionBriefing}</div>
              <div className="text-sm text-slate-300 italic">
                "{briefing || <span className="animate-pulse">{t.dashboard.decrypting}</span>}"
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-slate-800/50 p-2 rounded text-center border border-white/5">
                <div className="text-xs text-slate-500 uppercase">{t.dashboard.bounty}</div>
                <div className="text-amber-400 font-bold">250 G</div>
              </div>
              <div className="bg-slate-800/50 p-2 rounded text-center border border-white/5">
                <div className="text-xs text-slate-500 uppercase">{t.player.xp}</div>
                <div className="text-purple-400 font-bold">500 {t.player.xp}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={onShowTutorial}
                className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-white/5"
                title={t.dashboard.viewTutorial}
              >
                <HelpCircle size={20} />
              </button>

              <button 
                onClick={onLaunchMission}
                disabled={activeDistrict.status === DistrictStatus.RESTORED}
                className={`flex-1 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg
                  ${activeDistrict.status === DistrictStatus.RESTORED 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:scale-[1.02] hover:shadow-emerald-500/25'
                  }
                `}
              >
                {activeDistrict.status === DistrictStatus.RESTORED ? t.dashboard.areaSecured : gameLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

