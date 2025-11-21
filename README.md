

# EcoShift

## 📖 Game Description

**EcoShift** is a browser-based environmental game that allows players to clean up polluted city districts through a series of fast 30-second mini-games. The player takes on the role of an environmental mission operator, controlling various vehicles (drones, submarines, rovers) to clean up polluted sectors.

**Core Gameplay:**
- Explore city maps with polluted districts
- Complete missions through three types of mini-games:
  - **Drone Game** — cleaning air from smog
  - **Water Game** — collecting trash from the ocean
  - **Rover Game** — ground missions with destruction of automated defense systems
- Progress through a leveling and achievement system
- Upgrade equipment through an upgrade system
- Track statistics and achievements

The game uses AI (Google Gemini) to generate unique missions and context for each polluted district, creating a personalized experience for each player.

---

## 🏆 Reward System

### EcoCoins
The main in-game currency, obtainable by:
- Successfully completing missions
- Cleaning districts
- Achieving various goals
- Through the idle progress system (rewards for time away)

### Leveling System
- Players earn experience (XP) by completing missions
- Leveling up unlocks new opportunities and rewards
- Visual level indicators with unique borders for each level

### Achievements
The achievement system includes:
- **First Steps** — complete your first mission
- **Well Funded** — accumulate 1500 EcoCoins
- **Veteran Pilot** — reach level 3
- **Clean Machine** — restore 3 full districts
- **Tech Junkie** — purchase 5 upgrades
- **Scrap Collector** — destroy 10 automated defense systems
- **Wrecking Crew** — smash 25 supply crates

### Upgrade System
Three categories of upgrades for different vehicle types:

**Drone Upgrades:**
- Ion Thrusters — increases flight speed
- Graphene Battery — increases battery capacity
- Vortex Filter — widens smog collection radius
- Pulse Emitter — unlocks EMP attack
- Titanium Plating — reinforces hull

**Submarine Upgrades:**
- Hydro-Jet Turbine — increases underwater speed
- O2 Scrubber / Power — increases underwater mission time
- Suction Net — widens waste collection radius
- Active Sonar — unlocks sonar pulse
- Pressure Hull — reinforces hull

**Rover Upgrades:**
- V8 Hybrid Engine — increases movement speed
- Auxiliary Fuel Cells — increases fuel capacity
- Magnetic Plow — widens collection radius
- Rapid Fire Protocol — optimizes turret reload
- Reactive Armor — reinforces protection

### Progress Saving System
- Automatic saving to LocalStorage
- Saves player statistics, districts, achievements, and upgrades
- Restores progress on next visit

---

## 🛠 Technologies Used

### Frontend
- **React 19.2.0** — UI framework
- **TypeScript 5.8.2** — code typing
- **Vite 6.2.0** — build tool and development server
- **React DOM 19.2.0** — React rendering

### UI & Icons
- **lucide-react 0.554.0** — icon library
- **recharts 3.4.1** — charts and data visualization

### AI & Services
- **@google/genai 1.30.0** — Google Gemini AI integration for mission and context generation

### Development Tools
- **@vitejs/plugin-react 5.0.0** — Vite plugin for React
- **@types/node 22.14.0** — TypeScript types for Node.js

### Features
- Multilingual support (Ukrainian/English) through i18n context system
- Sound system through SoundManager
- Responsive design with support for various screen sizes
- Modular architecture with separate features and hooks

---

## 🚀 How to Run Locally

### Prerequisites
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Google Gemini API key** (get one at [Google AI Studio](https://makersuite.google.com/app/apikey))

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd hachathon_v1/ecoshift
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
Create a `.env.local` file in the `ecoshift/` directory and add your API key:

```env
GEMINI_API_KEY=your_api_key_here
```

**Note:** Replace `your_api_key_here` with your actual Google Gemini API key.

### Step 4: Run the Development Server
```bash
npm run dev
```

The game will be available at: **http://localhost:3000**

### Step 5: Build for Production (Optional)
```bash
npm run build
```

After building, files will be in the `dist/` directory. To preview the built version:

```bash
npm run preview
```

### Available Commands
- `npm run dev` — start development server with hot-reload
- `npm run build` — build optimized version for production
- `npm run preview` — preview built version locally

### Troubleshooting

**API Key Error:**
- Make sure the `.env.local` file is in the `ecoshift/` directory
- Verify that the key is correct and active
- Restart the development server after changing `.env.local`

**Dependency Issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 is Busy:**
Change the port in `vite.config.ts` or use an environment variable:
```bash
PORT=3001 npm run dev
```

---

## 📝 Additional Information

- **View your app in AI Studio:** https://ai.studio/apps/drive/1lk906HRDhz3UU_yUtIONdkRQcD-WU18D
- Project is ready for deployment on **Vercel**
- All development files (BMAD, Cursor) are excluded from git via `.gitignore`

---

<div align="center">
Made with ❤️ for environmental impact
</div>
