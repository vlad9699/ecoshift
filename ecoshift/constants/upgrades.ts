import { DistrictUpgrade } from '../types';

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
    icon: 'Wind',
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
    statEffect: { empRadius: 150 },
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
    statEffect: { empRadius: 150 },
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

