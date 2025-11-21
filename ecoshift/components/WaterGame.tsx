
import React, { useRef, useEffect, useState } from 'react';
import { District, DroneStats } from '../types';
import { Zap, Shield, Wind, AlertTriangle, Anchor, Droplets, Lightbulb } from 'lucide-react';
import { soundManager } from '../utils/SoundManager';
import { getEnvironmentalAwarenessTip } from '../services/geminiService';
import { useLanguage } from '../i18n';

interface WaterGameProps {
  district: District;
  droneStats: DroneStats;
  onComplete: (score: number, success: boolean, tokensFound: number) => void;
  onClose: () => void;
}

// Icons for Water trash
const TRASH_ICONS = ['🛢️', '🛍️', '🧴', '👟', '🥡', '🕸️']; 
const ENERGY_ICONS = ['⚡', '🔋'];
const FISH_ICONS = ['🐠', '🐡', '🦑', '🦀'];

export const WaterGame: React.FC<WaterGameProps> = ({ district, droneStats, onComplete, onClose }) => {
  const { t, language } = useLanguage();
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
  const sub = useRef({ 
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
    rotation: number
  }[]>([]);

  const bubbles = useRef<{x: number, y: number, size: number, speed: number, opacity: number}[]>([]);

  const enemies = useRef<{x: number, y: number, radius: number, speed: number, type: 'FISH' | 'MINE' | 'SHARK', icon: string}[]>([]);
  const effects = useRef<{x: number, y: number, radius: number, life: number, color: string}[]>([]);

  const gridOffset = useRef({ x: 0, y: 0 });

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
    soundManager.startMusic();
    soundManager.startOceanAmbience();

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

    const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.code] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.code] = false; };
    const handleMouseMove = (e: MouseEvent) => { mousePos.current = { x: e.clientX, y: e.clientY }; };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);

    // --- SPAWNER ---
    const spawnInterval = setInterval(() => {
      if (gameState !== 'PLAYING') return;

      // 1. Trash Spawner
      if (particles.current.length < 35) {
         let type: 'POLLUTION' | 'ENERGY' | 'TOKEN' = 'POLLUTION';
         let iconList = TRASH_ICONS;
         
         const rand = Math.random();
         if (rand > 0.99) {
            type = 'TOKEN';
            iconList = ['💠']; 
         } else if (rand > 0.85) {
            type = 'ENERGY';
            iconList = ENERGY_ICONS;
         }
         
         const side = Math.floor(Math.random() * 4);
         let startX = 0, startY = 0, velX = 0, velY = 0;
         const speed = 0.5 + Math.random() * 0.5; // Slower in water

         if (side === 0) { startX = Math.random() * canvas.width; startY = -40; velY = speed; }
         else if (side === 1) { startX = canvas.width + 40; startY = Math.random() * canvas.height; velX = -speed; }
         else if (side === 2) { startX = Math.random() * canvas.width; startY = canvas.height + 40; velY = -speed; }
         else { startX = -40; startY = Math.random() * canvas.height; velX = speed; }
         
         particles.current.push({
           x: startX, y: startY, type,
           radius: type === 'TOKEN' ? 20 : 18,
           vx: velX, vy: velY,
           icon: iconList[Math.floor(Math.random() * iconList.length)],
           rotation: Math.random() * Math.PI * 2
         });
      }

      // 2. Enemies (Mines, Fish, Sharks)
      if (enemies.current.length < 10) {
        const rand = Math.random();
        let type: 'FISH' | 'MINE' | 'SHARK' = 'FISH';
        
        // 20% Shark, 30% Mine, 50% Fish
        if (rand < 0.2) type = 'SHARK';
        else if (rand < 0.5) type = 'MINE';
        
        const side = Math.floor(Math.random() * 4);
        let startX = 0, startY = 0;
        if (side === 0) { startX = Math.random() * canvas.width; startY = -50; }
        else if (side === 1) { startX = canvas.width + 50; startY = Math.random() * canvas.height; }
        else if (side === 2) { startX = Math.random() * canvas.width; startY = canvas.height + 50; }
        else { startX = -50; startY = Math.random() * canvas.height; }

        let speed = 1.5;
        let radius = 30;
        let icon = FISH_ICONS[Math.floor(Math.random() * FISH_ICONS.length)];

        if (type === 'MINE') {
            speed = 0.2;
            radius = 35;
            icon = '💣';
        } else if (type === 'SHARK') {
            speed = 1.2;
            radius = 45;
            icon = '🦈';
        }

        enemies.current.push({
          x: startX, y: startY,
          radius, speed, type, icon
        });
      }

      // 3. Ambient Background Bubbles
      if (Math.random() > 0.8) {
         bubbles.current.push({
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            size: 2 + Math.random() * 4,
            speed: 1 + Math.random() * 2,
            opacity: 0.1 + Math.random() * 0.2
         });
      }
    }, 200);

    // --- GAME LOOP ---
    const animate = () => {
      if (scoreRef.current >= TARGET_SCORE && gameState === 'PLAYING') {
        setGameState('WON');
        soundManager.playWin();
        soundManager.stopMusic();
        soundManager.stopAmbience();
        return;
      }
      if ((healthRef.current <= 0 || energyRef.current <= 0) && gameState === 'PLAYING') {
        setGameState('LOST');
        soundManager.playLose();
        soundManager.stopMusic();
        soundManager.stopAmbience();
        return;
      }

      // --- BACKGROUND RENDER ---
      
      // 1. Realistic Ocean Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#06b6d4');   // Cyan 500 - Surface
      gradient.addColorStop(0.3, '#0284c7'); // Sky 600
      gradient.addColorStop(0.6, '#1e3a8a'); // Blue 900 - Mid depth
      gradient.addColorStop(1, '#020617');   // Slate 950 - Deep
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.001;

      // 2. Sun Rays (God Rays)
      ctx.save();
      ctx.globalCompositeOperation = 'overlay'; 
      for (let i = 0; i < 6; i++) {
         const xOffset = (canvas.width / 5) * i;
         const sway = Math.sin(time + i) * 50;
         
         const rayGrad = ctx.createLinearGradient(xOffset + sway, 0, xOffset - sway + 100, canvas.height * 0.8);
         rayGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
         rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
         
         ctx.fillStyle = rayGrad;
         ctx.beginPath();
         ctx.moveTo(xOffset - 50 + sway, 0);
         ctx.lineTo(xOffset + 100 + sway, 0);
         ctx.lineTo(xOffset + 200 - sway, canvas.height);
         ctx.lineTo(xOffset - 150 - sway, canvas.height);
         ctx.closePath();
         ctx.fill();
      }
      ctx.restore();

      // 3. Background Waves / Currents
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          const yOffset = (canvas.height / 3) * (i + 1);
          for (let x = 0; x <= canvas.width; x += 20) {
             const y = yOffset + Math.sin(x * 0.005 + time + i) * 50;
             if (x === 0) ctx.moveTo(x, y);
             else ctx.lineTo(x, y);
          }
          ctx.stroke();
      }
      ctx.restore();

      // 4. Bubbles 
      for (let i = bubbles.current.length - 1; i >= 0; i--) {
         const b = bubbles.current[i];
         b.y -= b.speed;
         b.x += Math.sin(b.y * 0.05) * 0.5;
         
         ctx.beginPath();
         ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
         ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity})`;
         ctx.fill();
         
         b.opacity -= 0.002;
         if (b.y < -10 || b.opacity <= 0) bubbles.current.splice(i, 1);
      }

      // --- SUB PHYSICS ---
      const dx = mousePos.current.x - sub.current.x;
      const dy = mousePos.current.y - sub.current.y;
      const angle = Math.atan2(dy, dx);
      const dist = Math.hypot(dx, dy);
      
      let speed = droneStats.speed * 1.5; 
      let isBoosting = false;

      if (keysPressed.current['ShiftLeft'] || keysPressed.current['ShiftRight']) {
        if (energyRef.current > 0.5) {
          speed *= 1.8;
          energyRef.current -= 0.4;
          isBoosting = true;
        }
      }

      if (dist > 5) {
        sub.current.vx += Math.cos(angle) * 0.2; 
        sub.current.vy += Math.sin(angle) * 0.2;
      }
      
      sub.current.vx *= 0.95;
      sub.current.vy *= 0.95;
      
      const currentSpeed = Math.hypot(sub.current.vx, sub.current.vy);
      if (currentSpeed > speed) {
        const scale = speed / currentSpeed;
        sub.current.vx *= scale;
        sub.current.vy *= scale;
      }

      sub.current.x += sub.current.vx;
      sub.current.y += sub.current.vy;
      sub.current.angle = angle;

      sub.current.x = Math.max(20, Math.min(canvas.width - 20, sub.current.x));
      sub.current.y = Math.max(20, Math.min(canvas.height - 20, sub.current.y));

      // Bubble Trail
      if (currentSpeed > 0.5) {
         const emissionRate = isBoosting ? 0.8 : 0.2; 
         if (Math.random() < emissionRate) {
            const tailDist = 30;
            const tailX = sub.current.x - Math.cos(sub.current.angle) * tailDist;
            const tailY = sub.current.y - Math.sin(sub.current.angle) * tailDist;
            
            const jitter = isBoosting ? 10 : 5;
            
            bubbles.current.push({
               x: tailX + (Math.random() - 0.5) * jitter,
               y: tailY + (Math.random() - 0.5) * jitter,
               size: isBoosting ? 1 + Math.random() * 3 : 1 + Math.random() * 2,
               speed: Math.random() * 1, 
               opacity: 0.6
            });
         }
      }

      // --- ENTITIES ---

      // Logic checks for Sonar
      const isSonar = keysPressed.current['Space'] && energyRef.current > 0 && droneStats.empRadius > 0;
      if (isSonar) {
         // Sonar visuals
         if (Math.random() > 0.9) {
            effects.current.push({x: sub.current.x, y: sub.current.y, radius: 20, life: 0.5, color: '#38bdf8'});
         }
         if (Math.random() > 0.95) energyRef.current -= 1;
      }

      // Enemies Loop
      for (let i = enemies.current.length - 1; i >= 0; i--) {
        const e = enemies.current[i];
        
        // AI Movement
        if (e.type === 'SHARK') {
           // Chase Player
           const dx = sub.current.x - e.x;
           const dy = sub.current.y - e.y;
           const d = Math.hypot(dx, dy);
           
           if (d > 1) { // Prevent NaN
             // If Sonar is active, sharks are repelled!
             if (isSonar && d < 250) {
                e.x -= (dx / d) * e.speed * 1.5; // Flee
                e.y -= (dy / d) * e.speed * 1.5;
             } else {
                e.x += (dx / d) * e.speed; // Chase
                e.y += (dy / d) * e.speed;
             }
           }
        } else if (e.type === 'FISH') {
           // Linear Swim
           e.x += e.speed * (e.x < canvas.width/2 ? 1 : -1); 
           e.y += Math.sin(Date.now() * 0.005 + i) * 0.5;
        } else {
           // Mines float
           e.y += Math.sin(Date.now() * 0.002 + i) * 0.2;
        }

        if (e.x < -100 || e.x > canvas.width + 100 || e.y < -100 || e.y > canvas.height + 100) {
           enemies.current.splice(i, 1);
           continue;
        }

        const distToPlayer = Math.hypot(e.x - sub.current.x, e.y - sub.current.y);
        
        // Collision
        if (distToPlayer < e.radius + 15) {
           if (e.type === 'MINE') {
              soundManager.playExplosion();
              healthRef.current -= 25; 
              setHealth(healthRef.current);
              enemies.current.splice(i, 1);
              effects.current.push({ x: e.x, y: e.y, radius: 10, life: 1, color: '#ef4444' });
           } else if (e.type === 'SHARK') {
              soundManager.playDamage();
              addMessage("SHARK BITE!");
              healthRef.current -= 15;
              setHealth(healthRef.current);
              
              // Knockback player
              const pushAngle = Math.atan2(sub.current.y - e.y, sub.current.x - e.x);
              sub.current.vx += Math.cos(pushAngle) * 15;
              sub.current.vy += Math.sin(pushAngle) * 15;
              
              // Bounce shark away so it doesn't stick
              e.x -= Math.cos(pushAngle) * 50;
              e.y -= Math.sin(pushAngle) * 50;
              
              effects.current.push({ x: (sub.current.x + e.x)/2, y: (sub.current.y + e.y)/2, radius: 10, life: 0.5, color: '#ef4444' });
           } else {
              // Friendly Fish
              addMessage("DON'T HURT THE FISH!");
              scoreRef.current = Math.max(0, scoreRef.current - 50);
              setScore(scoreRef.current);
              soundManager.playDamage(); 
              
              // Push fish away
              e.x += (sub.current.x - e.x) * -5; 
              e.y += (sub.current.y - e.y) * -5;
           }
           continue;
        }

        // Draw Enemies
        ctx.save();
        ctx.translate(e.x, e.y);
        
        // Flip sharks/fish based on movement direction
        if (e.type === 'SHARK' || e.type === 'FISH') {
            const movingRight = e.type === 'SHARK' ? (sub.current.x > e.x) : (e.x < canvas.width/2);
            if (!movingRight) ctx.scale(-1, 1);
        }
        
        if (e.type === 'SHARK') {
            // SHARK RENDER: No bubble, high visibility, glow
            ctx.shadowBlur = 20;
            ctx.shadowColor = 'rgba(220, 38, 38, 0.8)'; // Red danger glow
            ctx.fillStyle = '#ffffff'; // Explicitly reset color to avoid transparency inheritance from bubbles
            
            // Draw distinct icon without bubble container
            ctx.font = `${e.radius * 2.2}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(e.icon, 0, 0);
        } else {
            // BUBBLE RENDER (Fish / Mines)
            ctx.beginPath();
            ctx.arc(0, 0, e.radius + 5, 0, Math.PI * 2);
            
            let fillColor = 'rgba(255, 255, 255, 0.15)';
            let strokeColor = 'rgba(255, 255, 255, 0.3)';
            
            if (e.type === 'MINE') {
                fillColor = 'rgba(255, 0, 0, 0.15)';
                strokeColor = 'rgba(255, 0, 0, 0.5)';
            } 

            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.font = `${e.radius * 2}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff'; // Ensure icon inside bubble is visible
            ctx.fillText(e.icon, 0, 0);
        }

        ctx.restore();
      }

      // Effects
      for (let i = effects.current.length - 1; i >= 0; i--) {
        const eff = effects.current[i];
        eff.radius += 5;
        eff.life -= 0.05;
        if (eff.life <= 0) { effects.current.splice(i, 1); continue; }
        ctx.globalAlpha = eff.life;
        ctx.strokeStyle = eff.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(eff.x, eff.y, eff.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      // Collectibles
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.x += p.vx; p.y += p.vy;
        p.rotation += Math.sin(Date.now() * 0.002) * 0.05;

        if (p.x < -50 || p.x > canvas.width + 50 || p.y < -50 || p.y > canvas.height + 50) {
            particles.current.splice(i, 1);
            continue;
        }

        const dist = Math.hypot(p.x - sub.current.x, p.y - sub.current.y);
        const range = isSonar ? droneStats.filterRadius * 3 : droneStats.filterRadius;
        
        if (dist < range) {
           // Sonar attracts trash strongly
           p.x += (sub.current.x - p.x) * (isSonar ? 0.1 : 0.05);
           p.y += (sub.current.y - p.y) * (isSonar ? 0.1 : 0.05);
           
           if (dist < 20) {
             if (p.type === 'ENERGY') {
                soundManager.playEnergy();
                energyRef.current = Math.min(maxEnergy.current, energyRef.current + 15);
             } else if (p.type === 'TOKEN') {
                soundManager.playGemCollect();
                tokensRef.current += 1;
                setTokensFound(tokensRef.current);
                addMessage("TOKEN FOUND!");
             } else {
                soundManager.playBubble(); 
                scoreRef.current += 20;
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
        
        ctx.beginPath();
        ctx.arc(0, 0, p.radius + 8, 0, Math.PI * 2);
        
        if (p.type === 'TOKEN') {
           ctx.fillStyle = 'rgba(96, 165, 250, 0.4)'; // Blue for Token
           ctx.shadowBlur = 20;
           ctx.shadowColor = '#3b82f6';
        } else if (p.type === 'ENERGY') {
           ctx.fillStyle = 'rgba(251, 191, 36, 0.4)'; // Yellow for Energy
           ctx.shadowBlur = 15;
           ctx.shadowColor = '#fbbf24';
        } else {
           ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // White for Trash
           ctx.shadowBlur = 0;
        }
        ctx.fill();

        // Outline for extra contrast
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.font = `${p.radius * 2.2}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff'; // Ensure visibility
        ctx.fillText(p.icon, 0, 0);
        ctx.restore();
      }

      // --- DRAW SUBMARINE ---
      ctx.save();
      ctx.translate(sub.current.x, sub.current.y);
      
      const facingRight = Math.abs(sub.current.angle) < Math.PI / 2;
      if (!facingRight) ctx.scale(1, -1);
      
      ctx.rotate(sub.current.angle);

      // Sub Body
      ctx.fillStyle = '#fbbf24'; 
      ctx.beginPath();
      ctx.ellipse(0, 0, 25, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      
      // Cockpit
      ctx.fillStyle = '#bae6fd';
      ctx.beginPath();
      ctx.arc(10, -5, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Light Beam (Headlight)
      ctx.fillStyle = 'rgba(255, 255, 200, 0.1)';
      ctx.beginPath();
      ctx.moveTo(25, 0);
      ctx.lineTo(150, -40);
      ctx.lineTo(150, 40);
      ctx.closePath();
      ctx.fill();

      // Propeller
      if (currentSpeed > 0.1) {
         ctx.fillStyle = '#94a3b8';
         ctx.fillRect(-28, -10 + Math.sin(Date.now()*0.5)*5, 5, 20);
      }

      ctx.restore();

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
      soundManager.stopMusic();
      soundManager.stopAmbience();
    };
  }, [droneStats, gameState]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 font-Inter">
      <canvas ref={canvasRef} className="block w-full h-full cursor-crosshair" />
      
      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col gap-2 w-64">
          <div className="bg-blue-900/80 border border-blue-500 p-3 rounded-xl backdrop-blur-md">
             <div className="flex justify-between text-xs text-blue-200 font-bold uppercase mb-1">
               <span className="flex items-center gap-1"><Shield size={12} /> {t.game.armor}</span>
               <span>{Math.floor(health)}%</span>
             </div>
             <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-blue-400" style={{ width: `${(health / maxHealth.current) * 100}%` }}></div>
             </div>
          </div>
          <div className="bg-blue-900/80 border border-blue-500 p-3 rounded-xl backdrop-blur-md">
             <div className="flex justify-between text-xs text-blue-200 font-bold uppercase mb-1">
               <span className="flex items-center gap-1"><Zap size={12} /> {t.game.oxygenPower}</span>
               <span>{Math.floor(energy)}%</span>
             </div>
             <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-yellow-400" style={{ width: `${(energy / maxEnergy.current) * 100}%` }}></div>
             </div>
          </div>
        </div>

        <div className="text-center">
           <div className="text-4xl font-black text-white drop-shadow-lg tracking-tighter tabular-nums">
              {score} <span className="text-lg text-slate-400">/ {TARGET_SCORE}</span>
           </div>
           <div className="text-[10px] uppercase tracking-[0.2em] text-blue-300 font-bold">{t.game.oceanCleanup}</div>
           {tokensFound > 0 && (
             <div className="mt-2 bg-blue-500/20 border border-blue-500/50 text-blue-300 px-2 py-1 rounded-full text-xs font-bold animate-pulse inline-flex items-center gap-1">
               💠 {tokensFound} TOKENS
             </div>
           )}
           <div className="mt-2 flex flex-col gap-1">
             {messages.map((m, i) => <div key={i} className="text-yellow-400 text-sm font-bold animate-bounce">{m}</div>)}
           </div>
        </div>

        <div className="bg-blue-900/80 border border-blue-500 p-3 rounded-xl backdrop-blur-md text-xs text-blue-200">
           <div className="font-bold text-white mb-1">{t.game.controls}</div>
           <div className="flex justify-end gap-2 mb-1">{t.game.boost} <kbd className="bg-slate-700 px-1 rounded">{t.game.shift}</kbd></div>
           {droneStats.empRadius > 0 && (
             <div className="flex justify-end gap-2">{t.game.sonar} <kbd className="bg-slate-700 px-1 rounded">{t.game.space}</kbd></div>
           )}
        </div>
      </div>

      {/* Game Over */}
      {gameState !== 'PLAYING' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-md z-50">
          <div className="bg-slate-900 border border-blue-500 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
             {gameState === 'WON' ? (
               <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400 ring-2 ring-blue-500">
                  <Anchor size={40} />
               </div>
             ) : (
               <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 ring-2 ring-red-500">
                  <AlertTriangle size={40} />
               </div>
             )}
             <h2 className="text-3xl font-black text-white mb-2">{gameState === 'WON' ? t.game.oceanCleared : t.game.hullBreached}</h2>
             
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

             <button onClick={() => onComplete(score, gameState === 'WON', tokensFound)} className="w-full py-4 bg-blue-500 hover:bg-blue-400 text-white font-black uppercase rounded-xl">
               {gameState === 'WON' ? t.game.surfaceReport : t.game.emergencySurface}
             </button>
          </div>
        </div>
      )}
    </div>
  );
};
