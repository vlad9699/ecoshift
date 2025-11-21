import { District } from '../types';

export type GameType = 'WATER' | 'GROUND' | 'AIR';

export const getGameType = (district: District): GameType => {
  const text = (district.name + " " + district.realWorldProblem + " " + district.description).toLowerCase();
  
  // Water checks
  if (text.includes("water") || text.includes("river") || text.includes("ocean") || 
      text.includes("sea") || text.includes("port") || text.includes("bay") || 
      text.includes("plastic") || text.includes("runoff")) {
    return 'WATER';
  }
  
  // Ground checks
  if (text.includes("park") || text.includes("forest") || text.includes("waste") || 
      text.includes("dump") || text.includes("land") || text.includes("industrial") || 
      text.includes("soil") || text.includes("ground")) {
    return 'GROUND';
  }
  
  // Default to Air
  return 'AIR';
};

export const getGameLabel = (type: GameType): string => {
  if (type === 'WATER') return 'DEPLOY AQUABOT';
  if (type === 'GROUND') return 'DEPLOY ROVER';
  return 'LAUNCH DRONE';
};

