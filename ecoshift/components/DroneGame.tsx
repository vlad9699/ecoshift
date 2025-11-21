
import React, { useRef, useEffect, useState } from 'react';
import { District, DroneStats } from '../types';
import { Zap, Shield, Wind, AlertTriangle, Crosshair, FastForward, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/SoundManager';
import { getEnvironmentalAwarenessTip } from '../services/geminiService';
import { useLanguage } from '../i18n';

interface DroneGameProps {
  district: District;
  droneStats: DroneStats;
  onComplete: (score: number, success: boolean, tokensFound: number) => void;
  onClose: () => void;
}

// Icons for trash types
const TRASH_ICONS = ['🛢️', '🥤', '🥡', '🚬', '🧴', '🧾', '📦'];
const ENERGY_ICONS = ['⚡', '🔋'];

export const DroneGame: React.FC<DroneGameProps> = ({ district, droneStats, onComplete, onClose }) => {
  const { t, format, language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Constants
  const TARGET_SCORE = 500;
  
  // Game State
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(droneStats.battery);
  const [health, setHealth] = useState(droneStats.hull);
  const [gameState, setGameState] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  const [messages, setMessages] = useState<string[]>([]);
  const [tokensFound, setTokensFound] = useState(0);
  const [environmentalTip, setEnvironmentalTip] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);

  // Refs for Loop
  const requestRef = useRef<number>(0);
  const scoreRef = useRef(0);
  const energyRef = useRef(droneStats.battery);
  const healthRef = useRef(droneStats.hull);
  const maxEnergy = useRef(droneStats.battery);
  const maxHealth = useRef(droneStats.hull);
  const tokensRef = useRef(0);
  
  // Input
  const keysPressed = useRef<Record<string, boolean>>({});
  const mousePos = useRef({ x: 0, y: 0 });
  
  // Entities
  const drone = useRef({ 
    x: window.innerWidth / 2, 
    y: window.innerHeight / 2, 
    vx: 0, 
    vy: 0,
    angle: 0
  });

  const particles = useRef<{
    x: number, 
    y: number, 
    type: 'POLLUTION' | 'ENERGY' | 'TOKEN', 
    radius: number, 
    vx: number, 
    vy: number,
    icon: string,
    rotation: number,
    rotSpeed: number
  }[]>([]);

  const enemies = useRef<{x: number, y: number, radius: number, speed: number, type: 'CLOUD' | 'SEEKER'}[]>([]);
  const effects = useRef<{x: number, y: number, radius: number, life: number, color: string}[]>([]); // Explosions/Pulse

  // Grid Effect
  const gridOffset = useRef({ x: 0, y: 0 });

  // Add temporary message
  const addMessage = (msg: string) => {
    setMessages(prev => [...prev.slice(-2), msg]);
    setTimeout(() => setMessages(prev => prev.slice(1)), 2000);
  };

  // Load environmental tip when player wins
  useEffect(() => {
    if (gameState === 'WON' && !environmentalTip && !loadingTip) {
      setLoadingTip(true);
      getEnvironmentalAwarenessTip(district, language)
        .then(tip => {
          setEnvironmentalTip(tip);
          setLoadingTip(false);
        })
        .catch(() => {
          setLoadingTip(false);
        });
    }
  }, [gameState, district, environmentalTip, loadingTip, language]);

  useEffect(() => {
    // START MUSIC
    soundManager.startMusic();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Input Listeners
    const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.code] = false; };
    const handleMouseMove = (e: MouseEvent) => { mousePos.current = { x: e.clientX, y: e.clientY }; };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);

    // --- SPAWNER ---
    const spawnInterval = setInterval(() => {
      if (gameState !== 'PLAYING') return;

      // 1. Pollution Particles (Objective)
      // Increased cap to 45 to ensure there is always trash
      if (particles.current.length < 45) {
         // Spawn Logic
         let type: 'POLLUTION' | 'ENERGY' | 'TOKEN' = 'POLLUTION';
         let iconList = TRASH_ICONS;
         
         const rand = Math.random();
         if (rand > 0.99) { // 1% Chance for TOKEN (Rare)
            type = 'TOKEN';
            iconList = ['💠']; 
         } else if (rand > 0.8) { // 20% Chance for Energy
            type = 'ENERGY';
            iconList = ENERGY_ICONS;
         }
         
         // Spawn edges logic
         const side = Math.floor(Math.random() * 4); // 0:top, 1:right, 2:bottom, 3:left
         let startX = 0, startY = 0;
         let velX = 0, velY = 0;
         const speed = 1 + Math.random();

         if (side === 0) { 
             // Top: move down
             startX = Math.random() * canvas.width; 
             startY = -40; 
             velY = speed;
             velX = (Math.random() - 0.5) * 2;
         } else if (side === 1) { 
             // Right: move left
             startX = canvas.width + 40; 
             startY = Math.random() * canvas.height; 
             velX = -speed;
             velY = (Math.random() - 0.5) * 2;
         } else if (side === 2) { 
             // Bottom: move up
             startX = Math.random() * canvas.width; 
             startY = canvas.height + 40; 
             velY = -speed;
             velX = (Math.random() - 0.5) * 2;
         } else { 
             // Left: move right
             startX = -40; 
             startY = Math.random() * canvas.height; 
             velX = speed;
             velY = (Math.random() - 0.5) * 2;
         }
         
         particles.current.push({
           x: startX,
           y: startY,
           type: type,
           radius: type === 'TOKEN' ? 15 : (type === 'ENERGY' ? 10 : 12),
           vx: velX,
           vy: velY,
           icon: iconList[Math.floor(Math.random() * iconList.length)],
           rotation: Math.random() * Math.PI * 2,
           rotSpeed: (Math.random() - 0.5) * 0.1
         });
      }

      // 2. Enemies based on pollution level difficulty
      const difficultyMultiplier = (district.pollutionLevel / 100) * 2; // 1.0 to 2.0
      const maxEnemies = 5 + Math.floor(difficultyMultiplier * 5);

      if (enemies.current.length < maxEnemies) {
        const isSeeker = Math.random() < (0.2 * difficultyMultiplier); // Higher pollution = more seekers
        const side = Math.floor(Math.random() * 4); // 0:top, 1:right, 2:bottom, 3:left
        let startX = 0, startY = 0;
        
        if (side === 0) { startX = Math.random() * canvas.width; startY = -50; }
        else if (side === 1) { startX = canvas.width + 50; startY = Math.random() * canvas.height; }
        else if (side === 2) { startX = Math.random() * canvas.width; startY = canvas.height + 50; }
        else { startX = -50; startY = Math.random() * canvas.height; }

        enemies.current.push({
          x: startX,
          y: startY,
          radius: isSeeker ? 15 : 30 + Math.random() * 30,
          speed: isSeeker ? 2 + Math.random() : 0.5 + Math.random(),
          type: isSeeker ? 'SEEKER' : 'CLOUD'
        });
      }
    }, 200); // Spawn check every 200ms

    // --- GAME LOOP ---
    const animate = () => {
      // Priority Check: Win condition first
      if (scoreRef.current >= TARGET_SCORE) {
        if (gameState === 'PLAYING') {
            setGameState('WON');
            soundManager.playWin();
            soundManager.stopMusic(); // Stop loop on win
        }
        return;
      }

      // Then Loss condition
      if (healthRef.current <= 0 || energyRef.current <= 0) {
        if (gameState === 'PLAYING') {
            setGameState('LOST');
            soundManager.playLose();
            soundManager.stopMusic(); // Stop loop on loss
        }
        return;
      }

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- 1. DRONE PHYSICS ---
      const dx = mousePos.current.x - drone.current.x;
      const dy = mousePos.current.y - drone.current.y;
      const angle = Math.atan2(dy, dx);
      const dist = Math.hypot(dx, dy);
      
      let speed = droneStats.speed * 3; // Base speed
      let isBoosting = false;

      // Boost Logic (Shift)
      if (keysPressed.current['ShiftLeft'] || keysPressed.current['ShiftRight']) {
        if (energyRef.current > 0.5) {
          speed *= 2;
          energyRef.current -= 0.5; // Boost drains energy
          isBoosting = true;
          if (Math.random() > 0.8) soundManager.playBoost();
        }
      }

      // Movement smoothing
      if (dist > 5) {
        drone.current.vx += Math.cos(angle) * 0.5;
        drone.current.vy += Math.sin(angle) * 0.5;
      }
      
      // Friction
      drone.current.vx *= 0.92;
      drone.current.vy *= 0.92;
      
      // Clamp speed
      const currentSpeed = Math.hypot(drone.current.vx, drone.current.vy);
      if (currentSpeed > speed) {
        const scale = speed / currentSpeed;
        drone.current.vx *= scale;
        drone.current.vy *= scale;
      }

      drone.current.x += drone.current.vx;
      drone.current.y += drone.current.vy;
      
      // Keep in bounds
      drone.current.x = Math.max(20, Math.min(canvas.width - 20, drone.current.x));
      drone.current.y = Math.max(20, Math.min(canvas.height - 20, drone.current.y));

      // Grid Parallax Effect
      gridOffset.current.x -= drone.current.vx * 0.5;
      gridOffset.current.y -= drone.current.vy * 0.5;
      
      // Draw Grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      ctx.beginPath();
      for (let x = gridOffset.current.x % gridSize; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = gridOffset.current.y % gridSize; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // --- 2. ABILITIES (EMP) ---
      if (keysPressed.current['Space'] && droneStats.empRadius > 0) {
        // Debounce manually or check cost
        if (energyRef.current > 30) {
           // Trigger EMP
           soundManager.playZap();
           effects.current.push({
             x: drone.current.x,
             y: drone.current.y,
             radius: 10,
             life: 1.0,
             color: '#34d399'
           });
           energyRef.current -= 30; // Cost
           keysPressed.current['Space'] = false; // Require repress
           addMessage("EMP BLAST!");
           
           // Clear enemies in range
           for(let i = enemies.current.length - 1; i>=0; i--) {
             const e = enemies.current[i];
             if (Math.hypot(e.x - drone.current.x, e.y - drone.current.y) < droneStats.empRadius) {
                enemies.current.splice(i, 1);
                soundManager.playExplosion();
                scoreRef.current += 50; // Increased Bonus points
             }
           }
        } else if (keysPressed.current['Space']) {
          addMessage("LOW ENERGY!");
          keysPressed.current['Space'] = false;
        }
      }

      // --- 3. ENTITIES ---

      // Render Effects
      for (let i = effects.current.length - 1; i >= 0; i--) {
        const eff = effects.current[i];
        eff.radius += 10;
        eff.life -= 0.05;
        if (eff.life <= 0) {
          effects.current.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = eff.life;
        ctx.strokeStyle = eff.color;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(eff.x, eff.y, eff.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Enemies
      for (let i = enemies.current.length - 1; i >= 0; i--) {
        const e = enemies.current[i];
        
        // Cleanup if too far
        if (e.x < -100 || e.x > canvas.width + 100 || e.y < -100 || e.y > canvas.height + 100) {
           enemies.current.splice(i, 1);
           continue;
        }

        // AI: Seeker Logic
        if (e.type === 'SEEKER') {
          const ex = drone.current.x - e.x;
          const ey = drone.current.y - e.y;
          const edist = Math.hypot(ex, ey);
          if (edist > 0) {
            e.x += (ex / edist) * e.speed;
            e.y += (ey / edist) * e.speed;
          }
        } else {
          // Drifting Cloud
          e.x += (Math.sin(Date.now() * 0.001 + i) * 0.5);
          e.y += e.speed;
        }

        // Collision Player
        const distToPlayer = Math.hypot(e.x - drone.current.x, e.y - drone.current.y);
        if (distToPlayer < e.radius + 10) {
           soundManager.playDamage();
           // Reduced Seeker damage from 15 to 10 for better balance
           healthRef.current -= (e.type === 'SEEKER' ? 10 : 0.5);
           setHealth(healthRef.current);
           
           // Pushback
           const pushAngle = Math.atan2(drone.current.y - e.y, drone.current.x - e.x);
           drone.current.vx += Math.cos(pushAngle) * 10;
           drone.current.vy += Math.sin(pushAngle) * 10;

           if (e.type === 'SEEKER') {
             enemies.current.splice(i, 1); // Seekers explode on impact
             soundManager.playExplosion();
             continue;
           }
        }

        // Draw Enemy
        ctx.fillStyle = e.type === 'SEEKER' ? '#dc2626' : 'rgba(100, 116, 139, 0.5)';
        ctx.beginPath();
        if (e.type === 'SEEKER') {
          // Draw Triangle
          ctx.moveTo(e.x + Math.cos(Date.now() * 0.01) * e.radius, e.y + Math.sin(Date.now() * 0.01) * e.radius);
          ctx.lineTo(e.x + Math.cos(Date.now() * 0.01 + 2) * e.radius, e.y + Math.sin(Date.now() * 0.01 + 2) * e.radius);
          ctx.lineTo(e.x + Math.cos(Date.now() * 0.01 + 4) * e.radius, e.y + Math.sin(Date.now() * 0.01 + 4) * e.radius);
        } else {
          ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // Particles (Collectibles)
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        // Cleanup far particles so new ones can spawn
        if (p.x < -100 || p.x > canvas.width + 100 || p.y < -100 || p.y > canvas.height + 100) {
            particles.current.splice(i, 1);
            continue;
        }

        const dist = Math.hypot(p.x - drone.current.x, p.y - drone.current.y);
        const range = droneStats.filterRadius; 

        if (dist < range) {
           p.x += (drone.current.x - p.x) * 0.15; // Magnet
           p.y += (drone.current.y - p.y) * 0.15;
           
           if (dist < 15) {
             if (p.type === 'ENERGY') {
                soundManager.playEnergy();
                energyRef.current = Math.min(maxEnergy.current, energyRef.current + 10);
             } else if (p.type === 'TOKEN') {
                soundManager.playGemCollect();
                tokensRef.current += 1;
                setTokensFound(tokensRef.current);
                addMessage("TOKEN FOUND!");
             } else {
                soundManager.playCollect();
                scoreRef.current += 25; // Increased Score
                setScore(scoreRef.current);
             }
             particles.current.splice(i, 1);
             continue;
           }
        }
        
        // Draw Particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${p.radius * 2}px serif`; // Scale emoji based on radius
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (p.type === 'TOKEN') {
           ctx.shadowBlur = 20;
           ctx.shadowColor = '#3b82f6'; // Blue glow
        } else if (p.type === 'ENERGY') {
           ctx.shadowBlur = 10;
           ctx.shadowColor = '#fcd34d';
        } else {
           ctx.shadowBlur = 0;
        }
        
        ctx.fillText(p.icon, 0, 0);
        ctx.restore();
      }

      // --- 4. DRAW PLAYER ---
      ctx.save();
      ctx.translate(drone.current.x, drone.current.y);
      ctx.rotate(angle + Math.PI / 2); // Face mouse
      
      // Engine Trail
      if (isBoosting || Math.hypot(drone.current.vx, drone.current.vy) > 1) {
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(-5, 25 + Math.random() * 10);
        ctx.lineTo(5, 25 + Math.random() * 10);
        ctx.fillStyle = isBoosting ? '#34d399' : '#60a5fa';
        ctx.fill();
      }

      // Drone Body
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(10, 10);
      ctx.lineTo(0, 5);
      ctx.lineTo(-10, 10);
      ctx.closePath();
      ctx.fill();

      // Lights
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(0, -5, 3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();

      // Shield Overlay (Health low)
      if (healthRef.current < 30) {
         ctx.fillStyle = `rgba(220, 38, 38, ${0.1 + Math.sin(Date.now()*0.01)*0.1})`;
         ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Constant Drain reduced to 0.01 (was 0.02) for fairer gameplay
      energyRef.current -= 0.01;
      setEnergy(Math.floor(energyRef.current));
      
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(requestRef.current);
      clearInterval(spawnInterval);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      
      // Stop music if unmounting while playing (fail-safe)
      soundManager.stopMusic();
    };
  }, [droneStats, gameState, district.pollutionLevel]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 font-Inter">
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
      
      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        
        {/* Left Stats */}
        <div className="flex flex-col gap-2 w-64">
          <div className="bg-slate-900/80 border border-slate-700 p-3 rounded-xl backdrop-blur-md">
             <div className="flex justify-between text-xs text-slate-400 font-bold uppercase mb-1">
               <span className="flex items-center gap-1"><Shield size={12} /> {t.game.hull}</span>
               <span className={health < 30 ? 'text-red-500' : 'text-emerald-400'}>{Math.floor(health)}%</span>
             </div>
             <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
               <div className={`h-full transition-all duration-300 ${health < 30 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${(health / maxHealth.current) * 100}%` }}></div>
             </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700 p-3 rounded-xl backdrop-blur-md">
             <div className="flex justify-between text-xs text-slate-400 font-bold uppercase mb-1">
               <span className="flex items-center gap-1"><Zap size={12} /> {t.game.energy}</span>
               <span className={energy < 30 ? 'text-red-500' : 'text-amber-400'}>{Math.floor(energy)}%</span>
             </div>
             <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
               <div className={`h-full transition-all duration-300 ${energy < 30 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${(energy / maxEnergy.current) * 100}%` }}></div>
             </div>
          </div>
        </div>

        {/* Center Score */}
        <div className="text-center">
           <div className="text-4xl font-black text-white drop-shadow-lg tracking-tighter tabular-nums">
              {score} <span className="text-lg text-slate-500">/ {TARGET_SCORE}</span>
           </div>
           <div className="text-[10px] uppercase tracking-[0.2em] text-emerald-500 font-bold">{t.game.pollutantsCleared}</div>
           
           {/* Token Found Indicator */}
           {tokensFound > 0 && (
             <div className="mt-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 px-2 py-1 rounded-full text-xs font-bold animate-pulse inline-flex items-center gap-1">
               💠 {tokensFound} {t.game.tokensSecured}
             </div>
           )}

           <div className="mt-2 flex flex-col gap-1">
             {messages.map((m, i) => (
               <div key={i} className="text-amber-400 text-sm font-bold animate-bounce">{m}</div>
             ))}
           </div>
        </div>

        {/* Right Controls Hint */}
        <div className="bg-slate-900/80 border border-slate-700 p-3 rounded-xl backdrop-blur-md text-xs text-slate-400 text-right">
           <div className="font-bold text-white mb-1">{t.game.controls}</div>
           <div className="flex items-center justify-end gap-2 mb-1">{t.game.boost} <kbd className="bg-slate-700 px-1 rounded text-white">{t.game.shift}</kbd></div>
           {droneStats.empRadius > 0 && (
              <div className="flex items-center justify-end gap-2">{t.game.empBlast} <kbd className="bg-slate-700 px-1 rounded text-white">{t.game.space}</kbd></div>
           )}
        </div>
      </div>

      {/* Game Over Overlays */}
      {gameState !== 'PLAYING' && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 backdrop-blur-md z-50 animate-in fade-in zoom-in duration-300">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
             
             {gameState === 'WON' ? (
               <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400 ring-2 ring-emerald-500">
                  <Wind size={40} />
               </div>
             ) : (
               <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 ring-2 ring-red-500">
                  <AlertTriangle size={40} />
               </div>
             )}

             <h2 className="text-3xl font-black text-white mb-2">
               {gameState === 'WON' ? t.game.missionAccomplished : t.game.signalLost}
             </h2>
             <p className="text-slate-400 mb-8">
               {gameState === 'WON' ? format(t.game.sectorStabilized, { name: district.name }) : t.game.emergencyRecovery}
             </p>
             
             {gameState === 'WON' && tokensFound > 0 && (
                <div className="mb-6 p-4 bg-blue-900/30 border border-blue-500/50 rounded-xl text-blue-200">
                   <div className="text-xs uppercase font-bold mb-1">{t.game.rareItemsDiscovered}</div>
                   <div className="text-xl font-bold flex items-center justify-center gap-2">
                      💠 {tokensFound} {t.game.impactTokens}
                   </div>
                </div>
             )}

             {gameState === 'WON' && (
                <div className="mb-6 p-4 bg-emerald-900/30 border border-emerald-500/50 rounded-xl">
                   <div className="flex items-start gap-3">
                      <Lightbulb className="text-emerald-400 mt-0.5 flex-shrink-0" size={20} />
                      <div className="flex-1">
                         <div className="text-xs uppercase font-bold text-emerald-400 mb-2">{t.game.whyThisMatters}</div>
                         {loadingTip ? (
                            <div className="text-sm text-emerald-300 animate-pulse">{t.game.loadingAwarenessTip}</div>
                         ) : environmentalTip ? (
                            <p className="text-sm text-emerald-200 leading-relaxed">{environmentalTip}</p>
                         ) : (
                            <p className="text-sm text-emerald-200 leading-relaxed">
                               {t.game.defaultAwarenessTip}
                            </p>
                         )}
                      </div>
                   </div>
                </div>
             )}

             <div className="flex flex-col gap-3">
                <button onClick={() => onComplete(score, gameState === 'WON', tokensFound)} className="w-full py-4 bg-white text-slate-950 font-black uppercase tracking-wider rounded-xl hover:bg-slate-200 transition-colors">
                  {gameState === 'WON' ? t.game.collectReward : t.game.returnToHangar}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
