import React, { useState, useEffect } from 'react';
import { District, DistrictStatus, CampaignCity } from '../../types';
import { CitySectorMap } from '../../components/CitySectorMap';
import { Globe, Activity, Map, AlertTriangle, Droplet, Wind, Info, X, Loader2 } from 'lucide-react';
import { DistrictIntel } from './DistrictIntel.tsx';
import { getCityPollutionInfo } from '../../services/geminiService';
import { useLanguage } from '../../i18n';

interface DashboardProps {
  currentCity: CampaignCity;
  districts: District[];
  activeDistrict: District | null;
  briefing: string;
  loadingCity: boolean;
  stats: {
    globalHealth: number;
  };
  onSelectDistrict: (district: District) => void;
  onLaunchMission: () => void;
  onShowTutorial: () => void;
  onGetBriefing: (district: District) => Promise<string>;
  onUpdateCity: (city: CampaignCity) => void;
  onCollectTrash?: (reward: { xp: number; coins: number; tokens: number }) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentCity,
  districts,
  activeDistrict,
  briefing,
  loadingCity,
  stats,
  onSelectDistrict,
  onLaunchMission,
  onShowTutorial,
  onGetBriefing,
  onUpdateCity,
  onCollectTrash
}) => {
  const { t, language } = useLanguage();
  const restoredCount = districts.filter(d => d.status === DistrictStatus.RESTORED).length;
  const [showPollutionInfo, setShowPollutionInfo] = useState(false);
  const [loadingPollutionInfo, setLoadingPollutionInfo] = useState(false);
  const [cityWithInfo, setCityWithInfo] = useState<CampaignCity>(currentCity);

  // Update city with info when currentCity changes
  useEffect(() => {
    setCityWithInfo(currentCity);
  }, [currentCity]);

  const handleLearnMore = async () => {
    setShowPollutionInfo(true);
    
    // If pollution info already exists, don't fetch again
    if (cityWithInfo.pollutionInfo) {
      return;
    }

    // Fetch pollution info from AI
    setLoadingPollutionInfo(true);
    try {
      const pollutionInfo = await getCityPollutionInfo(cityWithInfo, language);
      const updatedCity: CampaignCity = {
        ...cityWithInfo,
        pollutionInfo
      };
      setCityWithInfo(updatedCity);
      onUpdateCity(updatedCity);
    } catch (error) {
      console.error("Failed to load pollution info:", error);
    } finally {
      setLoadingPollutionInfo(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 overflow-y-auto md:overflow-hidden custom-scrollbar pb-20 md:pb-0">
      {/* STATUS BAR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
        {/* Current City Widget */}
        <div className="bg-slate-900/50 border border-emerald-500/30 p-4 rounded-2xl flex items-start gap-4 shadow-lg relative overflow-visible group">
          <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400 shrink-0">
            <Globe size={24} />
          </div>
          <div className="min-w-0 flex-1 flex flex-col">
            <div className="text-xs text-emerald-500 font-bold uppercase tracking-wider truncate">{t.dashboard.currentSector}</div>
            <div className="text-xl md:text-2xl font-black text-white truncate">{currentCity.name}</div>
            <button
              onClick={handleLearnMore}
              disabled={loadingPollutionInfo}
              className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors w-fit cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingPollutionInfo ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  {t.common.loading}
                </>
              ) : (
                <>
                  <Info size={12} />
                  {t.dashboard.learnMore}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Widget */}
        <div className="bg-slate-900/50 border border-blue-500/30 p-4 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-blue-500/20 rounded-full text-blue-400 shrink-0">
            <Activity size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">
              <span>{t.dashboard.restoration}</span>
              <span>{restoredCount}/{districts.length}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(restoredCount / Math.max(1, districts.length)) * 100}%` }}></div>
            </div>
          </div>
        </div>

        {/* Global Health */}
        <div className="bg-slate-900/50 border border-purple-500/30 p-4 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="p-3 bg-purple-500/20 rounded-full text-purple-400 shrink-0">
            <Activity size={24} />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-purple-500 font-bold uppercase tracking-wider truncate">{t.dashboard.globalHealth}</div>
            <div className="text-xl md:text-2xl font-black text-white">{stats.globalHealth}%</div>
          </div>
        </div>
      </div>

      {/* POLLUTION INFO MODAL */}
      {showPollutionInfo && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPollutionInfo(false)}
        >
          <div 
            className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPollutionInfo(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Loading State */}
            {loadingPollutionInfo && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-emerald-400 mb-4" />
                <p className="text-slate-400 text-sm">{t.dashboard.analyzingData}</p>
              </div>
            )}

            {/* Content */}
            {!loadingPollutionInfo && (
              <>
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-red-500/20 rounded-full">
                    <AlertTriangle size={24} className="text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-Fredoka font-black text-white">{cityWithInfo.name}</h2>
                    <div className="text-sm text-slate-400">{t.dashboard.environmentalStatusReport}</div>
                  </div>
                  {cityWithInfo.pollutionInfo?.pollutionLevel && (
                    <div className="px-3 py-1 bg-red-900/30 border border-red-500/30 rounded-lg">
                      <span className="text-xs text-red-400 font-bold uppercase">{cityWithInfo.pollutionInfo.pollutionLevel}</span>
                    </div>
                  )}
                </div>

                {/* City Basic Info - Always shown */}
                <div className="mb-6">
                  <div className="bg-slate-800/30 border border-emerald-500/30 rounded-xl p-6 mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{cityWithInfo.name}</h3>
                        {cityWithInfo.region && (
                          <div className="text-sm text-slate-400 flex items-center gap-2">
                            <Globe size={14} />
                            <span>{cityWithInfo.region}</span>
                          </div>
                        )}
                      </div>
                      {cityWithInfo.difficulty && (
                        <div className="px-3 py-1 bg-amber-900/30 border border-amber-500/30 rounded-lg">
                          <span className="text-xs text-amber-400 font-bold uppercase">
                            Difficulty: {cityWithInfo.difficulty.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    {cityWithInfo.description && (
                      <p className="text-slate-300 leading-relaxed">{cityWithInfo.description}</p>
                    )}
                  </div>
                </div>

                {/* Detailed Pollution Info - If available */}
                {cityWithInfo.pollutionInfo ? (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {cityWithInfo.pollutionInfo.airQualityIndex && (
                    <div className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Wind size={18} className="text-blue-400" />
                        <span className="text-xs text-slate-500 uppercase font-bold">{t.dashboard.airQualityIndex}</span>
                      </div>
                      <div className="text-2xl font-black text-blue-400">{cityWithInfo.pollutionInfo.airQualityIndex}</div>
                      <div className="text-xs text-slate-400 mt-1">AQI Index</div>
                    </div>
                  )}
                  {cityWithInfo.pollutionInfo.waterQuality && (
                    <div className="bg-slate-800/50 border border-cyan-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplet size={18} className="text-cyan-400" />
                        <span className="text-xs text-slate-500 uppercase font-bold">{t.dashboard.waterQuality}</span>
                      </div>
                      <div className="text-2xl font-black text-cyan-400">{cityWithInfo.pollutionInfo.waterQuality}</div>
                    </div>
                  )}
                </div>

                {/* Main Pollutants */}
                {cityWithInfo.pollutionInfo.mainPollutants && cityWithInfo.pollutionInfo.mainPollutants.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">{t.dashboard.mainPollutants}</h3>
                    <div className="flex flex-wrap gap-2">
                      {cityWithInfo.pollutionInfo.mainPollutants.map((pollutant, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-red-900/30 border border-red-500/30 rounded-lg text-sm text-red-300 font-mono">
                          {pollutant}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Environmental Facts */}
                {cityWithInfo.pollutionInfo.environmentalFacts && cityWithInfo.pollutionInfo.environmentalFacts.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Info size={16} />
                      {t.dashboard.environmentalFacts}
                    </h3>
                    <div className="space-y-3">
                      {cityWithInfo.pollutionInfo.environmentalFacts.map((fact, idx) => (
                        <div key={idx} className="bg-slate-800/50 border-l-4 border-emerald-500/50 p-3 rounded-r-lg">
                          <p className="text-sm text-slate-300 leading-relaxed">{fact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real World Impact */}
                {cityWithInfo.pollutionInfo.realWorldImpact && (
                  <div className="mb-6 bg-slate-800/30 border border-orange-500/30 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-2">{t.dashboard.realWorldImpact}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{cityWithInfo.pollutionInfo.realWorldImpact}</p>
                  </div>
                )}

                {/* Solutions */}
                {cityWithInfo.pollutionInfo.solutions && cityWithInfo.pollutionInfo.solutions.length > 0 && (
                  <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-xl p-4">
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-3">{t.dashboard.solutions}</h3>
                    <ul className="space-y-2">
                      {cityWithInfo.pollutionInfo.solutions.map((solution, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-emerald-300">
                          <span className="text-emerald-400 mt-0.5">✓</span>
                          <span>{solution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="mb-6 bg-slate-800/30 border border-slate-600/30 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <Info size={16} />
                  <span className="font-bold">Status: Data Analysis Pending</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Detailed pollution information for this sector will be available after environmental data analysis is completed. 
                  Launch missions to districts in this city to gather real-time pollution data.
                </p>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      )}

      {/* MAIN CAMPAIGN AREA */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* LEFT: TACTICAL MAP */}
        <div className="lg:col-span-2 flex flex-col bg-slate-900/30 rounded-3xl border border-white/5 p-4 md:p-6 relative overflow-hidden min-h-[400px] md:min-h-[500px]">
          <div className="flex justify-between items-start mb-4 z-10 relative pointer-events-none">
            <div>
              <h2 className="text-xl font-Fredoka text-white flex items-center gap-2">
                <Map className="text-emerald-500" /> {currentCity.name} <span className="text-slate-500 text-sm font-sans font-normal hidden sm:inline">| {currentCity.region}</span>
              </h2>
              <p className="text-slate-400 text-sm max-w-md mt-1 line-clamp-2">{currentCity.description}</p>
            </div>
          </div>

          <div className="flex-1 relative rounded-xl overflow-hidden flex items-center justify-center">
            {loadingCity ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-950/80 backdrop-blur-sm rounded-xl border border-slate-800">
                <div className="text-emerald-400 font-mono animate-pulse tracking-widest">ACQUIRING SATELLITE LOCK...</div>
              </div>
            ) : (
              <CitySectorMap 
                districts={districts}
                activeDistrict={activeDistrict}
                onSelect={onSelectDistrict}
                cityName={currentCity.name}
                onCollectTrash={onCollectTrash}
              />
            )}
          </div>
        </div>

        {/* RIGHT: DISTRICT INTEL */}
        <DistrictIntel
          activeDistrict={activeDistrict}
          briefing={briefing}
          currentCity={currentCity}
          onLaunchMission={onLaunchMission}
          onShowTutorial={onShowTutorial}
        />
      </div>
    </div>
  );
};

