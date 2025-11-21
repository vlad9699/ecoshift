import { Achievement } from '../types';

// Note: Titles and descriptions are now handled via translations in Achievements component
// This file only defines the structure and IDs
export const ACHIEVEMENTS_LIST: Achievement[] = [
  { 
    id: 'first_steps', 
    title: 'First Steps', // Fallback, will be replaced by translation
    description: 'Complete your first mission successfully.', // Fallback, will be replaced by translation
    icon: 'Flag', 
    unlocked: false 
  },
  { 
    id: 'rich_operator', 
    title: 'Well Funded', // Fallback, will be replaced by translation
    description: 'Accumulate 1500 EcoCoins.', // Fallback, will be replaced by translation
    icon: 'ShoppingBag', 
    unlocked: false 
  },
  { 
    id: 'veteran', 
    title: 'Veteran Pilot', // Fallback, will be replaced by translation
    description: 'Reach Level 3.', // Fallback, will be replaced by translation
    icon: 'Award', 
    unlocked: false 
  },
  { 
    id: 'clean_machine', 
    title: 'Clean Machine', // Fallback, will be replaced by translation
    description: 'Restore 3 full districts.', // Fallback, will be replaced by translation
    icon: 'Wind', 
    unlocked: false 
  },
  { 
    id: 'tech_junkie', 
    title: 'Tech Junkie', // Fallback, will be replaced by translation
    description: 'Purchase 5 upgrades.', // Fallback, will be replaced by translation
    icon: 'Zap', 
    unlocked: false 
  },
  {
    id: 'scrap_collector',
    title: 'Scrap Collector', // Fallback, will be replaced by translation
    description: 'Destroy 10 automated defenses in Rover missions.', // Fallback, will be replaced by translation
    icon: 'Crosshair',
    unlocked: false
  },
  {
    id: 'wrecking_crew',
    title: 'Wrecking Crew', // Fallback, will be replaced by translation
    description: 'Smash 25 supply crates with the Rover.', // Fallback, will be replaced by translation
    icon: 'Truck',
    unlocked: false
  }
];

