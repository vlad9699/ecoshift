import React, { useState } from 'react';
import { PlayerStats, DistrictUpgrade } from '../../types';
import { SHOP_UPGRADES, SUB_UPGRADES, ROVER_UPGRADES } from '../../constants';
import { Plane, Anchor, Truck, Wind, Battery, Crosshair, Zap, Shield } from 'lucide-react';
import { useLanguage } from '../../i18n';

interface HangarProps {
  stats: PlayerStats;
  onBuyUpgrade: (upgradeId: string, cost: number) => void;
}

const getUpgradeTranslation = (id: string, t: any) => {
  const translations: Record<string, { name: string; description: string }> = {
    'eng_1': t.hangar.ionThrusters,
    'bat_1': t.hangar.grapheneBattery,
    'fil_1': t.hangar.vortexFilter,
    'emp_1': t.hangar.pulseEmitter,
    'hull_1': t.hangar.titaniumPlating,
    'sub_eng_1': t.hangar.hydroJetTurbine,
    'sub_bat_1': t.hangar.o2Scrubber,
    'sub_fil_1': t.hangar.suctionNet,
    'sub_sonar_1': t.hangar.activeSonar,
    'sub_hull_1': t.hangar.pressureHull,
    'rov_eng_1': t.hangar.v8HybridEngine,
    'rov_bat_1': t.hangar.auxiliaryFuelCells,
    'rov_col_1': t.hangar.magneticPlow,
    'rov_turret_1': t.hangar.rapidFireProtocol,
    'rov_hull_1': t.hangar.reactiveArmor,
  };
  return translations[id] || { name: '', description: '' };
};

export const Hangar: React.FC<HangarProps> = ({ stats, onBuyUpgrade }) => {
  const { t } = useLanguage();
  const [hangarTab, setHangarTab] = useState<'DRONE' | 'SUB' | 'ROVER'>('DRONE');

  const currentShopList = hangarTab === 'DRONE' ? SHOP_UPGRADES : (hangarTab === 'SUB' ? SUB_UPGRADES : ROVER_UPGRADES);
  const shopThemeColor = hangarTab === 'DRONE' ? 'emerald' : (hangarTab === 'SUB' ? 'blue' : 'amber');

  return (
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
          <Plane size={20} className="md:w-6 md:h-6" /> <span className="hidden md:inline">{t.hangar.aerialDrone}</span>
        </button>
        <button 
          onClick={() => setHangarTab('SUB')}
          className={`flex-1 py-4 px-2 rounded-xl border-2 font-black text-sm md:text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-2
            ${hangarTab === 'SUB' 
              ? 'bg-blue-900/40 border-blue-500 text-blue-400' 
              : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}
          `}
        >
          <Anchor size={20} className="md:w-6 md:h-6" /> <span className="hidden md:inline">{t.hangar.aquaBot}</span>
        </button>
        <button 
          onClick={() => setHangarTab('ROVER')}
          className={`flex-1 py-4 px-2 rounded-xl border-2 font-black text-sm md:text-lg uppercase tracking-widest transition-all flex items-center justify-center gap-2
            ${hangarTab === 'ROVER' 
              ? 'bg-amber-900/40 border-amber-500 text-amber-400' 
              : 'bg-slate-900/40 border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}
          `}
        >
          <Truck size={20} className="md:w-6 md:h-6" /> <span className="hidden md:inline">{t.hangar.rover}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {currentShopList.map(item => {
            const currentLevel = stats.upgrades[item.id] || 0;
            const isMaxed = currentLevel >= item.maxLevel;
            const cost = Math.floor(item.cost * Math.pow(1.5, currentLevel));
            const canAfford = stats.ecoCoins >= cost;
            const translation = getUpgradeTranslation(item.id, t);

            const hoverBorderClass = shopThemeColor === 'emerald' ? 'hover:border-emerald-500/50' : (shopThemeColor === 'blue' ? 'hover:border-blue-500/50' : 'hover:border-amber-500/50');
            const iconTextClass = shopThemeColor === 'emerald' ? 'text-emerald-400 group-hover:text-white group-hover:bg-emerald-600' : (shopThemeColor === 'blue' ? 'text-blue-400 group-hover:text-white group-hover:bg-blue-600' : 'text-amber-400 group-hover:text-white group-hover:bg-amber-600');
            const btnBgClass = canAfford ? (shopThemeColor === 'emerald' ? 'bg-emerald-600 hover:bg-emerald-500' : (shopThemeColor === 'blue' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-amber-600 hover:bg-amber-500')) : 'bg-slate-800';

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
                  <div className="text-xs font-mono text-slate-500 uppercase">{t.hangar.lvl} {currentLevel} / {item.maxLevel}</div>
                </div>
                
                <h3 className="text-white font-bold text-lg mb-1">{translation.name || item.name}</h3>
                <p className="text-slate-400 text-sm mb-6 flex-grow">{translation.description || item.description}</p>
                
                <div className="mt-auto">
                  {isMaxed ? (
                    <button disabled className="w-full py-3 bg-slate-800 text-slate-500 font-bold rounded-lg cursor-not-allowed">{t.hangar.maxedOut}</button>
                  ) : (
                    <button 
                      onClick={() => onBuyUpgrade(item.id, cost)}
                      disabled={!canAfford}
                      className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all 
                        ${canAfford ? `${btnBgClass} text-white` : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                      `}
                    >
                      {canAfford ? t.hangar.upgrade : t.hangar.insufficient} 
                      <span className="text-amber-400 bg-black/20 px-2 py-0.5 rounded text-xs">{cost} G</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

