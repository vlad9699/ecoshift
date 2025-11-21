export type Language = 'en' | 'uk';

export interface Translations {
  // Common
  common: {
    loading: string;
    close: string;
    confirm: string;
    cancel: string;
    continue: string;
    back: string;
  };
  
  // Navigation
  nav: {
    dashboard: string;
    hangar: string;
    achievements: string;
    settings: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    selectCity: string;
    selectDistrict: string;
    startMission: string;
    missionBriefing: string;
    pollutionLevel: string;
    status: string;
    restored: string;
    active: string;
    scanned: string;
    locked: string;
    learnMore: string;
    noDistricts: string;
    currentSector: string;
    restoration: string;
    globalHealth: string;
    analyzingData: string;
    environmentalStatusReport: string;
    mainPollutants: string;
    airQualityIndex: string;
    waterQuality: string;
    environmentalFacts: string;
    realWorldImpact: string;
    solutions: string;
    awaitingCoordinates: string;
    selectSector: string;
    environmentalHazard: string;
    toxicity: string;
    realWorldContext: string;
    viewIntelOnMaps: string;
    gameType: string;
    showTutorial: string;
    decrypting: string;
    bounty: string;
    areaSecured: string;
    viewTutorial: string;
  };
  
  // Game
  game: {
    missionAccomplished: string;
    signalLost: string;
    sectorStabilized: string;
    emergencyRecovery: string;
    collectReward: string;
    returnToHangar: string;
    whyThisMatters: string;
    loadingAwarenessTip: string;
    defaultAwarenessTip: string;
    controls: string;
    boost: string;
    empBlast: string;
    sonar: string;
    space: string;
    shift: string;
    pollutantsCleared: string;
    tokensSecured: string;
    rareItemsDiscovered: string;
    impactTokens: string;
    sectorSecured: string;
    criticalFailure: string;
    areaRestored: string;
    pointsCollected: string;
    roverSignalLost: string;
    completeMission: string;
    abortMission: string;
    oceanCleared: string;
    hullBreached: string;
    surfaceReport: string;
    emergencySurface: string;
    hull: string;
    armor: string;
    energy: string;
    fuelCell: string;
    oxygenPower: string;
    target: string;
    oceanCleanup: string;
  };
  
  // Hangar
  hangar: {
    title: string;
    upgrades: string;
    purchase: string;
    purchased: string;
    insufficientFunds: string;
    level: string;
    maxLevel: string;
    aerialDrone: string;
    aquaBot: string;
    rover: string;
    lvl: string;
    maxedOut: string;
    upgrade: string;
    insufficient: string;
    // Drone upgrades
    ionThrusters: {
      name: string;
      description: string;
    };
    grapheneBattery: {
      name: string;
      description: string;
    };
    vortexFilter: {
      name: string;
      description: string;
    };
    pulseEmitter: {
      name: string;
      description: string;
    };
    titaniumPlating: {
      name: string;
      description: string;
    };
    // Sub upgrades
    hydroJetTurbine: {
      name: string;
      description: string;
    };
    o2Scrubber: {
      name: string;
      description: string;
    };
    suctionNet: {
      name: string;
      description: string;
    };
    activeSonar: {
      name: string;
      description: string;
    };
    pressureHull: {
      name: string;
      description: string;
    };
    // Rover upgrades
    v8HybridEngine: {
      name: string;
      description: string;
    };
    auxiliaryFuelCells: {
      name: string;
      description: string;
    };
    magneticPlow: {
      name: string;
      description: string;
    };
    rapidFireProtocol: {
      name: string;
      description: string;
    };
    reactiveArmor: {
      name: string;
      description: string;
    };
  };
  
  // Achievements
  achievements: {
    title: string;
    unlocked: string;
    locked: string;
    progress: string;
    firstSteps: {
      title: string;
      description: string;
    };
    wellFunded: {
      title: string;
      description: string;
    };
    veteranPilot: {
      title: string;
      description: string;
    };
    cleanMachine: {
      title: string;
      description: string;
    };
    techJunkie: {
      title: string;
      description: string;
    };
    scrapCollector: {
      title: string;
      description: string;
    };
    wreckingCrew: {
      title: string;
      description: string;
    };
  };
  
  // Modals
  modals: {
    levelUp: {
      title: string;
      congratulations: string;
      newLevel: string;
      rewards: string;
      coinsEarned: string;
      xpEarned: string;
      rank: string;
      bonusCash: string;
      xpBoost: string;
      awesome: string;
    };
    cityComplete: {
      title: string;
      congratulations: string;
      cityRestored: string;
      nextCity: string;
      returnToMap: string;
      excellentWork: string;
      deployTo: string;
    };
    tutorial: {
      aerialOperations: {
        title: string;
        description: string;
        collect: string;
        avoid: string;
      };
      flightControls: {
        title: string;
        description: string;
        boost: string;
        empBlast: string;
      };
      deepSeaOps: {
        title: string;
        description: string;
        collect: string;
        danger: string;
      };
      submersibleControls: {
        title: string;
        description: string;
        turboProp: string;
        sonar: string;
      };
      roverOperations: {
        title: string;
        description: string;
        destroyCrates: string;
        combat: string;
      };
      drivingManual: {
        title: string;
        description: string;
        fireWeapon: string;
        tip: string;
      };
      moveVehicle: string;
      aimSteer: string;
      back: string;
      next: string;
      startMission: string;
    };
  };
  
  // Player Stats
  player: {
    level: string;
    xp: string;
    coins: string;
    tokens: string;
    title: string;
    missionsCompleted: string;
    districtsRestored: string;
    currentRank: string;
    progression: string;
    missions: string;
    restored: string;
    resetData: string;
    operator: string;
  };
  
  // Settings
  settings: {
    language: string;
    english: string;
    ukrainian: string;
  };
  
  // Impact Tokens
  tokens: {
    impactToken: string;
    tokens: string;
    useTokenDescription: string;
    donateToCauses: string;
    inGameCurrency: string;
    rewardsFromPartners: string;
    plantRealTree: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    common: {
      loading: 'Loading',
      close: 'Close',
      confirm: 'Confirm',
      cancel: 'Cancel',
      continue: 'Continue',
      back: 'Back',
    },
    nav: {
      dashboard: 'Dashboard',
      hangar: 'Hangar',
      achievements: 'Achievements',
      settings: 'Settings',
    },
    dashboard: {
      title: 'Mission Control',
      selectCity: 'Select City',
      selectDistrict: 'Select District',
      startMission: 'Start Mission',
      missionBriefing: 'Mission Briefing',
      pollutionLevel: 'Pollution Level',
      status: 'Status',
      restored: 'Restored',
      active: 'Active',
      scanned: 'Scanned',
      locked: 'Locked',
      learnMore: 'Learn More',
      noDistricts: 'No districts available',
      currentSector: 'Current Sector',
      restoration: 'Restoration',
      globalHealth: 'Global Health',
      analyzingData: 'Analyzing environmental data...',
      environmentalStatusReport: 'Environmental Status Report',
      mainPollutants: 'Main Pollutants',
      airQualityIndex: 'Air Quality Index',
      waterQuality: 'Water Quality',
      environmentalFacts: 'Environmental Facts',
      realWorldImpact: 'Real-World Impact',
      solutions: 'Solutions',
      awaitingCoordinates: 'Awaiting Coordinates',
      selectSector: 'Select a sector from the satellite map to initialize mission protocols.',
      environmentalHazard: 'Environmental Hazard',
      toxicity: 'TOXICITY',
      realWorldContext: 'Real World Context',
      viewIntelOnMaps: 'View Intel on Maps',
      gameType: 'Game Type',
      showTutorial: 'Show Tutorial',
      decrypting: 'Decrypting...',
      bounty: 'Bounty',
      areaSecured: 'AREA SECURED',
      viewTutorial: 'View Tutorial',
    },
    game: {
      missionAccomplished: 'MISSION ACCOMPLISHED',
      signalLost: 'SIGNAL LOST',
      sectorStabilized: 'Sector {name} has been stabilized. Great work, Operator.',
      emergencyRecovery: 'Drone telemetry critical. Emergency recovery initiated.',
      collectReward: 'Collect Reward',
      returnToHangar: 'Return to Hangar',
      whyThisMatters: 'Why This Matters',
      loadingAwarenessTip: 'Loading awareness tip...',
      defaultAwarenessTip: 'Every cleanup mission helps protect our planet for future generations. Your actions make a real difference!',
      controls: 'CONTROLS',
      boost: 'BOOST',
      empBlast: 'EMP BLAST',
      sonar: 'SONAR',
      space: 'SPACE',
      shift: 'SHIFT',
      pollutantsCleared: 'Pollutants Cleared',
      tokensSecured: 'TOKENS SECURED',
      rareItemsDiscovered: 'Rare Items Discovered',
      impactTokens: 'Impact Tokens',
      sectorSecured: 'SECTOR SECURED',
      criticalFailure: 'CRITICAL FAILURE',
      areaRestored: 'Area restored successfully. {score} points collected.',
      pointsCollected: 'points collected',
      roverSignalLost: 'Rover signal lost. Rescue team dispatched.',
      completeMission: 'COMPLETE MISSION',
      abortMission: 'ABORT MISSION',
      oceanCleared: 'OCEAN CLEARED',
      hullBreached: 'HULL BREACHED',
      surfaceReport: 'Surface & Report',
      emergencySurface: 'Emergency Surface',
      hull: 'Hull',
      armor: 'Armor',
      energy: 'Energy',
      fuelCell: 'Fuel Cell',
      oxygenPower: 'Oxygen/Power',
      target: 'TARGET',
      oceanCleanup: 'OCEAN CLEANUP',
    },
    hangar: {
      title: 'Hangar',
      upgrades: 'Upgrades',
      purchase: 'Purchase',
      purchased: 'Purchased',
      insufficientFunds: 'Insufficient Funds',
      level: 'Level',
      maxLevel: 'Max Level',
      aerialDrone: 'Aerial Drone',
      aquaBot: 'AquaBot',
      rover: 'Rover',
      lvl: 'Lvl',
      maxedOut: 'MAXED OUT',
      upgrade: 'UPGRADE',
      insufficient: 'INSUFFICIENT',
      ionThrusters: {
        name: 'Ion Thrusters',
        description: 'Increases aerial flight speed by 20%.',
      },
      grapheneBattery: {
        name: 'Graphene Battery',
        description: 'Increases drone max energy capacity.',
      },
      vortexFilter: {
        name: 'Vortex Filter',
        description: 'Widens the intake radius to collect smog faster.',
      },
      pulseEmitter: {
        name: 'Pulse Emitter',
        description: 'Unlocks EMP Blast (Spacebar) to destroy chasing seekers.',
      },
      titaniumPlating: {
        name: 'Titanium Plating',
        description: 'Reinforces drone hull to withstand collision damage.',
      },
      hydroJetTurbine: {
        name: 'Hydro-Jet Turbine',
        description: 'Increases underwater propulsion speed.',
      },
      o2Scrubber: {
        name: 'O2 Scrubber / Power',
        description: 'Increases mission time underwater.',
      },
      suctionNet: {
        name: 'Suction Net',
        description: 'Widens the collection radius for ocean waste.',
      },
      activeSonar: {
        name: 'Active Sonar',
        description: 'Unlocks Sonar Pulse (Spacebar) to pull items from afar.',
      },
      pressureHull: {
        name: 'Pressure Hull',
        description: 'Reinforces submarine against mines and rocks.',
      },
      v8HybridEngine: {
        name: 'V8 Hybrid Engine',
        description: 'Increases rover movement speed and torque.',
      },
      auxiliaryFuelCells: {
        name: 'Auxiliary Fuel Cells',
        description: 'Increases fuel capacity.',
      },
      magneticPlow: {
        name: 'Magnetic Plow',
        description: 'Widens range to collect samples and crates.',
      },
      rapidFireProtocol: {
        name: 'Rapid Fire Protocol',
        description: 'Optimization algorithms for faster turret reload.',
      },
      reactiveArmor: {
        name: 'Reactive Armor',
        description: 'Reinforces hull against enemy projectiles.',
      },
    },
    achievements: {
      title: 'Achievements',
      unlocked: 'Unlocked',
      locked: 'Locked',
      progress: 'Progress',
      firstSteps: {
        title: 'First Steps',
        description: 'Complete your first mission successfully.',
      },
      wellFunded: {
        title: 'Well Funded',
        description: 'Accumulate 1500 EcoCoins.',
      },
      veteranPilot: {
        title: 'Veteran Pilot',
        description: 'Reach Level 3.',
      },
      cleanMachine: {
        title: 'Clean Machine',
        description: 'Restore 3 full districts.',
      },
      techJunkie: {
        title: 'Tech Junkie',
        description: 'Purchase 5 upgrades.',
      },
      scrapCollector: {
        title: 'Scrap Collector',
        description: 'Destroy 10 automated defenses in Rover missions.',
      },
      wreckingCrew: {
        title: 'Wrecking Crew',
        description: 'Smash 25 supply crates with the Rover.',
      },
    },
    modals: {
      levelUp: {
        title: 'Level Up!',
        congratulations: 'Congratulations!',
        newLevel: 'You reached level {level}!',
        rewards: 'Rewards',
        coinsEarned: 'Coins Earned',
        xpEarned: 'XP Earned',
        rank: 'RANK',
        bonusCash: 'Bonus Cash',
        xpBoost: 'XP Boost',
        awesome: 'AWESOME',
      },
      cityComplete: {
        title: 'City Restored!',
        congratulations: 'Congratulations!',
        cityRestored: 'You have successfully restored {cityName}!',
        nextCity: 'Next City',
        returnToMap: 'Return to Map',
        excellentWork: 'Excellent work, Operator. Air quality in {cityName} has returned to safe levels. The local government thanks you for your service.',
        deployTo: 'DEPLOY TO',
      },
      tutorial: {
        aerialOperations: {
          title: 'Aerial Operations',
          description: 'You are piloting a high-altitude purification drone. Your mission is to clear smog and pollutants from the atmosphere.',
          collect: 'Collect floating debris and smog particles to increase your score.',
          avoid: 'Avoid toxic smog clouds. They damage your hull.',
        },
        flightControls: {
          title: 'Flight Controls',
          description: 'The drone follows your mouse cursor for precision maneuvering.',
          boost: 'BOOST',
          empBlast: 'EMP BLAST (If Unlocked)',
        },
        deepSeaOps: {
          title: 'Deep Sea Ops',
          description: 'Pilot the AquaBot to clean ocean sectors. Movement is slower and has inertia due to water resistance.',
          collect: 'Collect plastic waste and oil drums to clean the ocean.',
          danger: 'Danger! Avoid naval mines and aggressive sharks.',
        },
        submersibleControls: {
          title: 'Submersible Controls',
          description: 'Use thrusters to navigate currents.',
          turboProp: 'TURBO PROP',
          sonar: 'SONAR (If Unlocked)',
        },
        roverOperations: {
          title: 'Rover Operations',
          description: 'Deploy the heavy-duty Rover to industrial waste zones. This sector contains hostile automated defenses.',
          destroyCrates: 'Destroy Crates to find data, energy, and tokens.',
          combat: 'Combat: Use your turret to destroy Smog Beetles and Tanks.',
        },
        drivingManual: {
          title: 'Driving Manual',
          description: 'Independent turret control. Drive with keys, aim with mouse.',
          fireWeapon: 'FIRE WEAPON',
          tip: 'Tip: Slide along walls to maintain momentum.',
        },
        moveVehicle: 'Move Vehicle',
        aimSteer: 'Aim / Steer',
        back: 'BACK',
        next: 'NEXT',
        startMission: 'START MISSION',
      },
    },
    player: {
      level: 'Level',
      xp: 'XP',
      coins: 'Coins',
      tokens: 'Tokens',
      title: 'Title',
      missionsCompleted: 'Missions Completed',
      districtsRestored: 'Districts Restored',
      currentRank: 'Current Rank',
      progression: 'Progression',
      missions: 'Missions',
      restored: 'Restored',
      resetData: 'Reset Data',
      operator: 'OPERATOR',
    },
    settings: {
      language: 'Language',
      english: 'English',
      ukrainian: 'Українська',
    },
    tokens: {
      impactToken: 'IMPACT TOKEN',
      tokens: 'Tokens',
      useTokenDescription: 'Use this token to support real-world eco-initiatives:',
      donateToCauses: 'Donate to environmental causes',
      inGameCurrency: 'In-game currency for good deeds',
      rewardsFromPartners: 'Rewards from partners & brands',
      plantRealTree: 'Plant a real tree with your message',
    },
  },
  uk: {
    common: {
      loading: 'Завантаження',
      close: 'Закрити',
      confirm: 'Підтвердити',
      cancel: 'Скасувати',
      continue: 'Продовжити',
      back: 'Назад',
    },
    nav: {
      dashboard: 'Панель управління',
      hangar: 'Ангар',
      achievements: 'Досягнення',
      settings: 'Налаштування',
    },
    dashboard: {
      title: 'Центр управління',
      selectCity: 'Виберіть місто',
      selectDistrict: 'Виберіть район',
      startMission: 'Почати місію',
      missionBriefing: 'Брифінг місії',
      pollutionLevel: 'Рівень забруднення',
      status: 'Статус',
      restored: 'Відновлено',
      active: 'Активний',
      scanned: 'Скановано',
      locked: 'Заблоковано',
      learnMore: 'Дізнатися більше',
      noDistricts: 'Райони недоступні',
      currentSector: 'Поточний сектор',
      restoration: 'Відновлення',
      globalHealth: 'Глобальне здоров\'я',
      analyzingData: 'Аналіз екологічних даних...',
      environmentalStatusReport: 'Звіт про екологічний стан',
      mainPollutants: 'Основні забруднювачі',
      airQualityIndex: 'Індекс якості повітря',
      waterQuality: 'Якість води',
      environmentalFacts: 'Екологічні факти',
      realWorldImpact: 'Вплив на реальний світ',
      solutions: 'Рішення',
      awaitingCoordinates: 'Очікування координат',
      selectSector: 'Виберіть сектор з супутникової карти для ініціалізації протоколів місії.',
      environmentalHazard: 'Екологічна небезпека',
      toxicity: 'ТОКСИЧНІСТЬ',
      realWorldContext: 'Реальний контекст',
      viewIntelOnMaps: 'Переглянути розвідку на картах',
      gameType: 'Тип гри',
      showTutorial: 'Показати навчання',
      decrypting: 'Розшифровка...',
      bounty: 'Винагорода',
      areaSecured: 'ТЕРИТОРІЮ ЗАХИЩЕНО',
      viewTutorial: 'Переглянути навчання',
    },
    game: {
      missionAccomplished: 'МІСІЮ ВИКОНАНО',
      signalLost: 'СИГНАЛ ВТРАЧЕНО',
      sectorStabilized: 'Сектор {name} стабілізовано. Чудова робота, Оператор.',
      emergencyRecovery: 'Телеметрія дрона критична. Ініційовано екстрене відновлення.',
      collectReward: 'Отримати нагороду',
      returnToHangar: 'Повернутися до ангару',
      whyThisMatters: 'Чому це важливо',
      loadingAwarenessTip: 'Завантаження підказки...',
      defaultAwarenessTip: 'Кожна місія з очищення допомагає захистити нашу планету для майбутніх поколінь. Ваші дії мають справжнє значення!',
      controls: 'УПРАВЛІННЯ',
      boost: 'ПРИСКОРЕННЯ',
      empBlast: 'ЕМП ВИБУХ',
      sonar: 'СОНАТ',
      space: 'ПРОБІЛ',
      shift: 'SHIFT',
      pollutantsCleared: 'Забруднювачі очищено',
      tokensSecured: 'ТОКЕНИ ЗАБЕЗПЕЧЕНО',
      rareItemsDiscovered: 'Рідкісні предмети знайдено',
      impactTokens: 'Токени впливу',
      sectorSecured: 'СЕКТОР ЗАХИЩЕНО',
      criticalFailure: 'КРИТИЧНА ПОМИЛКА',
      areaRestored: 'Територію успішно відновлено. Зібрано {score} очок.',
      pointsCollected: 'очок зібрано',
      roverSignalLost: 'Сигнал ровера втрачено. Відправлено команду порятунку.',
      completeMission: 'ЗАВЕРШИТИ МІСІЮ',
      abortMission: 'ПЕРЕРВАТИ МІСІЮ',
      oceanCleared: 'ОКЕАН ОЧИЩЕНО',
      hullBreached: 'КОРПУС ПРОБИТО',
      surfaceReport: 'Всплити та звітувати',
      emergencySurface: 'Екстрене всплиття',
      hull: 'Корпус',
      armor: 'Броня',
      energy: 'Енергія',
      fuelCell: 'Паливна комірка',
      oxygenPower: 'Кисень/Потужність',
      target: 'ЦІЛЬ',
      oceanCleanup: 'ОЧИЩЕННЯ ОКЕАНУ',
    },
    hangar: {
      title: 'Ангар',
      upgrades: 'Покращення',
      purchase: 'Купити',
      purchased: 'Куплено',
      insufficientFunds: 'Недостатньо коштів',
      level: 'Рівень',
      maxLevel: 'Макс. рівень',
      aerialDrone: 'Повітряний дрон',
      aquaBot: 'АкваБот',
      rover: 'Ровер',
      lvl: 'Рів.',
      maxedOut: 'МАКСИМУМ',
      upgrade: 'ПОКРАЩИТИ',
      insufficient: 'НЕДОСТАТНЬО',
      ionThrusters: {
        name: 'Іонні двигуни',
        description: 'Збільшує швидкість польоту на 20%.',
      },
      grapheneBattery: {
        name: 'Графенова батарея',
        description: 'Збільшує максимальну енергоємність дрона.',
      },
      vortexFilter: {
        name: 'Вихровий фільтр',
        description: 'Розширює радіус збору для швидшого збирання смогу.',
      },
      pulseEmitter: {
        name: 'Імпульсний випромінювач',
        description: 'Розблоковує ЕМП вибух (Пробіл) для знищення переслідувачів.',
      },
      titaniumPlating: {
        name: 'Титанове покриття',
        description: 'Підсилює корпус дрона для стійкості до зіткнень.',
      },
      hydroJetTurbine: {
        name: 'Гідроструминна турбіна',
        description: 'Збільшує швидкість підводного руху.',
      },
      o2Scrubber: {
        name: 'Очищувач O2 / Потужність',
        description: 'Збільшує час місії під водою.',
      },
      suctionNet: {
        name: 'Всмоктувальна сітка',
        description: 'Розширює радіус збору океанських відходів.',
      },
      activeSonar: {
        name: 'Активний сонар',
        description: 'Розблоковує Сонарний імпульс (Пробіл) для притягування предметів здалеку.',
      },
      pressureHull: {
        name: 'Корпус тиску',
        description: 'Підсилює підводний апарат проти мін та каміння.',
      },
      v8HybridEngine: {
        name: 'V8 Гібридний двигун',
        description: 'Збільшує швидкість руху та крутний момент ровера.',
      },
      auxiliaryFuelCells: {
        name: 'Допоміжні паливні елементи',
        description: 'Збільшує ємність палива.',
      },
      magneticPlow: {
        name: 'Магнітний плуг',
        description: 'Розширює діапазон для збору зразків та ящиків.',
      },
      rapidFireProtocol: {
        name: 'Протокол швидкої стрільби',
        description: 'Алгоритми оптимізації для швидшого перезаряджання турелі.',
      },
      reactiveArmor: {
        name: 'Реактивна броня',
        description: 'Підсилює корпус проти ворожих снарядів.',
      },
    },
    achievements: {
      title: 'Досягнення',
      unlocked: 'Розблоковано',
      locked: 'Заблоковано',
      progress: 'Прогрес',
      firstSteps: {
        title: 'Перші кроки',
        description: 'Успішно виконайте вашу першу місію.',
      },
      wellFunded: {
        title: 'Добре фінансований',
        description: 'Накопичте 1500 ЕкоМонет.',
      },
      veteranPilot: {
        title: 'Досвідчений пілот',
        description: 'Досягніть 3 рівня.',
      },
      cleanMachine: {
        title: 'Машина очищення',
        description: 'Відновіть 3 повних райони.',
      },
      techJunkie: {
        title: 'Техноман',
        description: 'Купіть 5 покращень.',
      },
      scrapCollector: {
        title: 'Збирач утилю',
        description: 'Знищте 10 автоматизованих оборонних систем у місіях Ровера.',
      },
      wreckingCrew: {
        title: 'Команда руйнувачів',
        description: 'Розбийте 25 ящиків з припасами Ровером.',
      },
    },
    modals: {
      levelUp: {
        title: 'Підвищення рівня!',
        congratulations: 'Вітаємо!',
        newLevel: 'Ви досягли рівня {level}!',
        rewards: 'Нагороди',
        coinsEarned: 'Зароблено монет',
        xpEarned: 'Зароблено досвіду',
        rank: 'ЗВАННЯ',
        bonusCash: 'Бонусні кошти',
        xpBoost: 'Підвищення досвіду',
        awesome: 'ЧУДОВО',
      },
      cityComplete: {
        title: 'Місто відновлено!',
        congratulations: 'Вітаємо!',
        cityRestored: 'Ви успішно відновили {cityName}!',
        nextCity: 'Наступне місто',
        returnToMap: 'Повернутися до карти',
        excellentWork: 'Чудова робота, Оператор. Якість повітря в {cityName} повернулася до безпечного рівня. Місцева влада дякує вам за вашу службу.',
        deployTo: 'ВИСЛАТИ ДО',
      },
      tutorial: {
        aerialOperations: {
          title: 'Повітряні операції',
          description: 'Ви керуєте високоальтитудним дроном для очищення. Ваша місія - очистити атмосферу від смогу та забруднювачів.',
          collect: 'Збирайте плаваючі уламки та частки смогу, щоб збільшити ваш рахунок.',
          avoid: 'Уникайте токсичних хмар смогу. Вони пошкоджують ваш корпус.',
        },
        flightControls: {
          title: 'Управління польотом',
          description: 'Дрон слідує за курсором миші для точного маневрування.',
          boost: 'ПРИСКОРЕННЯ',
          empBlast: 'ЕМП ВИБУХ (Якщо розблоковано)',
        },
        deepSeaOps: {
          title: 'Глибоководні операції',
          description: 'Керуйте АкваБотом для очищення океанських секторів. Рух повільніший і має інерцію через опір води.',
          collect: 'Збирайте пластикові відходи та нафтові бочки для очищення океану.',
          danger: 'Небезпека! Уникайте морських мін та агресивних акул.',
        },
        submersibleControls: {
          title: 'Управління підводним апаратом',
          description: 'Використовуйте двигуни для навігації течіями.',
          turboProp: 'ТУРБО ПРОПЕЛЕР',
          sonar: 'СОНАТ (Якщо розблоковано)',
        },
        roverOperations: {
          title: 'Операції Ровера',
          description: 'Розгорніть важкий Ровер у промислових зонах відходів. Цей сектор містить ворожі автоматизовані оборонні системи.',
          destroyCrates: 'Знищуйте ящики, щоб знайти дані, енергію та токени.',
          combat: 'Бій: Використовуйте вашу турель для знищення Смогових Жуків та Танків.',
        },
        drivingManual: {
          title: 'Керівництво з водіння',
          description: 'Незалежне управління туреллю. Керуйте клавішами, прицілюйтеся мишею.',
          fireWeapon: 'СТРІЛЯТИ',
          tip: 'Порада: Ковзайте вздовж стін, щоб зберегти імпульс.',
        },
        moveVehicle: 'Керувати транспортним засобом',
        aimSteer: 'Прицілюватися / Керувати',
        back: 'НАЗАД',
        next: 'ДАЛІ',
        startMission: 'ПОЧАТИ МІСІЮ',
      },
    },
    player: {
      level: 'Рівень',
      xp: 'Досвід',
      coins: 'Монети',
      tokens: 'Токени',
      title: 'Звання',
      missionsCompleted: 'Місій виконано',
      districtsRestored: 'Районів відновлено',
      currentRank: 'Поточне звання',
      progression: 'Прогрес',
      missions: 'Місії',
      restored: 'Відновлено',
      resetData: 'Скинути дані',
      operator: 'ОПЕРАТОР',
    },
    settings: {
      language: 'Мова',
      english: 'English',
      ukrainian: 'Українська',
    },
    tokens: {
      impactToken: 'ТОКЕН ВПЛИВУ',
      tokens: 'Токени',
      useTokenDescription: 'Використовуйте цей токен для підтримки реальних еко-ініціатив:',
      donateToCauses: 'Пожертвувати на екологічні справи',
      inGameCurrency: 'Ігрова валюта за добрі справи',
      rewardsFromPartners: 'Нагороди від партнерів та брендів',
      plantRealTree: 'Посадити справжнє дерево з вашим повідомленням',
    },
  },
};

