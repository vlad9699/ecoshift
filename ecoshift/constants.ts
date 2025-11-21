
import { District, DistrictType, DistrictStatus, Achievement, DistrictUpgrade, CampaignCity } from './types';

export const CAMPAIGN_CITIES: CampaignCity[] = [
  {
    name: "San Francisco",
    region: "North America",
    description: "A coastal tech hub struggling with urban smog and microplastic runoff in the bay.",
    difficulty: 1
  },
  {
    name: "London",
    region: "Europe",
    description: "Historic industrial zones and heavy traffic congestion creating particulate hotspots.",
    difficulty: 1.2
  },
  {
    name: "Mumbai",
    region: "Asia",
    description: "Rapid urbanization leading to critical air quality levels and waste management challenges.",
    difficulty: 1.5
  },
  {
    name: "Tokyo",
    region: "Asia",
    description: "Dense neon metropolis requiring precision cleaning of high-altitude smog layers.",
    difficulty: 1.8
  },
  {
    name: "São Paulo",
    region: "South America",
    description: "Industrial sectors bordering the rainforest need immediate detoxification.",
    difficulty: 2.0
  }
];

export const INITIAL_DISTRICTS: District[] = []; // Now generated dynamically

export const SHOP_UPGRADES: DistrictUpgrade[] = [
  {
    id: 'eng_1',
    name: 'Ion Thrusters',
    cost: 150,
    description: 'Increases aerial flight speed by 20%.',
    icon: 'Wind',
    statEffect: { speed: 1.5 },
    maxLevel: 5
  },
  {
    id: 'bat_1',
    name: 'Graphene Battery',
    cost: 200,
    description: 'Increases drone max energy capacity.',
    icon: 'Battery',
    statEffect: { battery: 120 },
    maxLevel: 5
  },
  {
    id: 'fil_1',
    name: 'Vortex Filter',
    cost: 300,
    description: 'Widens the intake radius to collect smog faster.',
    icon: 'Crosshair',
    statEffect: { filterRadius: 1.2 },
    maxLevel: 3
  },
  {
    id: 'emp_1',
    name: 'Pulse Emitter',
    cost: 500,
    description: 'Unlocks EMP Blast (Spacebar) to destroy chasing seekers.',
    icon: 'Zap',
    statEffect: { empRadius: 150 },
    maxLevel: 1
  },
  {
    id: 'hull_1',
    name: 'Titanium Plating',
    cost: 250,
    description: 'Reinforces drone hull to withstand collision damage.',
    icon: 'Shield',
    statEffect: { hull: 1.5 },
    maxLevel: 3
  }
];

export const SUB_UPGRADES: DistrictUpgrade[] = [
  {
    id: 'sub_eng_1',
    name: 'Hydro-Jet Turbine',
    cost: 150,
    description: 'Increases underwater propulsion speed.',
    icon: 'Wind', // Reusing icons for now, ideally anchor or wave
    statEffect: { speed: 1.5 },
    maxLevel: 5
  },
  {
    id: 'sub_bat_1',
    name: 'O2 Scrubber / Power',
    cost: 200,
    description: 'Increases mission time underwater.',
    icon: 'Battery',
    statEffect: { battery: 120 }, 
    maxLevel: 5
  },
  {
    id: 'sub_fil_1',
    name: 'Suction Net',
    cost: 300,
    description: 'Widens the collection radius for ocean waste.',
    icon: 'Crosshair',
    statEffect: { filterRadius: 1.2 },
    maxLevel: 3
  },
  {
    id: 'sub_sonar_1',
    name: 'Active Sonar',
    cost: 500,
    description: 'Unlocks Sonar Pulse (Spacebar) to pull items from afar.',
    icon: 'Zap',
    statEffect: { empRadius: 150 }, // Reusing empRadius property for Sonar range
    maxLevel: 1
  },
  {
    id: 'sub_hull_1',
    name: 'Pressure Hull',
    cost: 250,
    description: 'Reinforces submarine against mines and rocks.',
    icon: 'Shield',
    statEffect: { hull: 1.5 },
    maxLevel: 3
  }
];

export const ROVER_UPGRADES: DistrictUpgrade[] = [
  {
    id: 'rov_eng_1',
    name: 'V8 Hybrid Engine',
    cost: 150,
    description: 'Increases rover movement speed and torque.',
    icon: 'Wind',
    statEffect: { speed: 1.2 },
    maxLevel: 5
  },
  {
    id: 'rov_bat_1',
    name: 'Auxiliary Fuel Cells',
    cost: 200,
    description: 'Increases fuel capacity.',
    icon: 'Battery',
    statEffect: { battery: 120 },
    maxLevel: 5
  },
  {
    id: 'rov_col_1',
    name: 'Magnetic Plow',
    cost: 300,
    description: 'Widens range to collect samples and crates.',
    icon: 'Crosshair',
    statEffect: { filterRadius: 1.2 },
    maxLevel: 3
  },
  {
    id: 'rov_turret_1',
    name: 'Rapid Fire Protocol',
    cost: 500,
    description: 'Optimization algorithms for faster turret reload.',
    icon: 'Zap',
    statEffect: { empRadius: 150 }, // Used for fire rate check
    maxLevel: 1
  },
  {
    id: 'rov_hull_1',
    name: 'Reactive Armor',
    cost: 250,
    description: 'Reinforces hull against enemy projectiles.',
    icon: 'Shield',
    statEffect: { hull: 1.5 },
    maxLevel: 3
  }
];

export const TITLES = ['Novice Eco-Warrior', 'Green Mentor', 'Eco Architect', 'Gaia Guardian', 'Planet Savior'];

export const ACHIEVEMENTS_LIST: Achievement[] = [
  { 
    id: 'first_steps', 
    title: 'First Steps', 
    description: 'Complete your first mission successfully.', 
    icon: 'Flag', 
    unlocked: false 
  },
  { 
    id: 'rich_operator', 
    title: 'Well Funded', 
    description: 'Accumulate 1500 EcoCoins.', 
    icon: 'ShoppingBag', 
    unlocked: false 
  },
  { 
    id: 'veteran', 
    title: 'Veteran Pilot', 
    description: 'Reach Level 3.', 
    icon: 'Award', 
    unlocked: false 
  },
  { 
    id: 'clean_machine', 
    title: 'Clean Machine', 
    description: 'Restore 3 full districts.', 
    icon: 'Wind', 
    unlocked: false 
  },
  { 
    id: 'tech_junkie', 
    title: 'Tech Junkie', 
    description: 'Purchase 5 upgrades.', 
    icon: 'Zap', 
    unlocked: false 
  },
  {
    id: 'scrap_collector',
    title: 'Scrap Collector',
    description: 'Destroy 10 automated defenses in Rover missions.',
    icon: 'Crosshair',
    unlocked: false
  },
  {
    id: 'wrecking_crew',
    title: 'Wrecking Crew',
    description: 'Smash 25 supply crates with the Rover.',
    icon: 'Truck',
    unlocked: false
  }
];
