import React from 'react';
import { Trophy } from 'lucide-react';
import { useLanguage } from '../../i18n';

interface LevelUpModalProps {
  level: number;
  coins: number;
  xp: number;
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, coins, xp, onClose }) => {
  const { t } = useLanguage();
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-500 px-4">
      <div className="relative bg-slate-900 border-2 border-emerald-400 p-6 md:p-10 rounded-2xl text-center shadow-[0_0_50px_rgba(52,211,153,0.4)] max-w-sm w-full transform animate-in zoom-in duration-300">
        <div className="absolute -top-10 -left-10 text-4xl animate-bounce delay-100">✨</div>
        <div className="absolute -bottom-5 -right-5 text-4xl animate-bounce delay-300">✨</div>
        <div className="inline-block bg-emerald-500/20 p-4 rounded-full mb-4 ring-4 ring-emerald-500">
          <Trophy size={48} className="text-emerald-400" />
        </div>
        <h2 className="text-4xl font-black text-white font-Fredoka mb-2">{t.modals.levelUp.title}</h2>
        <p className="text-emerald-400 text-xl font-bold mb-6 tracking-widest">{t.modals.levelUp.rank} {level}</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-emerald-500/20 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-400 font-bold uppercase mb-1">{t.modals.levelUp.bonusCash}</span>
            <span className="text-amber-400 font-black text-xl">+{coins} G</span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-emerald-500/20 flex flex-col items-center justify-center">
            <span className="text-xs text-slate-400 font-bold uppercase mb-1">{t.modals.levelUp.xpBoost}</span>
            <span className="text-purple-400 font-black text-xl">+{xp} {t.player.xp}</span>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg"
        >
          {t.modals.levelUp.awesome}
        </button>
      </div>
    </div>
  );
};

