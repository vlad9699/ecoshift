
export enum DistrictStatus {
  SCANNED = 'SCANNED',    // Found by satellite
  ACTIVE = 'ACTIVE',      // Currently working on
  RESTORED = 'RESTORED',  // Finished
  POLLUTED = 'POLLUTED',  // Added for predefined districts
  LOCKED = 'LOCKED'       // Added for predefined districts
}

export enum DistrictType {
  WATERFRONT = 'WATERFRONT',
  RESIDENTIAL = 'RESIDENTIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  PARK = 'PARK',
  DOWNTOWN = 'DOWNTOWN'
}

export interface DistrictUpgrade {
  id: string;
  name: string;
  cost: number;
  description: string;
  icon: string;
  statEffect: Partial<DroneStats>;
  maxLevel: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface District {
  id: string;
  name: string;       // Real name from Maps
  realAddress?: string; // Optional for predefined levels
  googleMapsUri?: string; // Link to real map
  pollutionLevel: number; // 0-100
  status: DistrictStatus;
  description?: string; // AI analysis of real problems
  realWorldProblem?: string; // Specific issue (e.g. "PM2.5 High")
  educationalTip?: string; // New field for real-world solutions/facts
  coordinates?: {
    lat: number;
    lng: number;
  };
  gridIndex?: number; // Position on the minimap
  mapPath?: string; // SVG path data for the map sector
  type?: DistrictType;
  imageUrl?: string;
  costToUnlock?: number;
  installedUpgrades?: string[];
}

export interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  ecoCoins: number;
  impactTokens: number; // New Premium Currency
  globalHealth: number;
  title: string;
  // Map of upgrade ID to current level
  upgrades: Record<string, number>;
  
  // New Progression Stats
  unlockedAchievements: string[];
  missionsCompleted: number;
  districtsRestored: number;
  campaignStage: number; // Index of current city
  
  tutorialSeen: boolean; // Tracks if player has seen the tutorial

  // Combat / Rover Stats
  totalEnemiesDefeated: number;
  totalCratesSmashed: number;
}

export interface DroneStats {
  speed: number;        // Movement speed
  battery: number;      // Max Energy
  filterRadius: number; // Collection range
  hull: number;         // Health
  empRadius: number;    // Special ability range
}

export interface CampaignCity {
  name: string;
  region: string;
  description: string;
  difficulty: number;
  // AI-generated pollution information
  pollutionInfo?: {
    mainPollutants: string[]; // e.g., ["PM2.5", "NO2", "Microplastics"]
    pollutionLevel: string; // e.g., "Critical", "High", "Moderate"
    airQualityIndex?: number; // AQI value if available
    waterQuality?: string; // Water quality status
    environmentalFacts: string[]; // Educational facts about pollution in this city
    realWorldImpact: string; // Description of real-world environmental impact
    solutions?: string[]; // Real-world solutions being implemented
  };
}

export const TITLES = ['Drone Operator', 'Sector Manager', 'Global Architect', 'Planetary Guardian'];
