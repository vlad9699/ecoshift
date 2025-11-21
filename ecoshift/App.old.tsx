
import React, { useState, useEffect } from 'react';
import { District, DistrictStatus, PlayerStats, DroneStats, Achievement, CampaignCity } from './types';
import { generateCityLevel, getMissionBriefing } from './services/geminiService';
import { DroneGame } from './components/DroneGame';
import { WaterGame } from './components/WaterGame';
import { RoverGame } from './components/RoverGame';
import { TutorialModal } from './components/TutorialModal';
import { CitySectorMap } from './components/CitySectorMap'; // Import new component
import { MapPin, Crosshair, Battery, Wind, Shield, ExternalLink, Globe, ShoppingBag, Zap, Info, Award, Star, Trophy, Flag, AlertTriangle, Map, Activity, LayoutGrid, Plane, CheckCircle2, Lock, Gem, Anchor, BookOpen, Menu, Truck, HelpCircle, ScanLine, Target, Trash2 } from 'lucide-react';
import { SHOP_UPGRADES, SUB_UPGRADES, ROVER_UPGRADES, ACHIEVEMENTS_LIST, TITLES, CAMPAIGN_CITIES } from './constants';

// --- COMPONENTS ---

const OperatorAvatar: React.FC<{ level: number }> = ({ level }) => {
  // Visual Config
  const skinColor = "#eab676"; // Warm skin tone

  let suitColor = "#475569"; 
  let shirtColor = "#94a3b8"; 
  let accessoryType = "NONE"; 
  
  if (level < 2) { // LVL 1: Worker
    suitColor = "#f97316"; // Orange Safety Vest
    shirtColor = "#cbd5e1"; // White T-shirt
    accessoryType = "HARDHAT";
  } else if (level < 5) { // LVL 2-4: Pilot
    suitColor = "#15803d"; // Green Flight Suit
    shirtColor = "#166534"; 
    accessoryType = "HEADSET";
  } else if (level < 10) { // LVL 5-9: Spec Ops
    suitColor = "#0f172a"; // Dark Tactical
    shirtColor = "#334155"; 
    accessoryType = "NIGHTVISION";
  } else { // LVL 10+: Hero
    suitColor = "#eab308"; // Gold/White
    shirtColor = "#ffffff";
    accessoryType = "HALO";
  }

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full bg-slate-800/50">
      {/* Background Gradient */}
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
           <stop offset="0%" stopColor="#1e293b" />
           <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bgGrad)" />

      {/* Body/Shoulders */}
      <path d="M20,100 L80,100 L80,90 Q80,65 50,65 Q20,65 20,90 Z" fill={suitColor} />
      {/* Detail V-shape */}
      <path d="M40,100 L60,100 L60,90 Q60,75 50,75 Q40,75 40,90 Z" fill={shirtColor} />

      {/* Neck */}
      <rect x="42" y="55" width="16" height="15" fill={skinColor} />

      {/* Head */}
      <ellipse cx="50" cy="45" rx="18" ry="22" fill={skinColor} />

      {/* Face: Eyes */}
      <circle cx="43" cy="42" r="2" fill="#1e293b" />
      <circle cx="57" cy="42" r="2" fill="#1e293b" />
      
      {/* Face: Mouth (Neutral) */}
      <path d="M45,55 Q50,57 55,55" fill="none" stroke="#be8e5e" strokeWidth="1.5" />

      {/* Hair (Short Brown) */}
      <path d="M32,35 Q32,15 50,15 Q68,15 68,35 L68,40 L66,40 L66,35 Q66,25 50,25 Q34,25 34,35 L34,40 L32,40 Z" fill="#553e2e" />

      {/* ACCESSORIES */}
      
      {accessoryType === 'HARDHAT' && (
        <g>
           <path d="M28,35 Q28,12 50,12 Q72,12 72,35 L76,35 L76,40 L24,40 L24,35 Z" fill="#facc15" />
           <rect x="45" y="12" width="10" height="5" fill="#facc15" rx="1" />
           <path d="M29,35 Q29,18 50,18 Q71,18 71,35" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.5" />
        </g>
      )}

      {accessoryType === 'HEADSET' && (
         <g>
            {/* Band */}
            <path d="M28,40 Q28,15 50,15 Q72,15 72,40" fill="none" stroke="#1f2937" strokeWidth="4" />
            {/* Ear cups */}
            <rect x="26" y="38" width="6" height="12" rx="2" fill="#1f2937" />
            <rect x="68" y="38" width="6" height="12" rx="2" fill="#1f2937" />
            {/* Mic */}
            <path d="M68,48 L55,58" fill="none" stroke="#1f2937" strokeWidth="2" />
            <circle cx="55" cy="58" r="2" fill="#1f2937" />
         </g>
      )}

      {accessoryType === 'NIGHTVISION' && (
         <g>
            {/* Strap */}
            <path d="M30,35 L70,35" stroke="#000" strokeWidth="3" />
            {/* Goggles */}
            <rect x="35" y="35" width="12" height="10" rx="2" fill="#1e293b" />
            <rect x="53" y="35" width="12" height="10" rx="2" fill="#1e293b" />
            {/* Lenses */}
            <circle cx="41" cy="40" r="3" fill="#10b981" className="animate-pulse" />
            <circle cx="59" cy="40" r="3" fill="#10b981" className="animate-pulse" />
         </g>
      )}

      {accessoryType === 'HALO' && (
         <g>
            {/* Glowing Visor */}
             <path d="M35,42 Q50,48 65,42 L65,38 Q50,44 35,38 Z" fill="#22d3ee" opacity="0.9" />
             {/* Tech Crown */}
             <path d="M30,30 L35,20 L45,25 L50,15 L55,25 L65,20 L70,30" fill="none" stroke="#eab308" strokeWidth="2" />
         </g>
      )}
    </svg>
  )
}

const SAVE_KEY = 'ECOSHIFT_SAVE_DATA_V1';

const DEFAULT_STATS: PlayerStats = {
  level: 1,
  xp: 0,
  xpToNextLevel: 1000,
  ecoCoins: 500, // Starting coins
  impactTokens: 0, // Rare premium currency
  globalHealth: 50,
  title: 'Novice Eco-Warrior',
  upgrades: {}, // Stores { 'eng_1': 1, 'bat_1': 2 }
  unlockedAchievements: [],
  missionsCompleted: 0,
  districtsRestored: 0,
  campaignStage: 0, // Start at City 0
  tutorialSeen: false,
  totalEnemiesDefeated: 0,
  totalCratesSmashed: 0
};

const App: React.FC = () => {
  // --- STATE INITIALIZATION ---
  
  // Initialize Stats from LocalStorage
  const [stats, setStats] = useState<PlayerStats>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.stats || DEFAULT_STATS;
      }
    } catch (e) {
      console.error("Failed to load stats", e);
    }
    return DEFAULT_STATS;
  });

  // Initialize Districts from LocalStorage (to keep map persistence)
  const [districts, setDistricts] = useState<District[]>(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.districts || [];
      }
    } catch (e) {
      console.error("Failed to load districts", e);
    }
    return [];
  });
  
  // UI State
  const [loadingCity, setLoadingCity] = useState(true);
  const [view, setView] = useState<'DASHBOARD' | 'GAME' | 'HANGAR' | 'ACHIEVEMENTS'>('DASHBOARD');
  const [hangarTab, setHangarTab] = useState<'DRONE' | 'SUB' | 'ROVER'>('DRONE'); // New tab state for Hangar
  const [activeDistrict, setActiveDistrict] = useState<District | null>(null);
  const [briefing, setBriefing] = useState<string>("");
  const [showCityComplete, setShowCityComplete] = useState(false);
  const [showTokenInfo, setShowTokenInfo] = useState(false);
  const [showPlayerInfo, setShowPlayerInfo] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Notifications & Modals
  const [levelUpData, setLevelUpData] = useState<{ level: number, coins: number, xp: number } | null>(null);
  const [notifications, setNotifications] = useState<Achievement[]>([]);

  // --- SAVE SYSTEM ---
  
  useEffect(() => {
    const saveData = {
      stats,
      districts,
      timestamp: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  }, [stats, districts]);

  // Reset Function
  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset ALL progress? This cannot be undone.")) {
      localStorage.removeItem(SAVE_KEY);
      window.location.reload();
    }
  };

  // Calculate Stats dynamically based on vehicle type
  const getVehicleStats = (type: 'DRONE' | 'SUB' | 'ROVER'): DroneStats => {
    let baseStats: DroneStats = {
      speed: 1,
      battery: 100,
      filterRadius: 50,
      hull: 100,
      empRadius: 0
    };
    
    // Select correct upgrade list
    let upgradeList = SHOP_UPGRADES;
    if (type === 'SUB') upgradeList = SUB_UPGRADES;
    if (type === 'ROVER') upgradeList = ROVER_UPGRADES;

    upgradeList.forEach(up => {
      const level = stats.upgrades[up.id] || 0;
      if (level > 0 && up.statEffect) {
        // Apply upgrade effects
        if (up.statEffect.speed) baseStats.speed += (up.statEffect.speed - 1) * level; // Add % roughly
        if (up.statEffect.battery) baseStats.battery += (up.statEffect.battery - 100) * level;
        if (up.statEffect.filterRadius) baseStats.filterRadius *= (1 + (0.2 * level));
        if (up.statEffect.hull) baseStats.hull *= (1 + (0.2 * level));
        if (up.statEffect.empRadius) baseStats.empRadius = 150; // Unlock Ability / Feature
      }
    });

    // Rover base stat adjustments
    if (type === 'ROVER') {
       baseStats.speed *= 0.8; // Slower base
       baseStats.hull *= 1.5; // Tougher base
    }

    return baseStats;
  };

  // Get current city
  const currentCity = CAMPAIGN_CITIES[stats.campaignStage % CAMPAIGN_CITIES.length];

  // Initial Load Logic
  useEffect(() => {
    // If we have loaded districts from LS, and they match the current city, don't regenerate
    const hasLoadedData = districts.length > 0 && districts[0].id.includes(currentCity.name);
    
    if (!hasLoadedData) {
      loadCityData(currentCity);
    } else {
      setLoadingCity(false);
    }
  }, [stats.campaignStage]);

  const loadCityData = async (city: CampaignCity) => {
     setLoadingCity(true);
     setDistricts([]); // Clear old
     const data = await generateCityLevel(city.name, city.difficulty);
     setDistricts(data);
     setLoadingCity(false);
  };

  // --- Logic ---

  const checkProgression = (currentStats: PlayerStats) => {
    const newAchievements: string[] = [];
    const updates: Partial<PlayerStats> = {};

    // Check Achievements
    ACHIEVEMENTS_LIST.forEach(ach => {
      if (currentStats.unlockedAchievements.includes(ach.id)) return;

      let unlocked = false;
      if (ach.id === 'first_steps' && currentStats.missionsCompleted >= 1) unlocked = true;
      if (ach.id === 'rich_operator' && currentStats.ecoCoins >= 1500) unlocked = true;
      if (ach.id === 'veteran' && currentStats.level >= 3) unlocked = true;
      if (ach.id === 'clean_machine' && currentStats.districtsRestored >= 3) unlocked = true;
      
      if (ach.id === 'tech_junkie') {
         const totalUpgrades = Object.values(currentStats.upgrades).reduce((a, b) => a + b, 0);
         if (totalUpgrades >= 5) unlocked = true;
      }

      if (ach.id === 'scrap_collector' && currentStats.totalEnemiesDefeated >= 10) unlocked = true;
      if (ach.id === 'wrecking_crew' && currentStats.totalCratesSmashed >= 25) unlocked = true;

      if (unlocked) {
        newAchievements.push(ach.id);
        setNotifications(prev => [...prev, ach]);
        setTimeout(() => setNotifications(prev => prev.slice(1)), 4000);
      }
    });

    if (newAchievements.length > 0) {
      updates.unlockedAchievements = [...currentStats.unlockedAchievements, ...newAchievements];
    }

    // Check Level Up
    let newLevel = currentStats.level;
    let xpNeeded = currentStats.xpToNextLevel;
    let newXp = currentStats.xp;
    let accumulatedCoins = 0;
    let accumulatedXpBonus = 0;

    // Simple Level Up Loop (handle multiple levels at once)
    while (newXp >= xpNeeded) {
       newXp -= xpNeeded;
       newLevel++;
       
       // Calculate Rewards for this specific level step
       accumulatedCoins += newLevel * 150; 
       accumulatedXpBonus += newLevel * 50;

       xpNeeded = Math.floor(xpNeeded * 1.5); // Curve
    }

    if (newLevel !== currentStats.level) {
      updates.level = newLevel;
      updates.xp = newXp + accumulatedXpBonus; // Add the bonus to the remainder
      updates.xpToNextLevel = xpNeeded;
      updates.title = TITLES[Math.min(newLevel - 1, TITLES.length - 1)] || 'Legendary Guardian';
      updates.ecoCoins = currentStats.ecoCoins + accumulatedCoins;

      // Trigger Modal with data
      setLevelUpData({
        level: newLevel,
        coins: accumulatedCoins,
        xp: accumulatedXpBonus
      });
    }

    if (Object.keys(updates).length > 0) {
      setStats(prev => ({ ...prev, ...updates }));
    }
  };

  // Watch for stats changes that might trigger passive achievements (like coins)
  useEffect(() => {
    checkProgression(stats);
  }, [stats.ecoCoins, stats.totalEnemiesDefeated, stats.totalCratesSmashed]); 

  // Check if City is Completed
  useEffect(() => {
    if (districts.length > 0 && districts.every(d => d.status === DistrictStatus.RESTORED)) {
       if (!showCityComplete) {
         setShowCityComplete(true);
       }
    }
  }, [districts]);

  const selectDistrict = async (district: District) => {
    setActiveDistrict(district);
    setBriefing("Analyzing local sensor data...");
    
    // Scroll to intel panel on mobile
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
    
    // Merge stats
    const updatedEnemies = stats.totalEnemiesDefeated + (extraStats?.enemiesDefeated || 0);
    const updatedCrates = stats.totalCratesSmashed + (extraStats?.cratesSmashed || 0);

    if (success && activeDistrict) {
      // Calculate new stats locally first to ensure atomic update logic
      const newMissionsCompleted = stats.missionsCompleted + 1;
      const newDistrictsRestored = stats.districtsRestored + 1;
      const coinReward = Math.floor(score / 2);
      
      const nextStats = {
        ...stats,
        xp: stats.xp + score,
        ecoCoins: stats.ecoCoins + coinReward,
        impactTokens: stats.impactTokens + tokensFound, // Add found tokens
        globalHealth: Math.min(100, stats.globalHealth + 5),
        missionsCompleted: newMissionsCompleted,
        districtsRestored: newDistrictsRestored,
        totalEnemiesDefeated: updatedEnemies,
        totalCratesSmashed: updatedCrates
      };

      setStats(nextStats);
      checkProgression(nextStats); // Trigger logic immediately with new state snapshot

      // Mark district as restored
      setDistricts(prev => prev.map(d => d.id === activeDistrict.id ? { ...d, status: DistrictStatus.RESTORED, pollutionLevel: 0 } : d));
      setActiveDistrict(null);
    } else {
      // Failed - just small XP for trying + save stats
      const nextStats = {
        ...stats,
        xp: stats.xp + Math.floor(score/10), 
        impactTokens: stats.impactTokens + tokensFound,
        totalEnemiesDefeated: updatedEnemies,
        totalCratesSmashed: updatedCrates
      };
      setStats(nextStats);
      checkProgression(nextStats);
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
      checkProgression(nextStats);
    }
  };

  const getLevelBorder = (level: number) => {
     if (level >= 10) return 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]';
     if (level >= 8) return 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]';
     if (level >= 6) return 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]';
     if (level >= 4) return 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)]';
     if (level >= 2) return 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)]';
     return 'border-slate-600';
  };

  // Determine Game Type
  const getGameType = (d: District): 'WATER' | 'GROUND' | 'AIR' => {
      const text = (d.name + " " + d.realWorldProblem + " " + d.description).toLowerCase();
      // Water checks
      if (text.includes("water") || text.includes("river") || text.includes("ocean") || text.includes("sea") || text.includes("port") || text.includes("bay") || text.includes("plastic") || text.includes("runoff")) return 'WATER';
      // Ground checks
      if (text.includes("park") || text.includes("forest") || text.includes("waste") || text.includes("dump") || text.includes("land") || text.includes("industrial") || text.includes("soil") || text.includes("ground")) return 'GROUND';
      // Default to Air
      return 'AIR';
  };

  const getGameLabel = (type: 'WATER' | 'GROUND' | 'AIR') => {
      if (type === 'WATER') return 'DEPLOY AQUABOT';
      if (type === 'GROUND') return 'DEPLOY ROVER';
      return 'LAUNCH DRONE';
  };

  // Render Helpers
  const getIcon = (name: string) => {
     switch(name) {
        case 'Wind': return <Wind size={20} />;
        case 'ShoppingBag': return <ShoppingBag size={20} />;
        case 'Award': return <Award size={20} />;
        case 'Zap': return <Zap size={20} />;
        case 'Flag': return <Flag size={20} />;
        case 'Crosshair': return <Crosshair size={20} />;
        case 'Truck': return <Truck size={20} />;
        default: return <Star size={20} />;
     }
  };

  // Determine which list to show in Hangar
  const currentShopList = hangarTab === 'DRONE' ? SHOP_UPGRADES : (hangarTab === 'SUB' ? SUB_UPGRADES : ROVER_UPGRADES);
  const shopThemeColor = hangarTab === 'DRONE' ? 'emerald' : (hangarTab === 'SUB' ? 'blue' : 'amber');

  // Render
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
         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500 px-4">
            <div className="relative bg-slate-900 border-2 border-emerald-400 p-6 md:p-10 rounded-2xl text-center shadow-[0_0_50px_rgba(52,211,153,0.4)] max-w-sm w-full transform animate-in zoom-in duration-300">
               <div className="absolute -top-10 -left-10 text-4xl animate-bounce delay-100">✨</div>
               <div className="absolute -bottom-5 -right-5 text-4xl animate-bounce delay-300">✨</div>
               <div className="inline-block bg-emerald-500/20 p-4 rounded-full mb-4 ring-4 ring-emerald-500">
                  <Trophy size={48} className="text-emerald-400" />
               </div>
               <h2 className="text-4xl font-black text-white font-Fredoka mb-2">LEVEL UP!</h2>
               <p className="text-emerald-400 text-xl font-bold mb-6 tracking-widest">RANK {levelUpData.level}</p>

               {/* Rewards Display */}
               <div className="grid grid-cols-2 gap-3 mb-6">
                   <div className="bg-slate-800/80 p-3 rounded-xl border border-emerald-500/20 flex flex-col items-center justify-center">
                      <span className="text-xs text-slate-400 font-bold uppercase mb-1">Bonus Cash</span>
                      <span className="text-amber-400 font-black text-xl">+{levelUpData.coins} G</span>
                   </div>
                   <div className="bg-slate-800/80 p-3 rounded-xl border border-emerald-500/20 flex flex-col items-center justify-center">
                      <span className="text-xs text-slate-400 font-bold uppercase mb-1">XP Boost</span>
                      <span className="text-purple-400 font-black text-xl">+{levelUpData.xp} XP</span>
                   </div>
               </div>

               <button 
                 onClick={() => setLevelUpData(null)}
                 className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
               >
                 AWESOME
               </button>
            </div>
         </div>
      )}

      {/* CITY COMPLETE MODAL */}
      {showCityComplete && view === 'DASHBOARD' && (
         <div className="absolute inset-0 z-[50] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-700 px-4">
            <div className="max-w-2xl w-full p-8 text-center">
                <Globe size={80} className="text-emerald-500 mx-auto mb-6 animate-pulse" />
                <h2 className="text-5xl font-black text-white font-Fredoka mb-4 tracking-tighter">CITY RESTORED</h2>
                <p className="text-xl text-slate-300 mb-8">
                  Excellent work, Operator. Air quality in <span className="text-emerald-400">{currentCity.name}</span> has returned to safe levels.
                  The local government thanks you for your service.
                </p>
                
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={travelToNextCity}
                    className="group relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-xl transition-all hover:scale-105 flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                  >
                     <Plane className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                     DEPLOY TO {CAMPAIGN_CITIES[(stats.campaignStage + 1) % CAMPAIGN_CITIES.length].name.toUpperCase()}
                  </button>
                </div>
            </div>
         </div>
      )}

      {/* ACHIEVEMENT TOAST */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-3 pointer-events-none">
         {notifications.map((ach) => (
            <div key={ach.id} className="pointer-events-auto bg-slate-800/90 backdrop-blur border-l-4 border-amber-400 p-4 rounded-r-lg shadow-2xl flex items-center gap-4 w-80 transform transition-all animate-in slide-in-from-right duration-500">
               <div className="bg-amber-400/20 p-2 rounded-full text-amber-400">
                  {getIcon(ach.icon)}
               </div>
               <div>
                  <h4 className="font-bold text-amber-400 text-sm uppercase tracking-wider">Achievement Unlocked!</h4>
                  <p className="text-white font-bold">{ach.title}</p>
                  <p className="text-slate-400 text-xs">{ach.description}</p>
               </div>
            </div>
         ))}
      </div>

      {/* GAME VIEW */}
      {view === 'GAME' && activeDistrict && (
        <>
         {getGameType(activeDistrict) === 'WATER' && (
            <WaterGame 
               district={activeDistrict}
               droneStats={getVehicleStats('SUB')} 
               onComplete={handleMissionComplete}
               onClose={() => setView('DASHBOARD')}
            />
         )}
         {getGameType(activeDistrict) === 'GROUND' && (
            <RoverGame
               district={activeDistrict}
               droneStats={getVehicleStats('ROVER')}
               onComplete={handleMissionComplete}
               onClose={() => setView('DASHBOARD')}
            />
         )}
         {getGameType(activeDistrict) === 'AIR' && (
            <DroneGame 
               district={activeDistrict}
               droneStats={getVehicleStats('DRONE')}
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
               {/* Character Avatar with Tooltip */}
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
                  <div className={`
                      absolute top-full left-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl border border-emerald-400 p-5 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.3)] 
                      text-xs origin-top-left transition-all duration-200 z-50
                      ${showPlayerInfo ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}
                  `}>
                       {/* Decorative corner accents (Emerald version) */}
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
                {/* The visible badge/button */}
                <div 
                  className="relative px-4 py-2 bg-slate-900/80 rounded-xl border border-blue-500/30 flex items-center gap-3 cursor-help transition-all duration-300 
                    hover:border-blue-400 hover:bg-blue-900/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-0.5 group"
                  onClick={() => setShowTokenInfo(!showTokenInfo)}
                >
                  {/* Icon with spin */}
                  <div className="relative">
                     <Gem size={18} className={`text-blue-400 transition-transform duration-700 group-hover:rotate-[360deg] group-hover:scale-110 group-hover:text-cyan-300 ${showTokenInfo ? 'rotate-[360deg] scale-110 text-cyan-300' : ''}`} />
                     <div className="absolute inset-0 blur-md bg-blue-500/0 group-hover:bg-blue-400/40 transition-colors duration-300 rounded-full"></div>
                  </div>
                  
                  {/* Text */}
                  <div className="flex flex-col leading-none">
                     <span className="font-mono font-black text-blue-100 text-sm group-hover:text-white transition-colors">{stats.impactTokens}</span>
                     <span className="text-[9px] uppercase text-blue-500 font-bold tracking-wider group-hover:text-blue-300 transition-colors">Tokens</span>
                  </div>
                </div>
                
                {/* Tooltip / Info Box */}
                <div className={`
                    absolute top-full right-0 mt-3 w-72 bg-slate-900/95 backdrop-blur-xl border border-blue-400 p-5 rounded-2xl shadow-[0_0_50px_rgba(37,99,235,0.3)] 
                    text-xs origin-top-right transition-all duration-200
                    ${showTokenInfo ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}
                `}>
                     {/* Decorative corner accents */}
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
              </div>
            </div>
          </header>

          {/* Main Content Grid */}
          <div className="flex-1 min-h-0 overflow-hidden relative">
            
            {/* ACHIEVEMENTS TAB */}
            {view === 'ACHIEVEMENTS' && (
               <div className="h-full overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
                     {ACHIEVEMENTS_LIST.map(ach => {
                       const isUnlocked = stats.unlockedAchievements.includes(ach.id);
                       return (
                         <div key={ach.id} className={`p-4 rounded-xl border flex items-center gap-4 transition-all
                           ${isUnlocked ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-slate-900/50 border-slate-800 grayscale opacity-60'}
                         `}>
                           <div className={`p-3 rounded-full ${isUnlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
                              {getIcon(ach.icon)}
                           </div>
                           <div>
                              <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{ach.title}</h3>
                              <p className="text-sm text-slate-400">{ach.description}</p>
                           </div>
                           {isUnlocked && <div className="ml-auto text-emerald-500"><Award size={20} /></div>}
                         </div>
                       )
                     })}
                  </div>
               </div>
            )}

            {/* HANGAR TAB */}
            {view === 'HANGAR' && (
              <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                
                {/* VEHICLE TABS */}
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                   <button 
                     onClick={() => setHangarTab('DRONE')}
                     className={`flex-1 py-4 px-2 rounded-xl border-2 font-black text-sm md:text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-2
                       ${hangarTab === 'DRONE' 
                         ? 'bg-emerald-900/40 border-emerald-500 text-emerald-400' 
                         : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}
                     `}
                   >
                      <Plane size={20} className="md:w-6 md:h-6" /> <span className="hidden md:inline">Aerial Drone</span>
                   </button>
                   <button 
                     onClick={() => setHangarTab('SUB')}
                     className={`flex-1 py-4 px-2 rounded-xl border-2 font-black text-sm md:text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-2
                       ${hangarTab === 'SUB' 
                         ? 'bg-blue-900/40 border-blue-500 text-blue-400' 
                         : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}
                     `}
                   >
                      <Anchor size={20} className="md:w-6 md:h-6" /> <span className="hidden md:inline">AquaBot</span>
                   </button>
                   <button 
                     onClick={() => setHangarTab('ROVER')}
                     className={`flex-1 py-4 px-2 rounded-xl border-2 font-black text-sm md:text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-2
                       ${hangarTab === 'ROVER' 
                         ? 'bg-amber-900/40 border-amber-500 text-amber-400' 
                         : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}
                     `}
                   >
                      <Truck size={20} className="md:w-6 md:h-6" /> <span className="hidden md:inline">Rover</span>
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                    {currentShopList.map(item => {
                      const currentLevel = stats.upgrades[item.id] || 0;
                      const isMaxed = currentLevel >= item.maxLevel;
                      const cost = Math.floor(item.cost * Math.pow(1.5, currentLevel));
                      const canAfford = stats.ecoCoins >= cost;
                      const themeColor = shopThemeColor;

                      // Tailwind hack for dynamic colors in map
                      const hoverBorderClass = themeColor === 'emerald' ? 'hover:border-emerald-500/50' : (themeColor === 'blue' ? 'hover:border-blue-500/50' : 'hover:border-amber-500/50');
                      const iconTextClass = themeColor === 'emerald' ? 'text-emerald-400 group-hover:text-white group-hover:bg-emerald-600' : (themeColor === 'blue' ? 'text-blue-400 group-hover:text-white group-hover:bg-blue-600' : 'text-amber-400 group-hover:text-white group-hover:bg-amber-600');
                      const btnBgClass = canAfford ? (themeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-500' : (themeColor === 'blue' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-amber-600 hover:bg-amber-500')) : 'bg-slate-800';

                      return (
                        <div key={item.id} className={`bg-slate-900/50 border border-slate-700 p-6 rounded-xl transition-colors group ${hoverBorderClass} flex flex-col h-full`}>
                            <div className="flex justify-between items-start mb-4">
                              <div className={`p-3 rounded-lg transition-all bg-slate-800 ${iconTextClass}`}>
                                  {item.icon === 'Wind' && <Wind size={24} />}
                                  {item.icon === 'Battery' && <Battery size={24} />}
                                  {item.icon === 'Crosshair' && <Crosshair size={24} />}
                                  {item.icon === 'Zap' && <Zap size={24} />}
                                  {item.icon === 'Shield' && <Shield size={24} />}
                              </div>
                              <div className="text-xs font-mono text-slate-500 uppercase">Lvl {currentLevel} / {item.maxLevel}</div>
                            </div>
                            
                            <h3 className="text-white font-bold text-lg mb-1">{item.name}</h3>
                            <p className="text-slate-400 text-sm mb-6 flex-grow">{item.description}</p>
                            
                            <div className="mt-auto">
                                {isMaxed ? (
                                  <button disabled className="w-full py-3 bg-slate-800 text-slate-500 font-bold rounded-lg cursor-not-allowed">MAXED OUT</button>
                                ) : (
                                  <button 
                                    onClick={() => buyUpgrade(item.id, cost)}
                                    disabled={!canAfford}
                                    className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all 
                                      ${canAfford ? `${btnBgClass} text-white` : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                                    `}
                                  >
                                    {canAfford ? 'UPGRADE' : 'INSUFFICIENT'} 
                                    <span className="text-amber-400 bg-black/20 px-2 py-0.5 rounded text-xs">{cost} G</span>
                                  </button>
                                )}
                            </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* DASHBOARD / CAMPAIGN VIEW */}
            {view === 'DASHBOARD' && (
              <div className="flex flex-col h-full gap-6 overflow-y-auto md:overflow-hidden custom-scrollbar pb-20 md:pb-0">
                  
                  {/* STATUS BAR */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                      {/* Current City Widget */}
                      <div className="bg-slate-900/50 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-4 shadow-lg relative overflow-hidden group">
                         <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400 shrink-0">
                            <Globe size={24} />
                         </div>
                         <div className="min-w-0">
                            <div className="text-xs text-emerald-500 font-bold uppercase tracking-wider truncate">Current Sector</div>
                            <div className="text-xl md:text-2xl font-black text-white truncate">{currentCity.name}</div>
                         </div>
                      </div>

                      {/* Progress Widget */}
                      <div className="bg-slate-900/50 border border-blue-500/30 p-4 rounded-2xl flex items-center gap-4 shadow-lg">
                         <div className="p-3 bg-blue-500/20 rounded-full text-blue-400 shrink-0">
                            <Activity size={24} />
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex justify-between text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">
                               <span>Restoration</span>
                               <span>{districts.filter(d => d.status === DistrictStatus.RESTORED).length}/{districts.length}</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(districts.filter(d => d.status === DistrictStatus.RESTORED).length / Math.max(1, districts.length)) * 100}%` }}></div>
                            </div>
                         </div>
                      </div>

                      {/* Global Health */}
                       <div className="bg-slate-900/50 border border-purple-500/30 p-4 rounded-2xl flex items-center gap-4 shadow-lg">
                           <div className="p-3 bg-purple-500/20 rounded-full text-purple-400 shrink-0">
                              <Activity size={24} />
                           </div>
                           <div className="min-w-0">
                              <div className="text-xs text-purple-500 font-bold uppercase tracking-wider truncate">Global Health</div>
                              <div className="text-xl md:text-2xl font-black text-white">{stats.globalHealth}%</div>
                           </div>
                       </div>
                  </div>

                  {/* MAIN CAMPAIGN AREA */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                      
                      {/* LEFT: TACTICAL MAP (UPDATED) */}
                      <div className="lg:col-span-2 flex flex-col bg-slate-900/30 rounded-3xl border border-white/5 p-4 md:p-6 relative overflow-hidden min-h-[400px] md:min-h-[500px]">
                          
                          {/* Header Overlay */}
                          <div className="flex justify-between items-start mb-4 z-10 relative pointer-events-none">
                              <div>
                                <h2 className="text-xl font-Fredoka text-white flex items-center gap-2">
                                  <Map className="text-emerald-500" /> {currentCity.name} <span className="text-slate-500 text-sm font-sans font-normal hidden sm:inline">| {currentCity.region}</span>
                                </h2>
                                <p className="text-slate-400 text-sm max-w-md mt-1 line-clamp-2">{currentCity.description}</p>
                              </div>
                          </div>

                          {/* THE NEW CITY SECTOR MAP CONTAINER */}
                          <div className="flex-1 relative rounded-xl overflow-hidden flex items-center justify-center">
                              {loadingCity ? (
                                 <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-950/80 backdrop-blur-sm rounded-xl border border-slate-800">
                                    <ScanLine size={48} className="text-emerald-500 animate-bounce mb-4" />
                                    <div className="text-emerald-400 font-mono animate-pulse tracking-widest">ACQUIRING SATELLITE LOCK...</div>
                                 </div>
                              ) : (
                                 <CitySectorMap 
                                    districts={districts}
                                    activeDistrict={activeDistrict}
                                    onSelect={selectDistrict}
                                    cityName={currentCity.name}
                                 />
                              )}
                          </div>
                      </div>

                      {/* RIGHT: DISTRICT INTEL */}
                      <div id="intel-panel" className="lg:col-span-1 h-full flex flex-col min-h-[500px] lg:min-h-0 relative">
                         
                         {/* Connecting Line Decor (Desktop Only) */}
                         {activeDistrict && (
                           <div className="hidden lg:block absolute top-1/2 -left-6 w-6 h-[2px] bg-gradient-to-r from-transparent to-emerald-500/50 z-0"></div>
                         )}

                         {activeDistrict ? (
                            <div className="flex-1 bg-slate-900 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-in slide-in-from-right duration-300 z-10">
                                {/* Header Image (Abstract Map) */}
                                <div className="h-32 md:h-40 bg-black relative overflow-hidden shrink-0">
                                    <div className="absolute inset-0 bg-emerald-900/20"></div>
                                    {/* Animated Grid Lines */}
                                    <div className="absolute inset-0 opacity-30 bg-[linear-gradient(0deg,transparent_24%,rgba(16,185,129,.3)_25%,rgba(16,185,129,.3)_26%,transparent_27%,transparent_74%,rgba(16,185,129,.3)_75%,rgba(16,185,129,.3)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(16,185,129,.3)_25%,rgba(16,185,129,.3)_26%,transparent_27%,transparent_74%,rgba(16,185,129,.3)_75%,rgba(16,185,129,.3)_76%,transparent_77%,transparent)] bg-[size:30px_30px]"></div>
                                    
                                    <div className="absolute bottom-4 left-4 right-4">
                                       <h2 className="text-xl md:text-2xl font-Fredoka font-black text-white leading-none truncate">{activeDistrict.name}</h2>
                                       <div className="flex items-center gap-2 mt-2">
                                          <a href={activeDistrict.googleMapsUri} target="_blank" rel="noreferrer" className="text-xs font-mono text-blue-400 hover:underline flex items-center gap-1">
                                             <ExternalLink size={10} /> View Intel on Maps
                                          </a>
                                       </div>
                                    </div>
                                </div>

                                {/* Briefing Content */}
                                <div className="p-4 md:p-6 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                                    <div className="mb-6">
                                       <div className="flex justify-between items-center mb-2">
                                          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Environmental Hazard</h3>
                                          <span className="text-red-400 font-mono text-xs font-bold border border-red-500/30 px-1 rounded">{activeDistrict.pollutionLevel}% TOXICITY</span>
                                       </div>
                                       <p className="text-white font-bold text-lg leading-tight mb-2">{activeDistrict.realWorldProblem}</p>
                                       <p className="text-sm text-slate-400 mb-4">{activeDistrict.description}</p>

                                       {/* EDUCATIONAL TIP - IMPROVED CARD */}
                                       {activeDistrict.educationalTip && (
                                         <div className="bg-gradient-to-br from-blue-900/40 to-slate-900 border border-blue-500/30 p-4 rounded-xl mb-6 relative overflow-hidden group hover:border-blue-400/50 transition-colors shadow-lg">
                                            <div className="absolute -right-4 -top-4 text-blue-500/10 rotate-12 transform group-hover:scale-110 transition-transform duration-700">
                                               <BookOpen size={80} />
                                            </div>
                                            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest mb-2 relative z-10">
                                               <Globe size={14} /> Real World Context
                                            </div>
                                            <p className="text-sm text-blue-100 leading-relaxed relative z-10 font-medium italic">
                                                "{activeDistrict.educationalTip}"
                                            </p>
                                         </div>
                                       )}
                                       
                                       <div className="bg-slate-800/50 p-3 rounded-lg border-l-2 border-emerald-500">
                                          <div className="text-[10px] uppercase text-emerald-500 font-bold mb-1">Mission Briefing</div>
                                          <div className="text-sm text-slate-300 italic">
                                             "{briefing || <span className="animate-pulse">Decrypting...</span>}"
                                          </div>
                                       </div>
                                    </div>

                                    <div className="mt-auto">
                                       {/* Rewards */}
                                       <div className="grid grid-cols-2 gap-2 mb-4">
                                           <div className="bg-slate-800/50 p-2 rounded text-center border border-white/5">
                                              <div className="text-xs text-slate-500 uppercase">Bounty</div>
                                              <div className="text-amber-400 font-bold">250 G</div>
                                           </div>
                                           <div className="bg-slate-800/50 p-2 rounded text-center border border-white/5">
                                              <div className="text-xs text-slate-500 uppercase">XP</div>
                                              <div className="text-purple-400 font-bold">500 XP</div>
                                           </div>
                                       </div>

                                       <div className="flex gap-2">
                                          {/* Manual Tutorial Button */}
                                          <button 
                                            onClick={() => setShowTutorial(true)}
                                            className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-white/5"
                                            title="View Tutorial"
                                          >
                                             <HelpCircle size={20} />
                                          </button>

                                          <button 
                                            onClick={launchMission}
                                            disabled={activeDistrict.status === DistrictStatus.RESTORED}
                                            className={`flex-1 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg
                                              ${activeDistrict.status === DistrictStatus.RESTORED 
                                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                                                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 hover:scale-[1.02] hover:shadow-emerald-500/25'
                                              }
                                            `}
                                          >
                                            {activeDistrict.status === DistrictStatus.RESTORED ? 'AREA SECURED' : getGameLabel(getGameType(activeDistrict))}
                                          </button>
                                       </div>
                                    </div>
                                </div>
                            </div>
                         ) : (
                            <div className="h-full border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center opacity-50 bg-slate-900/20">
                               <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                  <Target size={32} className="text-slate-600" />
                               </div>
                               <h3 className="text-xl font-bold text-slate-500 mb-2">Awaiting Coordinates</h3>
                               <p className="text-sm text-slate-600">Select a sector from the satellite map to initialize mission protocols.</p>
                            </div>
                         )}
                      </div>

                  </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
