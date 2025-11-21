import { useState, useEffect } from 'react';
import { District } from '../types';

const SAVE_KEY = 'ECOSHIFT_SAVE_DATA_V1';

export const useDistricts = () => {
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

  return { districts, setDistricts };
};

