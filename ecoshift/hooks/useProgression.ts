import { useState, useEffect } from 'react';
import { PlayerStats, Achievement } from '../types';
import { ACHIEVEMENTS_LIST, TITLES } from '../constants';

interface LevelUpData {
  level: number;
  coins: number;
  xp: number;
}

export const useProgression = (stats: PlayerStats) => {
  const [levelUpData, setLevelUpData] = useState<LevelUpData | null>(null);
  const [notifications, setNotifications] = useState<Achievement[]>([]);

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

    while (newXp >= xpNeeded) {
       newXp -= xpNeeded;
       newLevel++;
       
       accumulatedCoins += newLevel * 150; 
       accumulatedXpBonus += newLevel * 50;

       xpNeeded = Math.floor(xpNeeded * 1.5);
    }

    if (newLevel !== currentStats.level) {
      updates.level = newLevel;
      updates.xp = newXp + accumulatedXpBonus;
      updates.xpToNextLevel = xpNeeded;
      updates.title = TITLES[Math.min(newLevel - 1, TITLES.length - 1)] || 'Legendary Guardian';
      updates.ecoCoins = currentStats.ecoCoins + accumulatedCoins;

      setLevelUpData({
        level: newLevel,
        coins: accumulatedCoins,
        xp: accumulatedXpBonus
      });
    }

    return updates;
  };

  // Note: checkProgression should be called manually when stats change
  // This hook just provides the function and manages modal/notification state

  return {
    checkProgression,
    levelUpData,
    setLevelUpData,
    notifications
  };
};

