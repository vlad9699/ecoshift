import React from 'react';
import { PlayerStats } from '../../types';
import { ACHIEVEMENTS_LIST } from '../../constants';
import { Award } from 'lucide-react';
import { getIcon } from '../../utils/iconUtils';
import { useLanguage } from '../../i18n';

interface AchievementsProps {
  stats: PlayerStats;
}

const getAchievementTranslation = (id: string, t: any) => {
  switch (id) {
    case 'first_steps':
      return { title: t.achievements.firstSteps.title, description: t.achievements.firstSteps.description };
    case 'rich_operator':
      return { title: t.achievements.wellFunded.title, description: t.achievements.wellFunded.description };
    case 'veteran':
      return { title: t.achievements.veteranPilot.title, description: t.achievements.veteranPilot.description };
    case 'clean_machine':
      return { title: t.achievements.cleanMachine.title, description: t.achievements.cleanMachine.description };
    case 'tech_junkie':
      return { title: t.achievements.techJunkie.title, description: t.achievements.techJunkie.description };
    case 'scrap_collector':
      return { title: t.achievements.scrapCollector.title, description: t.achievements.scrapCollector.description };
    case 'wrecking_crew':
      return { title: t.achievements.wreckingCrew.title, description: t.achievements.wreckingCrew.description };
    default:
      return { title: '', description: '' };
  }
};

export const Achievements: React.FC<AchievementsProps> = ({ stats }) => {
  const { t } = useLanguage();
  
  return (
    <div className="h-full overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-20">
        {ACHIEVEMENTS_LIST.map(ach => {
          const isUnlocked = stats.unlockedAchievements.includes(ach.id);
          const translation = getAchievementTranslation(ach.id, t);
          return (
            <div key={ach.id} className={`p-4 rounded-xl border flex items-center gap-4 transition-all
              ${isUnlocked ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-slate-900/50 border-slate-800 grayscale opacity-60'}
            `}>
              <div className={`p-3 rounded-full ${isUnlocked ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-600'}`}>
                {getIcon(ach.icon)}
              </div>
              <div>
                <h3 className={`font-bold ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>{translation.title}</h3>
                <p className="text-sm text-slate-400">{translation.description}</p>
              </div>
              {isUnlocked && <div className="ml-auto text-emerald-500"><Award size={20} /></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

