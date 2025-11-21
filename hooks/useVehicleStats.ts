import { useMemo } from 'react';
import { PlayerStats, DroneStats, DistrictUpgrade } from '../types';
import { SHOP_UPGRADES, SUB_UPGRADES, ROVER_UPGRADES } from '../constants/upgrades';

export const useVehicleStats = (
  stats: PlayerStats,
  type: 'DRONE' | 'SUB' | 'ROVER'
): DroneStats => {
  return useMemo(() => {
    let baseStats: DroneStats = {
      speed: 1,
      battery: 100,
      filterRadius: 50,
      hull: 100,
      empRadius: 0
    };
    
    // Select correct upgrade list
    let upgradeList: DistrictUpgrade[] = SHOP_UPGRADES;
    if (type === 'SUB') upgradeList = SUB_UPGRADES;
    if (type === 'ROVER') upgradeList = ROVER_UPGRADES;

    upgradeList.forEach(up => {
      const level = stats.upgrades[up.id] || 0;
      if (level > 0 && up.statEffect) {
        // Apply upgrade effects
        if (up.statEffect.speed) baseStats.speed += (up.statEffect.speed - 1) * level;
        if (up.statEffect.battery) baseStats.battery += (up.statEffect.battery - 100) * level;
        if (up.statEffect.filterRadius) baseStats.filterRadius *= (1 + (0.2 * level));
        if (up.statEffect.hull) baseStats.hull *= (1 + (0.2 * level));
        if (up.statEffect.empRadius) baseStats.empRadius = 150;
      }
    });

    // Rover base stat adjustments
    if (type === 'ROVER') {
       baseStats.speed *= 0.8;
       baseStats.hull *= 1.5;
    }

    return baseStats;
  }, [stats.upgrades, type]);
};

