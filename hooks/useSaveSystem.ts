import { useEffect } from 'react';
import { PlayerStats, District, CampaignCity } from '../types';

const SAVE_KEY = 'ECOSHIFT_SAVE_DATA_V1';

export const useSaveSystem = (stats: PlayerStats, districts: District[], currentCityName?: string, campaignCities?: CampaignCity[]) => {
  useEffect(() => {
    const saveData: any = {
      stats,
      districts,
      timestamp: Date.now()
    };
    
    // Save current city name to ensure consistency
    if (currentCityName) {
      saveData.currentCityName = currentCityName;
    }
    
    // Save campaign cities if provided
    if (campaignCities && campaignCities.length > 0) {
      saveData.campaignCities = campaignCities;
    }
    
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  }, [stats, districts, currentCityName, campaignCities]);
};

export const resetProgress = () => {
  if (window.confirm("Are you sure you want to reset ALL progress? This cannot be undone.")) {
    localStorage.removeItem(SAVE_KEY);
    window.location.reload();
  }
};

