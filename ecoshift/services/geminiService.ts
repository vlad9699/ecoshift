
import { GoogleGenAI } from "@google/genai";
import { District, DistrictStatus, CampaignCity } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- CITY LAYOUTS (Templates) ---
// Renamed back to CITY_LAYOUTS as per user request.
// These are topological skeletons (SVG paths 100x100). The AI chooses which one fits the city best.

const CITY_LAYOUTS: Record<string, string[]> = {
  "RIVER_SPLIT": [
    "M 5 5 L 45 5 L 40 45 L 5 40 Z",             // 0: North West
    "M 50 5 L 95 5 L 95 40 L 45 45 Z",            // 1: North East
    "M 5 45 L 40 50 L 35 95 L 5 90 Z",            // 2: South West
    "M 45 50 L 95 45 L 95 90 L 40 95 Z",          // 3: South East
    "M 15 35 L 35 35 L 35 65 L 15 65 Z",          // 4: River Island / Bridge West
    "M 65 35 L 85 35 L 85 65 L 65 65 Z"           // 5: River Island / Bridge East
  ],
  "COASTAL_WEST": [ // Ocean on left
    "M 30 5 L 95 5 L 90 30 L 35 30 Z",            // 0: North Inland
    "M 35 35 L 90 35 L 90 60 L 30 60 Z",          // 1: Mid Inland
    "M 30 65 L 90 65 L 95 95 L 25 95 Z",          // 2: South Inland
    "M 5 10 L 25 5 L 30 30 L 5 30 Z",             // 3: North Coast
    "M 5 35 L 30 35 L 25 60 L 5 60 Z",            // 4: Port/Dock
    "M 5 65 L 25 65 L 20 95 L 5 90 Z"             // 5: South Beach
  ],
  "ISLAND_CLUSTER": [
    "M 35 5 L 65 5 L 60 30 L 40 30 Z",            // 0: North Island
    "M 5 35 L 30 35 L 30 65 L 5 65 Z",            // 1: West Island
    "M 70 35 L 95 35 L 95 65 L 70 65 Z",          // 2: East Island
    "M 35 70 L 65 70 L 60 95 L 40 95 Z",          // 3: South Island
    "M 35 35 L 65 35 L 65 65 L 35 65 Z",          // 4: Central Hub
    "M 75 10 L 95 5 L 95 25 L 80 25 Z"            // 5: Satellite Islet
  ],
  "GRID_METRO": [
    "M 5 5 L 45 5 L 45 45 L 5 45 Z",              // 0: Top Left
    "M 50 5 L 95 5 L 95 45 L 50 45 Z",            // 1: Top Right
    "M 5 50 L 45 50 L 45 95 L 5 95 Z",            // 2: Bot Left
    "M 50 50 L 95 50 L 95 95 L 50 95 Z",          // 3: Bot Right
    "M 25 25 L 75 25 L 75 75 L 25 75 Z",          // 4: Central Center (Overlay)
    "M 80 5 L 95 5 L 95 20 L 80 20 Z"             // 5: Outskirt Detail
  ],
  "PENINSULA": [
    "M 20 10 L 50 5 L 80 10 L 50 40 Z",           // 0: Tip (North)
    "M 15 35 L 45 40 L 45 70 L 10 65 Z",          // 1: West Bank
    "M 55 40 L 85 35 L 90 65 L 55 70 Z",          // 2: East Bank
    "M 10 70 L 45 75 L 45 95 L 5 95 Z",           // 3: South West Base
    "M 55 75 L 90 70 L 95 95 L 55 95 Z",          // 4: South East Base
    "M 40 40 L 60 40 L 60 60 L 40 60 Z"           // 5: Central Heights
  ]
};

/**
 * Generates a full "Campaign Level" for a specific city.
 * AI Selects the visual layout based on geography.
 */
export const generateCityLevel = async (cityName: string, difficulty: number, language: 'en' | 'uk' = 'en'): Promise<District[]> => {
  const ai = getAIClient();
  
  // Fallback immediately if no AI
  if (!ai) return generateSimulationData(cityName, difficulty, language);

  const langName = language === 'uk' ? 'Ukrainian' : 'English';
  const prompt = `
    Act as an expert Cartographer and Environmental Scientist.
    Target City: ${cityName}.
    
    I have 5 map topologies available:
    1. RIVER_SPLIT (Good for London, Paris, Cairo - Cities divided by river).
    2. COASTAL_WEST (Good for Mumbai, Lima, LA - Ocean on left/west).
    3. ISLAND_CLUSTER (Good for Venice, Stockholm, Singapore, NYC).
    4. GRID_METRO (Good for Beijing, Phoenix, Mexico City - Dense/Inland).
    5. PENINSULA (Good for San Francisco, Cape Town, Doha, Boston).

    Task:
    1. Analyze the geography of ${cityName}. Choose the ONE topology that fits best.
    2. Identify 6 distinct districts in ${cityName}.
    3. Assign each district to a 'sectorIndex' (0-5) to match the topology.
       - Example: If RIVER_SPLIT, put North Bank districts in 0,1 and South Bank in 2,3.
       - Example: If COASTAL_WEST, put the Port/Beach districts in the coastal slots (3,4,5).
    
    4. For each district, provide:
       - "name": Real district name.
       - "realWorldProblem": Specific environmental issue (e.g. "E-Waste", "Smog", "Sewage").
       - "description": 1 short sentence explaining the issue.
       - "educationalTip": 1 interesting fact or solution about this issue.
    
    CRITICAL: You MUST write ALL text fields (description, realWorldProblem, educationalTip) in ${langName} language ONLY.
    Do NOT use English if language is Ukrainian. Do NOT use Ukrainian if language is English.
    
    Output JSON:
    {
      "layoutId": "RIVER_SPLIT",
      "districts": [
        { "name": "...", "sectorIndex": 0, "realWorldProblem": "...", "description": "...", "educationalTip": "..." },
        ... (6 items total)
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let text = response.text || "{}";
    // Cleanup code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(text);
    } catch (e) {
      console.warn("Failed to parse AI response, using simulation.");
      return generateSimulationData(cityName, difficulty);
    }

    if (!parsedData.districts || parsedData.districts.length < 6) {
        return generateSimulationData(cityName, difficulty);
    }

    const layoutId = parsedData.layoutId || "GRID_METRO";
    const pathTemplates = CITY_LAYOUTS[layoutId] || CITY_LAYOUTS["GRID_METRO"];

    return parsedData.districts.map((loc: any, i: number) => {
      const sectorIndex = typeof loc.sectorIndex === 'number' ? loc.sectorIndex : i;
      const basePollution = 40 + (difficulty * 10);
      
      // Use the specific path for this slot
      const mapPath = pathTemplates[sectorIndex % pathTemplates.length];

      return {
        id: `loc-${cityName}-${i}`,
        name: loc.name,
        realAddress: `${loc.name}, ${cityName}`,
        googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + " " + cityName)}`,
        pollutionLevel: Math.min(95, Math.floor(basePollution + Math.random() * 30)),
        status: DistrictStatus.SCANNED,
        description: loc.description,
        realWorldProblem: loc.realWorldProblem,
        educationalTip: loc.educationalTip,
        gridIndex: sectorIndex,
        mapPath: mapPath // THE MAGIC: AI geography
      };
    });

  } catch (error: any) {
    console.warn("City Generation failed, using fallback:", error);
    return generateSimulationData(cityName, difficulty, language);
  }
};

const generateSimulationData = (cityName: string, difficulty: number, language: 'en' | 'uk' = 'en'): District[] => {
    const suffixesEn = ['Industrial Zone', 'Port', 'Downtown', 'Power Plant', 'Market', 'Transit Hub'];
    const suffixesUk = ['Промислова зона', 'Порт', 'Центр міста', 'Електростанція', 'Ринок', 'Транспортний вузол'];
    const problemsEn = ['Smog', 'Water Waste', 'Plastic', 'Chemical Runoff', 'Noise Pollution', 'CO2 Emissions'];
    const problemsUk = ['Смог', 'Відходи води', 'Пластик', 'Хімічні стоки', 'Шумове забруднення', 'Викиди CO2'];
    
    const suffixes = language === 'uk' ? suffixesUk : suffixesEn;
    const problems = language === 'uk' ? problemsUk : problemsEn;
    
    // Select a random topology for variety if AI is offline
    const layoutKeys = Object.keys(CITY_LAYOUTS);
    const randomLayoutKey = layoutKeys[Math.floor(Math.random() * layoutKeys.length)];
    const layout = CITY_LAYOUTS[randomLayoutKey]; 

    const descriptionEn = `Simulation: High concentration of pollutants detected in this sector based on urban density models.`;
    const descriptionUk = `Симуляція: Висока концентрація забруднювачів виявлена в цьому секторі на основі моделей міської щільності.`;
    const tipEn = "Real-world solutions typically involve stricter emission regulations and transition to renewable energy sources.";
    const tipUk = "Реальні рішення зазвичай включають більш суворі норми викидів та перехід на відновлювані джерела енергії.";
    
    return Array.from({ length: 6 }).map((_, i) => {
        const districtName = `${cityName} ${suffixes[i]}`;
        return {
            id: `sim-${cityName}-${i}`,
            name: districtName,
            realAddress: districtName,
            pollutionLevel: 50 + Math.floor(Math.random() * 40),
            status: DistrictStatus.SCANNED,
            description: language === 'uk' ? descriptionUk : descriptionEn,
            realWorldProblem: problems[i],
            educationalTip: language === 'uk' ? tipUk : tipEn,
            googleMapsUri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(districtName)}`,
            gridIndex: i,
            mapPath: layout[i]
        };
    });
};

/**
 * Generates a list of polluted cities with detailed pollution information.
 * AI selects cities based on real-world environmental issues related to the game theme.
 */
export const generatePollutedCities = async (count: number = 5, theme: string = "environmental pollution and climate change", language: 'en' | 'uk' = 'en'): Promise<CampaignCity[]> => {
  const ai = getAIClient();
  
  // Fallback cities if AI is unavailable
  const fallbackCitiesEn: CampaignCity[] = [
    {
      name: "San Francisco",
      region: "North America",
      description: "A coastal tech hub struggling with urban smog and microplastic runoff in the bay.",
      difficulty: 1,
      pollutionInfo: {
        mainPollutants: ["PM2.5", "Microplastics", "NO2"],
        pollutionLevel: "High",
        airQualityIndex: 85,
        waterQuality: "Moderate",
        environmentalFacts: [
          "San Francisco Bay contains high levels of microplastics from urban runoff.",
          "The city's tech industry contributes to e-waste pollution."
        ],
        realWorldImpact: "Coastal pollution affects marine ecosystems and air quality impacts public health.",
        solutions: ["Waste reduction programs", "Renewable energy transition"]
      }
    },
    {
      name: "Mumbai",
      region: "Asia",
      description: "Rapid urbanization leading to critical air quality levels and waste management challenges.",
      difficulty: 1.5,
      pollutionInfo: {
        mainPollutants: ["PM2.5", "PM10", "SO2"],
        pollutionLevel: "Critical",
        airQualityIndex: 180,
        waterQuality: "Poor",
        environmentalFacts: [
          "Mumbai has one of the highest air pollution levels in India.",
          "Rapid urbanization has overwhelmed waste management systems."
        ],
        realWorldImpact: "High pollution levels cause respiratory diseases and environmental degradation.",
        solutions: ["Public transport expansion", "Waste segregation programs"]
      }
    }
  ];

  const fallbackCitiesUk: CampaignCity[] = [
    {
      name: "Сан-Франциско",
      region: "Північна Америка",
      description: "Прибережний технологічний центр, який бореться з міським смогом та мікропластиковими стоками в затоці.",
      difficulty: 1,
      pollutionInfo: {
        mainPollutants: ["PM2.5", "Мікропластик", "NO2"],
        pollutionLevel: "Високий",
        airQualityIndex: 85,
        waterQuality: "Помірний",
        environmentalFacts: [
          "Затока Сан-Франциско містить високі рівні мікропластику з міських стоків.",
          "Технологічна індустрія міста сприяє забрудненню електронними відходами."
        ],
        realWorldImpact: "Прибережне забруднення впливає на морські екосистеми, а якість повітря впливає на здоров'я населення.",
        solutions: ["Програми зменшення відходів", "Перехід на відновлювану енергію"]
      }
    },
    {
      name: "Мумбаї",
      region: "Азія",
      description: "Швидка урбанізація призводить до критичних рівнів якості повітря та проблем з управлінням відходами.",
      difficulty: 1.5,
      pollutionInfo: {
        mainPollutants: ["PM2.5", "PM10", "SO2"],
        pollutionLevel: "Критичний",
        airQualityIndex: 180,
        waterQuality: "Поганий",
        environmentalFacts: [
          "Мумбаї має один з найвищих рівнів забруднення повітря в Індії.",
          "Швидка урбанізація перевантажила системи управління відходами."
        ],
        realWorldImpact: "Високі рівні забруднення викликають респіраторні захворювання та деградацію навколишнього середовища.",
        solutions: ["Розширення громадського транспорту", "Програми сортування відходів"]
      }
    }
  ];

  const fallbackCities = language === 'uk' ? fallbackCitiesUk : fallbackCitiesEn;

  if (!ai) {
    return fallbackCities.slice(0, count);
  }

  const langName = language === 'uk' ? 'Ukrainian' : 'English';
  const prompt = `
    Act as an Environmental Scientist and Urban Planning Expert.
    
    Task: Generate ${count} real-world cities that are currently facing significant environmental pollution challenges related to: ${theme}.
    
    For each city, provide:
    1. "name": Real city name
    2. "region": Geographic region (e.g., "Asia", "Europe", "North America", "South America", "Africa", "Oceania")
    3. "description": 1-2 sentence description of the city's pollution challenges (engaging, game-like tone)
    4. "difficulty": Number between 1.0 and 2.5 representing pollution severity (1.0 = moderate, 2.5 = extreme)
    5. "pollutionInfo": Detailed pollution data:
       - "mainPollutants": Array of 2-4 specific pollutants (e.g., ["PM2.5", "NO2", "Microplastics", "Heavy Metals"])
       - "pollutionLevel": String - "Moderate", "High", "Critical", or "Extreme" (translate to ${langName} if language is Ukrainian)
       - "airQualityIndex": Number (0-300, where 0-50 is good, 300+ is hazardous)
       - "waterQuality": String - "Good", "Moderate", "Poor", or "Critical" (translate to ${langName} if language is Ukrainian)
       - "environmentalFacts": Array of 2-3 interesting, educational facts about pollution in this city
       - "realWorldImpact": 1-2 sentence description of how pollution affects the city and its residents
       - "solutions": Array of 2-3 real-world solutions being implemented or proposed
    
    Requirements:
    - Choose diverse cities from different continents
    - Focus on cities with real, documented pollution issues
    - Make it educational and informative
    - Include both well-known and lesser-known polluted cities
    - Ensure variety in pollution types (air, water, soil, etc.)
    - CRITICAL: You MUST write ALL text fields (description, environmentalFacts, realWorldImpact, solutions, pollutionLevel, waterQuality) in ${langName} language ONLY
    - Do NOT use English if language is Ukrainian. Do NOT use Ukrainian if language is English.
    
    Output JSON:
    {
      "cities": [
        {
          "name": "...",
          "region": "...",
          "description": "...",
          "difficulty": 1.5,
          "pollutionInfo": {
            "mainPollutants": ["..."],
            "pollutionLevel": "...",
            "airQualityIndex": 120,
            "waterQuality": "...",
            "environmentalFacts": ["...", "..."],
            "realWorldImpact": "...",
            "solutions": ["...", "..."]
          }
        },
        ... (${count} cities total)
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let text = response.text || "{}";
    // Cleanup code blocks if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(text);
    } catch (e) {
      console.warn("Failed to parse AI cities response, using fallback.");
      return fallbackCities.slice(0, count);
    }

    if (!parsedData.cities || !Array.isArray(parsedData.cities) || parsedData.cities.length === 0) {
      console.warn("AI returned invalid cities data, using fallback.");
      return fallbackCities.slice(0, count);
    }

    // Validate and return cities
    return parsedData.cities.slice(0, count).map((city: any) => ({
      name: city.name || "Unknown City",
      region: city.region || "Unknown",
      description: city.description || "Environmental challenges detected.",
      difficulty: typeof city.difficulty === 'number' ? Math.max(1.0, Math.min(2.5, city.difficulty)) : 1.5,
      pollutionInfo: city.pollutionInfo ? {
        mainPollutants: Array.isArray(city.pollutionInfo.mainPollutants) ? city.pollutionInfo.mainPollutants : ["PM2.5"],
        pollutionLevel: city.pollutionInfo.pollutionLevel || "High",
        airQualityIndex: typeof city.pollutionInfo.airQualityIndex === 'number' ? city.pollutionInfo.airQualityIndex : 100,
        waterQuality: city.pollutionInfo.waterQuality || "Moderate",
        environmentalFacts: Array.isArray(city.pollutionInfo.environmentalFacts) ? city.pollutionInfo.environmentalFacts : [],
        realWorldImpact: city.pollutionInfo.realWorldImpact || "Pollution affects local ecosystems and public health.",
        solutions: Array.isArray(city.pollutionInfo.solutions) ? city.pollutionInfo.solutions : []
      } : undefined
    }));

  } catch (error: any) {
    console.warn("City generation failed, using fallback:", error);
    return fallbackCities.slice(0, count);
  }
};

export const getMissionBriefing = async (district: District, language: 'en' | 'uk' = 'en'): Promise<string> => {
  const ai = getAIClient();
  
  const fallbacksEn = [
      "Satellite link confirmed. High toxicity levels detected. Scrub protocols engaged.",
      "Local sensors indicate dangerous particulate matter. Proceed with cleanup operation.",
      "Civilian reports of heavy smog in this sector. Restore air quality immediately.",
      "Industrial runoff has compromised the area. Deploy drone fleet for sanitation."
  ];

  const fallbacksUk = [
      "Супутниковий зв'язок підтверджено. Виявлено високі рівні токсичності. Протоколи очищення активовано.",
      "Локальні датчики вказують на небезпечні частинки. Розпочати операцію з очищення.",
      "Цивільні повідомляють про важкий смог у цьому секторі. Відновити якість повітря негайно.",
      "Промислові стоки пошкодили територію. Розгорнути флот дронів для санітації."
  ];

  const fallbacks = language === 'uk' ? fallbacksUk : fallbacksEn;

  if (!ai) return fallbacks[0];

  const langName = language === 'uk' ? 'Ukrainian' : 'English';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        Act as a tactical eco-officer for a futuristic game.
        Mission Target: ${district.name}.
        Problem: ${district.realWorldProblem}.
        
        Write a very short (max 25 words) immersive mission briefing telling the player what to clean up.
        Style: Sci-fi, Urgent.
        
        CRITICAL: You MUST write in ${langName} language ONLY.
        Do NOT use English if language is Ukrainian. Do NOT use Ukrainian if language is English.
      `,
    });
    return response.text || fallbacks[0];
  } catch (e) {
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

/**
 * Generates or updates pollution information for a specific city.
 * This is called when user clicks "Learn More" to get detailed pollution data.
 */
export const getCityPollutionInfo = async (city: CampaignCity, language: 'en' | 'uk' = 'en'): Promise<CampaignCity['pollutionInfo']> => {
  const ai = getAIClient();
  
  // If city already has pollution info, return it (or you could force regenerate)
  if (city.pollutionInfo) {
    return city.pollutionInfo;
  }

  // Fallback data
  const fallbackInfoEn: CampaignCity['pollutionInfo'] = {
    mainPollutants: ["PM2.5", "NO2"],
    pollutionLevel: "High",
    airQualityIndex: 100,
    waterQuality: "Moderate",
    environmentalFacts: [
      `${city.name} faces significant environmental challenges that require attention.`,
      "Urban development and industrial activities contribute to pollution levels."
    ],
    realWorldImpact: "Pollution affects local ecosystems and public health.",
    solutions: ["Renewable energy transition", "Waste reduction programs"]
  };

  const fallbackInfoUk: CampaignCity['pollutionInfo'] = {
    mainPollutants: ["PM2.5", "NO2"],
    pollutionLevel: "Високий",
    airQualityIndex: 100,
    waterQuality: "Помірний",
    environmentalFacts: [
      `${city.name} стикається зі значними екологічними викликами, які потребують уваги.`,
      "Міський розвиток та промислова діяльність сприяють рівням забруднення."
    ],
    realWorldImpact: "Забруднення впливає на місцеві екосистеми та здоров'я населення.",
    solutions: ["Перехід на відновлювану енергію", "Програми зменшення відходів"]
  };

  const fallbackInfo = language === 'uk' ? fallbackInfoUk : fallbackInfoEn;

  if (!ai) return fallbackInfo;

  const langName = language === 'uk' ? 'Ukrainian' : 'English';
  const prompt = `
    Act as an Environmental Scientist and Urban Planning Expert.
    
    Target City: ${city.name}
    Region: ${city.region || "Unknown"}
    Description: ${city.description}
    Difficulty Level: ${city.difficulty}
    
    Task: Generate detailed, accurate pollution information for this city based on real-world data.
    
    Provide:
    1. "mainPollutants": Array of 2-4 specific pollutants (e.g., ["PM2.5", "NO2", "Microplastics", "Heavy Metals"])
    2. "pollutionLevel": String - "Moderate", "High", "Critical", or "Extreme" (translate to ${langName} if language is Ukrainian)
    3. "airQualityIndex": Number (0-300, where 0-50 is good, 300+ is hazardous)
    4. "waterQuality": String - "Good", "Moderate", "Poor", or "Critical" (translate to ${langName} if language is Ukrainian)
    5. "environmentalFacts": Array of 2-3 interesting, educational facts about pollution in this city
    6. "realWorldImpact": 1-2 sentence description of how pollution affects the city and its residents
    7. "solutions": Array of 2-3 real-world solutions being implemented or proposed
    
    Requirements:
    - Use real, documented information about this city if possible
    - Make it educational and informative
    - Be specific and accurate
    - Focus on actual environmental challenges
    - CRITICAL: You MUST write ALL text fields (environmentalFacts, realWorldImpact, solutions, pollutionLevel, waterQuality) in ${langName} language ONLY
    - Do NOT use English if language is Ukrainian. Do NOT use Ukrainian if language is English.
    
    Output JSON:
    {
      "mainPollutants": ["..."],
      "pollutionLevel": "...",
      "airQualityIndex": 120,
      "waterQuality": "...",
      "environmentalFacts": ["...", "..."],
      "realWorldImpact": "...",
      "solutions": ["...", "..."]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    let text = response.text || "{}";
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(text);
    } catch (e) {
      console.warn("Failed to parse AI pollution info response, using fallback.");
      return fallbackInfo;
    }

    // Validate and return pollution info
    return {
      mainPollutants: Array.isArray(parsedData.mainPollutants) && parsedData.mainPollutants.length > 0 
        ? parsedData.mainPollutants 
        : fallbackInfo.mainPollutants,
      pollutionLevel: parsedData.pollutionLevel || fallbackInfo.pollutionLevel,
      airQualityIndex: typeof parsedData.airQualityIndex === 'number' 
        ? parsedData.airQualityIndex 
        : fallbackInfo.airQualityIndex,
      waterQuality: parsedData.waterQuality || fallbackInfo.waterQuality,
      environmentalFacts: Array.isArray(parsedData.environmentalFacts) && parsedData.environmentalFacts.length > 0
        ? parsedData.environmentalFacts
        : fallbackInfo.environmentalFacts,
      realWorldImpact: parsedData.realWorldImpact || fallbackInfo.realWorldImpact,
      solutions: Array.isArray(parsedData.solutions) && parsedData.solutions.length > 0
        ? parsedData.solutions
        : fallbackInfo.solutions
    };

  } catch (error: any) {
    console.warn("Failed to get city pollution info from AI, using fallback:", error);
    return fallbackInfo;
  }
};

/**
 * Generates an educational environmental awareness tip when a player wins a game.
 * This helps raise awareness about why protecting the environment is important.
 */
export const getEnvironmentalAwarenessTip = async (district: District, language: 'en' | 'uk' = 'en'): Promise<string> => {
  const ai = getAIClient();
  
  const fallbacksEn = [
    "Every small action counts! Reducing waste and choosing sustainable options helps protect our planet for future generations.",
    "Environmental protection isn't just about nature—it's about our health, economy, and the world we leave to our children.",
    "Clean air and water are fundamental human rights. By protecting the environment, we protect ourselves and our communities.",
    "Climate change affects everyone, but collective action can make a real difference. Your choices matter!",
    "Biodiversity loss threatens ecosystems worldwide. Every cleanup mission helps restore balance to our planet."
  ];

  const fallbacksUk = [
    "Кожна маленька дія має значення! Зменшення відходів та вибір екологічних рішень допомагає захистити нашу планету для майбутніх поколінь.",
    "Захист навколишнього середовища - це не лише про природу, а й про наше здоров'я, економіку та світ, який ми залишаємо нашим дітям.",
    "Чисте повітря та вода - це фундаментальні права людини. Захищаючи навколишнє середовище, ми захищаємо себе та наші спільноти.",
    "Зміна клімату впливає на всіх, але спільні дії можуть зробити справжню різницю. Ваші вибори мають значення!",
    "Втрата біорізноманіття загрожує екосистемам у всьому світі. Кожна місія з очищення допомагає відновити баланс на нашій планеті."
  ];

  const fallbacks = language === 'uk' ? fallbacksUk : fallbacksEn;

  if (!ai) {
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  const prompt = `
    Act as an Environmental Education Expert.
    
    Context: A player just completed a cleanup mission in ${district.name}.
    Environmental Problem: ${district.realWorldProblem || district.description || 'General pollution'}
    District Description: ${district.description || 'Urban area with pollution issues'}
    
    Task: Write a short, inspiring, and educational message (2-3 sentences, max 150 words) that explains why protecting the environment is important.
    
    Requirements:
    - Make it personal and relatable
    - Connect the specific problem (${district.realWorldProblem || 'pollution'}) to broader environmental awareness
    - Use encouraging, positive language
    - Focus on why environmental protection matters for people, communities, and the planet
    - CRITICAL: You MUST write in ${language === 'uk' ? 'Ukrainian' : 'English'} language ONLY
    - Make it inspiring and motivating
    - Keep it concise: 2-3 sentences, max 150 words
    - Do NOT use English if language is Ukrainian
    - Do NOT use Ukrainian if language is English
    
    Output ONLY the message text in ${language === 'uk' ? 'Ukrainian' : 'English'}, no JSON, no quotes, no markdown, just the educational tip text.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const tip = response.text?.trim() || '';
    // Clean up any markdown formatting
    const cleanedTip = tip.replace(/```/g, '').replace(/"/g, '').trim();
    
    if (cleanedTip.length > 10) {
      return cleanedTip;
    }
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  } catch (error: any) {
    console.warn("Failed to get environmental tip from AI, using fallback:", error);
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};
