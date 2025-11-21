import React from 'react';
import { Achievement } from '../../types';
import { Wind, ShoppingBag, Award, Zap, Flag, Crosshair, Truck, Star } from 'lucide-react';

interface AchievementToastProps {
  achievement: Achievement;
}

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

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement }) => {
  return (
    <div className="pointer-events-auto bg-slate-800/90 backdrop-blur border-l-4 border-amber-400 p-4 rounded-r-lg shadow-2xl flex items-center gap-4 w-80 transform transition-all animate-in slide-in-from-right duration-500">
      <div className="bg-amber-400/20 p-2 rounded-full text-amber-400">
        {getIcon(achievement.icon)}
      </div>
      <div>
        <h4 className="font-bold text-amber-400 text-sm uppercase tracking-wider">Achievement Unlocked!</h4>
        <p className="text-white font-bold">{achievement.title}</p>
        <p className="text-slate-400 text-xs">{achievement.description}</p>
      </div>
    </div>
  );
};

