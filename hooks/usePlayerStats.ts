import { useState, useEffect } from 'react';
import { PlayerStats } from '../types';

const SAVE_KEY = 'ECOSHIFT_SAVE_DATA_V1';

export const DEFAULT_STATS: PlayerStats = {
  level: 1,
  xp: 0,
  xpToNextLevel: 1000,
  ecoCoins: 500,
  impactTokens: 0,
  globalHealth: 50,
  title: 'Novice Eco-Warrior',
  upgrades: {},
  unlockedAchievements: [],
  missionsCompleted: 0,
  districtsRestored: 0,
  campaignStage: 0,
  tutorialSeen: false,
  totalEnemiesDefeated: 0,
  totalCratesSmashed: 0
};

export const usePlayerStats = () => {
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

  return { stats, setStats };
};

