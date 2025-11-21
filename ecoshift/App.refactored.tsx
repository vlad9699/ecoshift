import React, { useState, useEffect } from 'react';
import { District, DistrictStatus, PlayerStats } from './types';
import { generateCityLevel, getMissionBriefing } from './services/geminiService';
import { DroneGame } from './components/DroneGame';
import { WaterGame } from './components/WaterGame';
import { RoverGame } from './components/RoverGame';
import { TutorialModal } from './components/TutorialModal';
import { LayoutGrid, ShoppingBag, Trophy, Award, Gem, Trash2 } from 'lucide-react';
import { CAMPAIGN_CITIES } from './constants';
import { 
  usePlayerStats, 
  useDistricts, 
  useSaveSystem, 
  useVehicleStats, 
  useProgression,
  getGameType,
  resetProgress
} from './hooks';
import { OperatorAvatar, LevelUpModal, CityCompleteModal, AchievementToast } from './components/ui';
import { Dashboard } from './features/Dashboard';
import { Hangar } from './features/Hangar';
import { Achievements } from './features/Achievements';
import { getLevelBorder } from './utils/levelUtils';

const App: React.FC = () => {
  // State hooks
  const { stats, setStats } = usePlayerStats();
  const { districts, setDistricts } = useDistricts();
  useSaveSystem(stats, districts);
  
  // UI State
  const [loadingCity, setLoadingCity] = useState(true);
  const [view, setView] = useState<'DASHBOARD' | 'GAME' | 'HANGAR' | 'ACHIEVEMENTS'>('DASHBOARD');
  const [activeDistrict, setActiveDistrict] = useState<District | null>(null);
  const [briefing, setBriefing] = useState<string>("");
  const [showCityComplete, setShowCityComplete] = useState(false);
  const [showTokenInfo, setShowTokenInfo] = useState(false);
  const [showPlayerInfo, setShowPlayerInfo] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Progression
  const { checkProgression, levelUpData, setLevelUpData, notifications } = useProgression(stats);

  // Get current city
  const currentCity = CAMPAIGN_CITIES[stats.campaignStage % CAMPAIGN_CITIES.length];
  const nextCity = CAMPAIGN_CITIES[(stats.campaignStage + 1) % CAMPAIGN_CITIES.length];

  // Initial Load Logic
  useEffect(() => {
    const hasLoadedData = districts.length > 0 && districts[0].id.includes(currentCity.name);
    
    if (!hasLoadedData) {
      loadCityData(currentCity);
    } else {
      setLoadingCity(false);
    }
  }, [stats.campaignStage]);

  const loadCityData = async (city: typeof currentCity) => {
    setLoadingCity(true);
    setDistricts([]);
    const data = await generateCityLevel(city.name, city.difficulty);
    setDistricts(data);
    setLoadingCity(false);
  };

  // Check if City is Completed
  useEffect(() => {
    if (districts.length > 0 && districts.every(d => d.status === DistrictStatus.RESTORED)) {
      if (!showCityComplete) {
        setShowCityComplete(true);
      }
    }
  }, [districts, showCityComplete]);

  const selectDistrict = async (district: District) => {
    setActiveDistrict(district);
    setBriefing("Analyzing local sensor data...");
    
    const intelPanel = document.getElementById('intel-panel');
    if (intelPanel && window.innerWidth < 1024) {
      setTimeout(() => intelPanel.scrollIntoView({ behavior: 'smooth' }), 100);
    }

    const txt = await getMissionBriefing(district);
    setBriefing(txt);
  };

  const launchMission = () => {
    if (activeDistrict) {
      if (!stats.tutorialSeen) {
        setShowTutorial(true);
      } else {
        setView('GAME');
      }
    }
  };

  const handleTutorialComplete = () => {
    setStats(prev => ({ ...prev, tutorialSeen: true }));
    setShowTutorial(false);
    setView('GAME');
  };

  const travelToNextCity = () => {
    setStats(prev => ({
      ...prev,
      campaignStage: prev.campaignStage + 1
    }));
    setShowCityComplete(false);
    setActiveDistrict(null);
  };

  const handleMissionComplete = (
    score: number, 
    success: boolean, 
    tokensFound: number, 
    extraStats?: { enemiesDefeated?: number, cratesSmashed?: number }
  ) => {
    setView('DASHBOARD');
    
    const updatedEnemies = stats.totalEnemiesDefeated + (extraStats?.enemiesDefeated || 0);
    const updatedCrates = stats.totalCratesSmashed + (extraStats?.cratesSmashed || 0);

    if (success && activeDistrict) {
      const newMissionsCompleted = stats.missionsCompleted + 1;
      const newDistrictsRestored = stats.districtsRestored + 1;
      const coinReward = Math.floor(score / 2);
      
      const nextStats = {
        ...stats,
        xp: stats.xp + score,
        ecoCoins: stats.ecoCoins + coinReward,
        impactTokens: stats.impactTokens + tokensFound,
        globalHealth: Math.min(100, stats.globalHealth + 5),
        missionsCompleted: newMissionsCompleted,
        districtsRestored: newDistrictsRestored,
        totalEnemiesDefeated: updatedEnemies,
        totalCratesSmashed: updatedCrates
      };

      setStats(nextStats);
      const updates = checkProgression(nextStats);
      if (Object.keys(updates).length > 0) {
        setStats(prev => ({ ...prev, ...updates }));
      }

      setDistricts(prev => prev.map(d => d.id === activeDistrict.id ? { ...d, status: DistrictStatus.RESTORED, pollutionLevel: 0 } : d));
      setActiveDistrict(null);
    } else {
      const nextStats = {
        ...stats,
        xp: stats.xp + Math.floor(score/10), 
        impactTokens: stats.impactTokens + tokensFound,
        totalEnemiesDefeated: updatedEnemies,
        totalCratesSmashed: updatedCrates
      };
      setStats(nextStats);
      const updates = checkProgression(nextStats);
      if (Object.keys(updates).length > 0) {
        setStats(prev => ({ ...prev, ...updates }));
      }
      setActiveDistrict(null);
    }
  };

  const buyUpgrade = (upgradeId: string, cost: number) => {
    if (stats.ecoCoins >= cost) {
      const nextStats = {
        ...stats,
        ecoCoins: stats.ecoCoins - cost,
        upgrades: {
          ...stats.upgrades,
          [upgradeId]: (stats.upgrades[upgradeId] || 0) + 1
        }
      };
      setStats(nextStats);
      const updates = checkProgression(nextStats);
      if (Object.keys(updates).length > 0) {
        setStats(prev => ({ ...prev, ...updates }));
      }
    }
  };

  // Vehicle stats
  const droneStats = useVehicleStats(stats, 'DRONE');
  const subStats = useVehicleStats(stats, 'SUB');
  const roverStats = useVehicleStats(stats, 'ROVER');

  const getVehicleStatsForType = (type: 'DRONE' | 'SUB' | 'ROVER') => {
    if (type === 'SUB') return subStats;
    if (type === 'ROVER') return roverStats;
    return droneStats;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-Inter overflow-hidden relative selection:bg-emerald-500/30 flex flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      {/* TUTORIAL MODAL */}
      {showTutorial && activeDistrict && (
        <TutorialModal 
          gameType={getGameType(activeDistrict)} 
          onComplete={handleTutorialComplete} 
        />
      )}

      {/* LEVEL UP MODAL */}
      {levelUpData && (
        <LevelUpModal
          level={levelUpData.level}
          coins={levelUpData.coins}
          xp={levelUpData.xp}
          onClose={() => setLevelUpData(null)}
        />
      )}

      {/* CITY COMPLETE MODAL */}
      {showCityComplete && view === 'DASHBOARD' && (
        <CityCompleteModal
          currentCity={currentCity}
          nextCity={nextCity}
          onTravel={travelToNextCity}
        />
      )}

      {/* ACHIEVEMENT TOAST */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-3 pointer-events-none">
        {notifications.map((ach) => (
          <AchievementToast key={ach.id} achievement={ach} />
        ))}
      </div>

      {/* GAME VIEW */}
      {view === 'GAME' && activeDistrict && (
        <>
          {getGameType(activeDistrict) === 'WATER' && (
            <WaterGame 
              district={activeDistrict}
              droneStats={getVehicleStatsForType('SUB')} 
              onComplete={handleMissionComplete}
              onClose={() => setView('DASHBOARD')}
            />
          )}
          {getGameType(activeDistrict) === 'GROUND' && (
            <RoverGame
              district={activeDistrict}
              droneStats={getVehicleStatsForType('ROVER')}
              onComplete={handleMissionComplete}
              onClose={() => setView('DASHBOARD')}
            />
          )}
          {getGameType(activeDistrict) === 'AIR' && (
            <DroneGame 
              district={activeDistrict}
              droneStats={getVehicleStatsForType('DRONE')}
              onComplete={handleMissionComplete}
              onClose={() => setView('DASHBOARD')}
            />
          )}
        </>
      )}

      {/* DASHBOARD / HANGAR VIEW */}
      {view !== 'GAME' && (
        <div className="relative z-10 flex flex-col h-screen max-w-7xl mx-auto p-4 md:p-6 w-full">
          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between md:items-end pb-6 border-b border-white/5 mb-6 gap-4 shrink-0">
            <div className="flex items-center gap-4 md:gap-5">
              <div 
                className="relative shrink-0 z-[100]"
                onMouseEnter={() => setShowPlayerInfo(true)}
                onMouseLeave={() => setShowPlayerInfo(false)}
              >
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center shadow-lg border-2 bg-slate-800 overflow-hidden transition-all duration-500 ${getLevelBorder(stats.level)} hover:scale-105 cursor-help`}>
                  <OperatorAvatar level={stats.level} />
                </div>
                <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 w-6 h-6 md:w-8 md:h-8 bg-slate-900 border-2 border-slate-700 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold text-white shadow-lg z-10">
                  {stats.level}
                </div>

                {/* Player Info Tooltip */}
                {showPlayerInfo && (
                  <div className="absolute top-full left-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl border border-emerald-400 p-5 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.3)] text-xs origin-top-left transition-all duration-200 z-50">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400 rounded-br-lg"></div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400">
                        <Award size={16} />
                      </div>
                      <div>
                        <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Current Rank</div>
                        <div className="text-white font-black text-sm">{stats.title}</div>
                      </div>
                    </div>

                    <div className="space-y-1 mb-4">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                        <span>Progression</span>
                        <span className="text-emerald-400">{Math.floor(stats.xp)} / {stats.xpToNextLevel} XP</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" style={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-slate-800/50 p-2 rounded border border-white/5 text-center">
                        <div className="text-[10px] text-slate-500 uppercase">Missions</div>
                        <div className="text-white font-bold">{stats.missionsCompleted}</div>
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded border border-white/5 text-center">
                        <div className="text-[10px] text-slate-500 uppercase">Restored</div>
                        <div className="text-white font-bold">{stats.districtsRestored}</div>
                      </div>
                    </div>

                    <button 
                      onClick={resetProgress}
                      className="w-full py-2 border border-red-500/30 hover:bg-red-900/20 text-red-400 text-[10px] font-bold uppercase rounded flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 size={12} /> Reset Data
                    </button>
                  </div>
                )}
              </div>

              <div>
                <h1 className="font-Fredoka text-2xl md:text-4xl font-bold text-white tracking-tight mb-1">
                  ECO<span className="text-emerald-500">SHIFT</span> <span className="hidden md:inline text-slate-600 text-lg">OPERATOR</span>
                </h1>
                <div className="flex items-center gap-2 md:gap-4 text-xs font-mono text-emerald-500/80">
                  <span className="flex items-center gap-1"><Award size={12}/> <span className="truncate max-w-[120px] md:max-w-none">{stats.title}</span></span>
                  <span className="hidden md:inline">//</span>
                  <div className="w-24 md:w-32 h-2 bg-slate-800 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-emerald-600 transition-all duration-1000" style={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <nav className="flex-1 md:flex-none flex bg-slate-900/50 p-1 rounded-lg border border-white/10 items-center gap-1 overflow-x-auto custom-scrollbar">
                <button 
                  onClick={() => setView('DASHBOARD')}
                  className={`px-3 md:px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${view === 'DASHBOARD' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <LayoutGrid size={16} /> OPS
                </button>
                <button 
                  onClick={() => setView('HANGAR')}
                  className={`px-3 md:px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${view === 'HANGAR' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <ShoppingBag size={16} /> <span className="hidden md:inline">HANGAR</span> <span className="bg-black/20 px-1.5 rounded text-xs text-amber-400 whitespace-nowrap">{Math.floor(stats.ecoCoins)} G</span>
                </button>
                
                <button 
                  onClick={() => setView('ACHIEVEMENTS')}
                  className={`px-3 md:px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${view === 'ACHIEVEMENTS' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  <Trophy size={16} />
                </button>
              </nav>

              {/* IMPACT TOKENS DISPLAY */}
              <div 
                className="relative shrink-0 z-[100]"
                onMouseEnter={() => setShowTokenInfo(true)}
                onMouseLeave={() => setShowTokenInfo(false)}
              >
                <div 
                  className="relative px-4 py-2 bg-slate-900/80 rounded-xl border border-blue-500/30 flex items-center gap-3 cursor-help transition-all duration-300 
                    hover:border-blue-400 hover:bg-blue-900/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 group"
                  onClick={() => setShowTokenInfo(!showTokenInfo)}
                >
                  <div className="relative">
                    <Gem size={18} className={`text-blue-400 transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-110 group-hover:text-cyan-300 ${showTokenInfo ? 'rotate-[360deg] scale-110 text-cyan-300' : ''}`} />
                    <div className="absolute inset-0 blur-md bg-blue-500/0 group-hover:bg-blue-400/40 transition-colors duration-300 rounded-full"></div>
                  </div>
                  
                  <div className="flex flex-col leading-none">
                    <span className="font-mono font-black text-blue-100 text-sm group-hover:text-white transition-colors">{stats.impactTokens}</span>
                    <span className="text-[9px] uppercase text-blue-500 font-bold tracking-wider group-hover:text-blue-300 transition-colors">Tokens</span>
                  </div>
                </div>
                
                {showTokenInfo && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-slate-900/95 backdrop-blur-xl border border-blue-400 p-5 rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.3)] text-xs origin-top-right transition-all duration-200 z-50">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-blue-400 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-blue-400 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-blue-400 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-blue-400 rounded-br-lg"></div>

                    <h4 className="text-cyan-300 font-black text-base mb-2 flex items-center gap-2">
                      <Gem size={16} className="animate-pulse" /> IMPACT TOKEN
                    </h4>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      Use this token to support real-world eco-initiatives:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-slate-400 mb-4">
                      <li>Donate to environmental causes</li>
                      <li>In-game currency for good deeds</li>
                      <li>Rewards from partners & brands</li>
                      <li>Plant a real tree with your message</li>
                    </ul>
                    
                    <div className="bg-blue-950/50 rounded-lg p-3 border border-blue-500/20 mb-1">
                      <p className="text-blue-200 italic flex gap-2">
                        <span className="text-xl">💡</span>
                        <span>Accumulate tokens to unlock <strong>Global Terraform</strong> projects in future updates.</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Content Grid */}
          <div className="flex-1 min-h-0 overflow-hidden relative">
            {view === 'ACHIEVEMENTS' && (
              <Achievements stats={stats} />
            )}

            {view === 'HANGAR' && (
              <Hangar stats={stats} onBuyUpgrade={buyUpgrade} />
            )}

            {view === 'DASHBOARD' && (
              <Dashboard
                currentCity={currentCity}
                districts={districts}
                activeDistrict={activeDistrict}
                briefing={briefing}
                loadingCity={loadingCity}
                stats={stats}
                onSelectDistrict={selectDistrict}
                onLaunchMission={launchMission}
                onShowTutorial={() => setShowTutorial(true)}
                onGetBriefing={getMissionBriefing}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

