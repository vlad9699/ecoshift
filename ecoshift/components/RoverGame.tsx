
import React, { useRef, useEffect, useState } from 'react';
import { District, DroneStats } from '../types';
import { Shield, Zap, Crosshair, AlertTriangle, Truck, Battery, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/SoundManager';
import { getEnvironmentalAwarenessTip } from '../services/geminiService';
import { useLanguage } from '../i18n';

interface RoverGameProps {
  district: District;
  droneStats: DroneStats;
  onComplete: (score: number, success: boolean, tokensFound: number, extraStats?: { enemiesDefeated?: number, cratesSmashed?: number }) => void;
  onClose: () => void;
}

// --- ASSETS & CONFIG ---
const ACCEL = 0.15;      // Significantly reduced for heavy feeling
const FRICTION = 0.92;   // Increased drag to stop faster
const MAX_SPEED = 2.8;   // Much lower top speed
const ROTATION_SPEED = 0.05; // Slower turning

const ITEMS = {
  ENERGY: { icon: '⚡', color: '#fcd34d', score: 0, energy: 35 }, // Increased energy restore
  TOKEN: { icon: '💠', color: '#60a5fa', score: 0, token: true },
  DATA: { icon: '💾', color: '#4ade80', score: 50 },
  SAMPLE: { icon: '🧪', color: '#a78bfa', score: 30 },
};

export const RoverGame: React.FC<RoverGameProps> = ({ district, droneStats, onComplete, onClose }) => {
  const { t, format, language } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Game State
  const TARGET_SCORE = 600;
  const [score, setScore] = useState(0);
  const [energy, setEnergy] = useState(droneStats.battery);
  const [health, setHealth] = useState(droneStats.hull);
  const [gameState, setGameState] = useState<'PLAYING' | 'WON' | 'LOST'>('PLAYING');
  const [messages, setMessages] = useState<string[]>([]);
  const [tokensFound, setTokensFound] = useState(0);
  const [environmentalTip, setEnvironmentalTip] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);

  // Refs for Loop (Performance)
  const requestRef = useRef<number>(0);
  const scoreRef = useRef(0);
  const energyRef = useRef(droneStats.battery);
  const healthRef = useRef(droneStats.hull);
  const maxEnergy = useRef(droneStats.battery);
  const maxHealth = useRef(droneStats.hull);
  const tokensRef = useRef(0);
  const shakeRef = useRef(0);
  
  // Stats Tracking
  const enemiesDefeatedRef = useRef(0);
  const cratesSmashedRef = useRef(0);

  // Input
  const keysPressed = useRef<Record<string, boolean>>({});
  const mousePos = useRef({ x: 0, y: 0 });

  // --- ENTITIES ---
  const rover = useRef({ 
    x: 100, y: 100, 
    vx: 0, vy: 0, 
    rotation: 0, // Body rotation
    turretRotation: 0, // Gun rotation
    radius: 22
  });

  // Tracks (Persistent background drawing)
  const tracksCanvas = useRef<HTMLCanvasElement | null>(null);

  const particles = useRef<any[]>([]);
  const projectiles = useRef<any[]>([]);
  const enemies = useRef<any[]>([]);
  const items = useRef<any[]>([]);
  const obstacles = useRef<any[]>([]);
  const crates = useRef<any[]>([]); // Destructible

  // --- HELPERS ---
  const addMessage = (msg: string) => {
    setMessages(prev => [...prev.slice(-2), msg]);
    setTimeout(() => setMessages(prev => prev.slice(1)), 2000);
  };

  const addShake = (amount: number) => {
    shakeRef.current = amount;
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

  // Generate Level
  const initLevel = (width: number, height: number) => {
    // 1. Static Obstacles (Walls)
    const obs = [];
    // Border walls
    obs.push({ x: -50, y: 0, w: 50, h: height });
    obs.push({ x: width, y: 0, w: 50, h: height });
    obs.push({ x: 0, y: -50, w: width, h: 50 });
    obs.push({ x: 0, y: height, w: width, h: 50 });

    // Random Blocks
    for(let i=0; i<8; i++) {
       const w = 60 + Math.random() * 100;
       const h = 60 + Math.random() * 100;
       const x = 100 + Math.random() * (width - 200 - w);
       const y = 100 + Math.random() * (height - 200 - h);
       
       // Don't spawn on player start
       if (Math.hypot(x - 100, y - 100) > 200) {
          obs.push({ x, y, w, h });
       }
    }
    obstacles.current = obs;

    // 2. Crates (Destructible) - Increased initial count
    const crts = [];
    for(let i=0; i<20; i++) {
        let valid = false;
        let cx = 0, cy = 0;
        let attempts = 0;
        while(!valid && attempts < 20) {
            cx = 50 + Math.random() * (width - 100);
            cy = 50 + Math.random() * (height - 100);
            valid = true;
            // Check overlap with obstacles
            for(const o of obs) {
                if (cx > o.x - 40 && cx < o.x + o.w + 40 && cy > o.y - 40 && cy < o.y + o.h + 40) valid = false;
            }
            // Check start
            if (Math.hypot(cx - 100, cy - 100) < 150) valid = false;
            attempts++;
        }
        if (valid) crts.push({ x: cx, y: cy, hp: 3, radius: 20 });
    }
    crates.current = crts;
    
    // 3. Initial Energy Packs (Free loot)
    items.current = [];
    for(let i=0; i<5; i++) {
       items.current.push({ 
         ...ITEMS.ENERGY, 
         x: 200 + Math.random() * (width - 400), 
         y: 200 + Math.random() * (height - 400),
         life: 9999
       });
    }

    // 4. Init Offscreen Canvas for tracks
    if (!tracksCanvas.current) {
        tracksCanvas.current = document.createElement('canvas');
        tracksCanvas.current.width = width;
        tracksCanvas.current.height = height;
    }
  };

  useEffect(() => {
    soundManager.startMusic();
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initLevel(canvas.width, canvas.height);
      // Reset player position safe
      rover.current.x = 100;
      rover.current.y = 100;
    };
    window.addEventListener('resize', resize);
    resize();

    const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.code] = false; };
    const handleMouseMove = (e: MouseEvent) => { mousePos.current = { x: e.clientX, y: e.clientY }; };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);

    // --- SPAWNER ---
    const spawnInterval = setInterval(() => {
       if (gameState !== 'PLAYING') return;
       
       // 1. SPAWN ENEMIES (Aggressive difficulty scaling)
       // Cap increases with pollution level. At 50% pollution, cap is ~13.
       const difficultyCap = 12 + (district.pollutionLevel / 6);
       
       if (enemies.current.length < difficultyCap) {
           // Pick random edge
           const edge = Math.floor(Math.random()*4);
           let ex = 0, ey = 0;
           if (edge === 0) { ex = Math.random() * canvas.width; ey = -40; } // Top
           else if (edge === 1) { ex = canvas.width + 40; ey = Math.random() * canvas.height; } // Right
           else if (edge === 2) { ex = Math.random() * canvas.width; ey = canvas.height + 40; } // Bottom
           else { ex = -40; ey = Math.random() * canvas.height; } // Left

           const rand = Math.random();
           // 30% Tank, 50% Beetle, 20% Drone (New)
           let type = 'BEETLE';
           if (rand > 0.8) type = 'DRONE';
           else if (rand > 0.5) type = 'TANK';
           
           enemies.current.push({
               x: ex, y: ey,
               type: type,
               hp: type === 'TANK' ? 6 : (type === 'DRONE' ? 2 : 2),
               radius: type === 'TANK' ? 28 : (type === 'DRONE' ? 14 : 16),
               speed: type === 'TANK' ? 1.0 : (type === 'DRONE' ? 1.8 : 3.2),
               cooldown: 0 // For shooting
           });
       }
       
       // 2. SPAWN NEW CRATES (Respawn Logic)
       if (crates.current.length < 12 && Math.random() > 0.5) {
           let valid = false;
           let attempts = 0;
           let cx = 0, cy = 0;
           
           while(!valid && attempts < 5) {
              cx = 50 + Math.random() * (canvas.width - 100);
              cy = 50 + Math.random() * (canvas.height - 100);
              valid = true;
              // Check overlap
              for(const o of obstacles.current) {
                  if (cx > o.x - 40 && cx < o.x + o.w + 40 && cy > o.y - 40 && cy < o.y + o.h + 40) valid = false;
              }
              // Don't spawn on player
              if (Math.hypot(cx - rover.current.x, cy - rover.current.y) < 150) valid = false;
              attempts++;
           }

           if (valid) {
               particles.current.push({ x: cx, y: cy, vx: 0, vy: 0, life: 0.5, radius: 20, color: '#fff' });
               crates.current.push({ x: cx, y: cy, hp: 3, radius: 20 });
           }
       }

       // 3. SPAWN FREE ENERGY (Help player if low)
       if (Math.random() > 0.9 && items.current.length < 8) {
           const ix = 50 + Math.random() * (canvas.width - 100);
           const iy = 50 + Math.random() * (canvas.height - 100);
           let inside = false;
           for(const o of obstacles.current) {
              if (ix > o.x && ix < o.x + o.w && iy > o.y && iy < o.y + o.h) inside = true;
           }
           if (!inside) {
             items.current.push({ ...ITEMS.ENERGY, x: ix, y: iy, life: 1200 });
           }
       }

    }, 800); // Faster spawn cycle (was 1000)


    // --- GAME LOOP ---
    const animate = () => {
      // --- 1. LOGIC ---
      if (scoreRef.current >= TARGET_SCORE && gameState === 'PLAYING') {
         setGameState('WON');
         soundManager.playWin();
         return;
      }
      if ((healthRef.current <= 0 || energyRef.current <= 0) && gameState === 'PLAYING') {
         setGameState('LOST');
         soundManager.playLose();
         return;
      }

      // ROVER PHYSICS
      let ax = 0;
      let ay = 0;
      if (keysPressed.current['KeyW'] || keysPressed.current['ArrowUp']) ay = -1;
      if (keysPressed.current['KeyS'] || keysPressed.current['ArrowDown']) ay = 1;
      if (keysPressed.current['KeyA'] || keysPressed.current['ArrowLeft']) ax = -1;
      if (keysPressed.current['KeyD'] || keysPressed.current['ArrowRight']) ax = 1;

      // Normalize
      if (ax !== 0 || ay !== 0) {
          const len = Math.hypot(ax, ay);
          ax /= len; ay /= len;
          
          // Accelerate
          rover.current.vx += ax * ACCEL;
          rover.current.vy += ay * ACCEL;
          
          // Rotate body towards movement
          const targetRot = Math.atan2(ay, ax);
          let diff = targetRot - rover.current.rotation;
          while (diff > Math.PI) diff -= Math.PI * 2;
          while (diff < -Math.PI) diff += Math.PI * 2;
          rover.current.rotation += diff * ROTATION_SPEED;

          // Dust
          if (Math.random() > 0.6) {
              particles.current.push({
                  x: rover.current.x + (Math.random()-0.5)*20,
                  y: rover.current.y + (Math.random()-0.5)*20,
                  vx: (Math.random()-0.5)*0.5,
                  vy: (Math.random()-0.5)*0.5,
                  life: 1.0,
                  radius: 5 + Math.random()*5,
                  color: '#a1a1aa'
              });
          }
      }

      // Friction
      rover.current.vx *= FRICTION;
      rover.current.vy *= FRICTION;
      
      // Speed Cap
      // Use droneStats.speed as multiplier for MAX_SPEED. Base is 1.
      const speedCap = MAX_SPEED * (droneStats.speed > 1 ? droneStats.speed : 1);

      const currentSpeed = Math.hypot(rover.current.vx, rover.current.vy);
      if (currentSpeed > speedCap) {
         const scale = speedCap / currentSpeed;
         rover.current.vx *= scale;
         rover.current.vy *= scale;
      }

      // Turret Aiming
      const angleToMouse = Math.atan2(mousePos.current.y - rover.current.y, mousePos.current.x - rover.current.x);
      rover.current.turretRotation = angleToMouse;

      // COLLISION (Wall Sliding)
      const moveAndCollide = (dx: number, dy: number) => {
         const nextX = rover.current.x + dx;
         const nextY = rover.current.y + dy;
         const r = rover.current.radius;

         const check = (cx: number, cy: number) => {
             for(const o of obstacles.current) {
                 if (cx + r > o.x && cx - r < o.x + o.w && cy + r > o.y && cy - r < o.y + o.h) return true;
             }
             for(const c of crates.current) {
                 if (Math.hypot(cx - c.x, cy - c.y) < r + c.radius) return true;
             }
             return false;
         }

         if (!check(nextX, rover.current.y)) {
             rover.current.x = nextX;
         } else {
             rover.current.vx *= -0.2;
             addShake(1);
         }

         if (!check(rover.current.x, nextY)) {
             rover.current.y = nextY;
         } else {
             rover.current.vy *= -0.2;
             addShake(1);
         }
      };
      
      moveAndCollide(rover.current.vx, rover.current.vy);

      // DRAW TRACKS
      if (tracksCanvas.current && (Math.abs(rover.current.vx) > 0.5 || Math.abs(rover.current.vy) > 0.5)) {
          const tCtx = tracksCanvas.current.getContext('2d');
          if (tCtx) {
             tCtx.save();
             tCtx.translate(rover.current.x, rover.current.y);
             tCtx.rotate(rover.current.rotation);
             tCtx.fillStyle = 'rgba(0,0,0,0.05)';
             tCtx.fillRect(-15, -5, 10, 10);
             tCtx.fillRect(5, -5, 10, 10);
             tCtx.restore();
          }
      }

      // PLAYER SHOOTING
      if (keysPressed.current['Space'] || keysPressed.current['Click']) { 
          // Adjusted fire rates: Base is slower (94% skip), Upgraded is fast (80% skip)
          // This makes the "Rapid Fire" upgrade feel much more significant.
          const fireChance = droneStats.empRadius > 0 ? 0.80 : 0.94;

          if (Math.random() > fireChance) { 
              soundManager.playZap();
              addShake(3);
              rover.current.vx -= Math.cos(rover.current.turretRotation) * 0.4;
              rover.current.vy -= Math.sin(rover.current.turretRotation) * 0.4;

              projectiles.current.push({
                  x: rover.current.x + Math.cos(rover.current.turretRotation) * 30,
                  y: rover.current.y + Math.sin(rover.current.turretRotation) * 30,
                  vx: Math.cos(rover.current.turretRotation) * 12,
                  vy: Math.sin(rover.current.turretRotation) * 12,
                  life: 60,
                  type: 'PLAYER',
                  color: '#facc15'
              });
              
              particles.current.push({
                  x: rover.current.x + Math.cos(rover.current.turretRotation) * 40,
                  y: rover.current.y + Math.sin(rover.current.turretRotation) * 40,
                  vx: 0, vy: 0, life: 0.1, radius: 15, color: '#fff'
              });
          }
      }

      // --- UPDATES & COLLISIONS ---

      // Projectiles
      for (let i = projectiles.current.length - 1; i >= 0; i--) {
          const p = projectiles.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life--;
          
          let hit = false;
          
          // 1. Wall Hit (Drones fly over walls, but projectiles might hit?)
          // Let's say walls block projectiles for logic simplicity
          for(const o of obstacles.current) {
              if (p.x > o.x && p.x < o.x + o.w && p.y > o.y && p.y < o.y + o.h) { hit = true; break; }
          }
          
          // 2. Player Hit (Enemy Projectile)
          if (!hit && p.type === 'ENEMY') {
              if (Math.hypot(p.x - rover.current.x, p.y - rover.current.y) < rover.current.radius) {
                  hit = true;
                  soundManager.playDamage();
                  addShake(4);
                  healthRef.current -= 8; // Tank/Drone shot damage
                  setHealth(healthRef.current);
                  particles.current.push({ x: p.x, y: p.y, vx: 0, vy: 0, life: 0.3, radius: 10, color: '#ef4444' });
              }
          }

          // 3. Crate Hit (Both)
          if (!hit) {
              for (let c = crates.current.length - 1; c >= 0; c--) {
                 const crate = crates.current[c];
                 if (Math.hypot(p.x - crate.x, p.y - crate.y) < crate.radius + 5) {
                     crate.hp--;
                     hit = true;
                     soundManager.playDamage();
                     if (crate.hp <= 0) {
                         cratesSmashedRef.current++; // STAT TRACKING
                         crates.current.splice(c, 1);
                         soundManager.playExplosion();
                         const rand = Math.random();
                         let type = 'DATA';
                         if (rand > 0.9) type = 'TOKEN';
                         else if (rand > 0.5) type = 'ENERGY'; // 40% Energy chance
                         else if (rand > 0.3) type = 'SAMPLE';
                         items.current.push({ ...ITEMS[type as keyof typeof ITEMS], x: crate.x, y: crate.y, life: 800 });
                         for(let k=0; k<10; k++) particles.current.push({ x: crate.x, y: crate.y, vx: (Math.random()-0.5)*5, vy: (Math.random()-0.5)*5, life: 1.0, radius: 5+Math.random()*5, color: '#f97316' });
                     } else {
                         particles.current.push({ x: crate.x, y: crate.y, vx: 0, vy: 0, life: 0.1, radius: crate.radius, color: '#fff' });
                     }
                     break;
                 }
              }
          }
          
          // 4. Enemy Hit (Player Projectile)
          if (!hit && p.type === 'PLAYER') {
              for (let e = enemies.current.length - 1; e >= 0; e--) {
                 const en = enemies.current[e];
                 // Hitbox slightly larger for easier hits
                 if (Math.hypot(p.x - en.x, p.y - en.y) < en.radius + 10) {
                     en.hp--;
                     hit = true;
                     if (en.hp <= 0) {
                         enemiesDefeatedRef.current++; // STAT TRACKING
                         enemies.current.splice(e, 1);
                         soundManager.playExplosion();
                         let points = 40;
                         if (en.type === 'TANK') points = 100;
                         if (en.type === 'DRONE') points = 60;
                         
                         scoreRef.current += points;
                         setScore(scoreRef.current);
                         for(let k=0; k<8; k++) particles.current.push({ x: en.x, y: en.y, vx: (Math.random()-0.5)*4, vy: (Math.random()-0.5)*4, life: 0.8, radius: 3+Math.random()*4, color: en.type === 'TANK' ? '#166534' : '#7f1d1d' });
                     } else {
                         particles.current.push({ x: en.x, y: en.y, vx: 0, vy: 0, life: 0.1, radius: en.radius, color: '#fff' });
                     }
                     break;
                 }
              }
          }

          if (hit || p.life <= 0) {
              projectiles.current.splice(i, 1);
              if (hit) particles.current.push({ x: p.x, y: p.y, vx: 0, vy: 0, life: 0.2, radius: 5, color: p.color });
          }
      }

      // Enemies
      for (let i = enemies.current.length - 1; i >= 0; i--) {
          const e = enemies.current[i];
          
          // AI: Move to player
          const dx = rover.current.x - e.x;
          const dy = rover.current.y - e.y;
          const dist = Math.hypot(dx, dy);
          
          // TANK SHOOTING LOGIC
          if (e.type === 'TANK' || e.type === 'DRONE') {
              e.cooldown = (e.cooldown || 0) - 1;
              
              // Drones shoot faster but weaker? No, same proj for now for simplicity
              const fireRange = e.type === 'DRONE' ? 200 : 300;
              const fireRate = e.type === 'DRONE' ? 80 : 100;

              if (dist < fireRange && e.cooldown <= 0) {
                  e.cooldown = fireRate + Math.random() * 20;
                  const angle = Math.atan2(dy, dx);
                  projectiles.current.push({
                      x: e.x + Math.cos(angle) * 20,
                      y: e.y + Math.sin(angle) * 20,
                      vx: Math.cos(angle) * 5, // Slightly slower than player
                      vy: Math.sin(angle) * 5,
                      life: 60,
                      type: 'ENEMY',
                      color: e.type === 'DRONE' ? '#06b6d4' : '#ef4444'
                  });
                  soundManager.playZap();
              }
          }

          if (dist > 0) {
              if (e.type === 'DRONE') {
                 // FLYING: Ignore obstacles
                 const angle = Math.atan2(dy, dx);
                 e.x += Math.cos(angle) * e.speed;
                 e.y += Math.sin(angle) * e.speed;
                 
                 // Hover sway
                 e.x += Math.sin(Date.now() * 0.005 + i) * 0.5;
                 e.y += Math.cos(Date.now() * 0.005 + i) * 0.5;

              } else {
                 // GROUND: Obstacle collision
                  let mx = (dx / dist) * e.speed;
                  let my = (dy / dist) * e.speed;
                  
                  // Repulsion
                  for(let j=0; j<enemies.current.length; j++) {
                      if (i === j) continue;
                      const other = enemies.current[j];
                      const d = Math.hypot(e.x - other.x, e.y - other.y);
                      if (d < e.radius * 2) {
                          mx -= (other.x - e.x) * 0.05;
                          my -= (other.y - e.y) * 0.05;
                      }
                  }

                  // Collision checks for enemy movement
                  let blockedX = false;
                  for(const o of obstacles.current) if (e.x + mx + e.radius > o.x && e.x + mx - e.radius < o.x + o.w && e.y + e.radius > o.y && e.y - e.radius < o.y + o.h) blockedX = true;
                  if (!blockedX) e.x += mx;

                  let blockedY = false;
                  for(const o of obstacles.current) if (e.x + e.radius > o.x && e.x - e.radius < o.x + o.w && e.y + my + e.radius > o.y && e.y + my - e.radius < o.y + o.h) blockedY = true;
                  if (!blockedY) e.y += my;
              }
          }

          // Player Ram Collision
          // Drones are flying, can they be rammed? Yes, let's say hover height hits turret
          if (dist < e.radius + rover.current.radius) {
              soundManager.playDamage();
              addShake(5);
              healthRef.current -= (e.type === 'TANK' ? 1 : 3); 
              setHealth(healthRef.current);
              rover.current.vx += (rover.current.x - e.x) * 0.1;
              rover.current.vy += (rover.current.y - e.y) * 0.1;
              
              if (e.type === 'DRONE') {
                  // Drones bounce off easily
                  e.x -= (dx/dist) * 20;
                  e.y -= (dy/dist) * 20;
              } else {
                  e.x -= (dx/dist) * 10;
                  e.y -= (dy/dist) * 10;
              }
          }
      }

      // Items
      for (let i = items.current.length - 1; i >= 0; i--) {
          const item = items.current[i];
          item.life--;
          const dx = rover.current.x - item.x;
          const dy = rover.current.y - item.y;
          const dist = Math.hypot(dx, dy);
          
          // Use droneStats.filterRadius to extend collection range
          const collectionRange = 60 * (droneStats.filterRadius > 50 ? 1.5 : 1);

          if (dist < collectionRange) {
             item.x += dx * 0.1;
             item.y += dy * 0.1;
             if (dist < 25) {
                 if (item.token) {
                     soundManager.playGemCollect();
                     addMessage("TOKEN SECURED!");
                     tokensRef.current++;
                     setTokensFound(tokensRef.current);
                 } else if (item.energy) {
                     soundManager.playEnergy();
                     addMessage("ENERGY RECHARGED");
                     energyRef.current = Math.min(maxEnergy.current, energyRef.current + item.energy);
                     setEnergy(Math.floor(energyRef.current));
                 } else {
                     soundManager.playCollect();
                     scoreRef.current += item.score;
                     setScore(scoreRef.current);
                 }
                 items.current.splice(i, 1);
                 continue;
             }
          }
          if (item.life <= 0) items.current.splice(i, 1);
      }

      // Particles
      for (let i = particles.current.length - 1; i >= 0; i--) {
          const p = particles.current[i];
          p.x += p.vx; p.y += p.vy;
          p.life -= 0.05;
          if (p.life <= 0) particles.current.splice(i, 1);
      }

      // --- 3. RENDER ---
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.save();
      if (shakeRef.current > 0) {
          const dx = (Math.random() - 0.5) * shakeRef.current;
          const dy = (Math.random() - 0.5) * shakeRef.current;
          ctx.translate(dx, dy);
          shakeRef.current *= 0.9;
          if (shakeRef.current < 0.5) shakeRef.current = 0;
      }

      // Ground Grid
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 2;
      const gs = 100;
      ctx.beginPath();
      for(let x=0; x<canvas.width; x+=gs) { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
      for(let y=0; y<canvas.height; y+=gs) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
      ctx.stroke();

      // Tracks
      if (tracksCanvas.current) {
          ctx.drawImage(tracksCanvas.current, 0, 0);
      }

      // Obstacles
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#000';
      for(const o of obstacles.current) {
          ctx.fillStyle = '#1f2937';
          ctx.fillRect(o.x, o.y+o.h, o.w, 15);
          ctx.fillStyle = '#374151';
          ctx.fillRect(o.x, o.y, o.w, o.h);
          ctx.fillStyle = '#4b5563';
          ctx.fillRect(o.x + 10, o.y + 10, o.w - 20, o.h - 20);
      }
      ctx.shadowBlur = 0;

      // Crates
      for(const c of crates.current) {
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.fillStyle = '#d97706';
          ctx.fillRect(-15, -15, 30, 30);
          ctx.strokeStyle = '#fcd34d';
          ctx.strokeRect(-15, -15, 30, 30);
          ctx.beginPath();
          ctx.moveTo(-15, -15); ctx.lineTo(15, 15);
          ctx.moveTo(15, -15); ctx.lineTo(-15, 15);
          ctx.stroke();
          ctx.restore();
      }

      // Items
      for(const item of items.current) {
          ctx.save();
          ctx.translate(item.x, item.y + Math.sin(Date.now() * 0.005) * 5);
          ctx.font = "24px serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.shadowColor = item.color;
          ctx.shadowBlur = 20;
          ctx.fillText(item.icon, 0, 0);
          ctx.restore();
      }

      // Enemies
      for(const e of enemies.current) {
          ctx.save();
          ctx.translate(e.x, e.y);
          
          if (e.type === 'TANK') {
              const rot = Math.atan2(rover.current.y - e.y, rover.current.x - e.x);
              ctx.rotate(rot);
              ctx.fillStyle = '#064e3b';
              ctx.fillRect(-20, -20, 40, 40);
              ctx.fillStyle = '#000';
              ctx.fillRect(0, -5, 30, 10);
              ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI*2); ctx.fillStyle='#065f46'; ctx.fill();
          } else if (e.type === 'DRONE') {
              // Shadow (Simulate height)
              ctx.fillStyle = 'rgba(0,0,0,0.5)';
              ctx.beginPath(); ctx.arc(0, 30, 10, 0, Math.PI*2); ctx.fill();
              
              // Drone Body
              const rot = Math.atan2(rover.current.y - e.y, rover.current.x - e.x);
              ctx.rotate(rot);
              
              ctx.fillStyle = '#0891b2'; // Cyan
              ctx.beginPath();
              ctx.moveTo(15, 0);
              ctx.lineTo(-10, 12);
              ctx.lineTo(-10, -12);
              ctx.closePath();
              ctx.fill();
              
              // Core
              ctx.fillStyle = '#22d3ee';
              ctx.beginPath(); ctx.arc(0, 0, 5, 0, Math.PI*2); ctx.fill();
          } else {
              // BEETLE
              const rot = Math.atan2(rover.current.y - e.y, rover.current.x - e.x);
              ctx.rotate(rot);
              ctx.fillStyle = '#7f1d1d';
              ctx.beginPath();
              ctx.ellipse(0, 0, 15, 10, 0, 0, Math.PI*2);
              ctx.fill();
              const w = Math.sin(Date.now() * 0.02) * 5;
              ctx.strokeStyle = '#000';
              ctx.beginPath();
              ctx.moveTo(5, 5); ctx.lineTo(10, 15+w);
              ctx.moveTo(5, -5); ctx.lineTo(10, -15-w);
              ctx.moveTo(-5, 5); ctx.lineTo(-10, 15-w);
              ctx.moveTo(-5, -5); ctx.lineTo(-10, -15+w);
              ctx.stroke();
          }
          ctx.restore();
      }

      // Projectiles
      for(const p of projectiles.current) {
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
          ctx.fill();
          ctx.shadowBlur = 0;
      }

      // Particles
      for(const p of particles.current) {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI*2);
          ctx.fill();
          ctx.globalAlpha = 1;
      }

      // PLAYER ROVER
      ctx.save();
      ctx.translate(rover.current.x, rover.current.y);
      
      ctx.save();
      ctx.rotate(rover.current.rotation);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-20, -15, 40, 30);
      ctx.fillStyle = '#18181b';
      ctx.fillRect(-22, -20, 12, 8);
      ctx.fillRect(10, -20, 12, 8);
      ctx.fillRect(-22, 12, 12, 8);
      ctx.fillRect(10, 12, 12, 8);
      ctx.fillStyle = '#000';
      ctx.globalAlpha = 0.2;
      ctx.fillRect(-10, -15, 5, 30);
      ctx.fillRect(5, -15, 5, 30);
      ctx.restore();

      ctx.rotate(rover.current.turretRotation);
      ctx.fillStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, Math.PI*2);
      ctx.fill();
      ctx.fillStyle = '#9ca3af';
      ctx.fillRect(0, -4, 25, 8);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(25, 0);
      ctx.lineTo(500, 0);
      ctx.stroke();

      ctx.restore();

      ctx.restore();

      energyRef.current -= 0.015; // Slightly reduced drain
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
       soundManager.stopMusic();
    };
  }, [droneStats, gameState]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 font-Inter cursor-crosshair">
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* UI OVERLAY */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none select-none">
        {/* Stats */}
        <div className="flex flex-col gap-2 w-64">
           <div className="bg-slate-900/80 border border-amber-500 p-3 rounded-xl backdrop-blur-md shadow-lg">
             <div className="flex justify-between text-xs text-amber-200 font-bold uppercase mb-1">
               <span className="flex items-center gap-1"><Shield size={12} /> {t.game.armor}</span>
               <span>{Math.floor(health)}%</span>
             </div>
             <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-amber-500 transition-all duration-200" style={{ width: `${(health / maxHealth.current) * 100}%` }}></div>
             </div>
           </div>
           <div className="bg-slate-900/80 border border-amber-500 p-3 rounded-xl backdrop-blur-md shadow-lg">
             <div className="flex justify-between text-xs text-amber-200 font-bold uppercase mb-1">
               <span className="flex items-center gap-1"><Battery size={12} /> {t.game.fuelCell}</span>
               <span className={energy < 20 ? 'text-red-500 animate-pulse' : 'text-white'}>{Math.floor(energy)}%</span>
             </div>
             <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
               <div className={`h-full transition-all duration-200 ${energy < 20 ? 'bg-red-500' : 'bg-yellow-400'}`} style={{ width: `${(energy / maxEnergy.current) * 100}%` }}></div>
             </div>
           </div>
        </div>

        {/* Score */}
        <div className="text-center pointer-events-auto">
            <div className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(245,158,11,0.5)] tracking-tighter tabular-nums">
               {score}
            </div>
            <div className="text-xs font-mono text-amber-400 tracking-widest mt-1">{t.game.target}: {TARGET_SCORE}</div>
            
            {tokensFound > 0 && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400 rounded-full text-blue-300 text-xs font-bold animate-pulse">
                   <span>💠</span> {tokensFound} TOKENS FOUND
                </div>
            )}

            <div className="mt-4 flex flex-col items-center gap-1">
                {messages.map((m, i) => (
                   <div key={i} className="text-white font-bold text-sm bg-black/50 px-2 py-1 rounded animate-bounce">{m}</div>
                ))}
            </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-900/80 border border-amber-500 p-4 rounded-xl backdrop-blur-md text-right shadow-lg">
            <div className="text-amber-500 font-black text-sm mb-2 uppercase tracking-widest">{t.game.controls}</div>
            <div className="text-xs text-slate-300 space-y-1 font-mono">
               <div>MOVE <span className="text-white bg-slate-700 px-1 rounded">W</span><span className="text-white bg-slate-700 px-1 rounded">A</span><span className="text-white bg-slate-700 px-1 rounded">S</span><span className="text-white bg-slate-700 px-1 rounded">D</span></div>
               <div>AIM <span className="text-white">MOUSE</span></div>
               <div>FIRE <span className="text-white bg-slate-700 px-1 rounded">SPACE</span></div>
            </div>
        </div>
      </div>

      {/* GAME OVER SCREEN */}
      {gameState !== 'PLAYING' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-[100] animate-in fade-in duration-500">
           <div className="max-w-md w-full bg-slate-900 border-2 border-amber-500 p-8 rounded-3xl text-center shadow-[0_0_50px_rgba(245,158,11,0.2)]">
              <div className="w-24 h-24 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-6 border-4 border-slate-700">
                 {gameState === 'WON' ? <Truck size={48} className="text-amber-500" /> : <AlertTriangle size={48} className="text-red-500" />}
              </div>
              
              <h2 className="text-4xl font-black text-white mb-2 uppercase italic">{gameState === 'WON' ? t.game.sectorSecured : t.game.criticalFailure}</h2>
              <p className="text-slate-400 mb-8 font-mono">
                 {gameState === 'WON' ? format(t.game.areaRestored, { score }) : t.game.roverSignalLost}
              </p>

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

              <button 
                onClick={() => onComplete(score, gameState === 'WON', tokensFound, { enemiesDefeated: enemiesDefeatedRef.current, cratesSmashed: cratesSmashedRef.current })}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-lg uppercase tracking-widest rounded-xl transition-transform hover:scale-105"
              >
                 {gameState === 'WON' ? t.game.completeMission : t.game.abortMission}
              </button>
           </div>
        </div>
      )}
    </div>
  );
};
