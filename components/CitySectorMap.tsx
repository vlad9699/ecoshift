
import React, { useState, useEffect, useCallback } from 'react';
import { District, DistrictStatus } from '../types';
import { CheckCircle2, MapPin, Signal, Target, ShieldCheck, Crosshair, AlertTriangle } from 'lucide-react';
import { FloatingTrash } from './FloatingTrash';

interface TrashItem {
  id: string;
  x: number;
  y: number;
}

interface CitySectorMapProps {
  districts: District[];
  activeDistrict: District | null;
  onSelect: (district: District) => void;
  cityName: string;
  onCollectTrash?: (reward: { xp: number; coins: number; tokens: number }) => void;
}

export const CitySectorMap: React.FC<CitySectorMapProps> = ({ districts, activeDistrict, onSelect, cityName, onCollectTrash }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scanLineY, setScanLineY] = useState(0);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);

  // Animate the scanline
  useEffect(() => {
    const interval = setInterval(() => {
      setScanLineY(prev => (prev + 0.5) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Spawn random trash items
  useEffect(() => {
    const spawnTrash = () => {
      // Random chance to spawn (15% chance every 5 seconds)
      if (Math.random() > 0.15) return;

      // Maximum 2 trash items at once
      setTrashItems(prev => {
        if (prev.length >= 2) return prev;

        // Random position on map (avoid edges)
        const x = 20 + Math.random() * 60; // 20-80%
        const y = 20 + Math.random() * 60; // 20-80%

        const newTrash: TrashItem = {
          id: `trash-${Date.now()}-${Math.random()}`,
          x,
          y,
        };

        return [...prev, newTrash];
      });
    };

    // Check for new trash every 5-8 seconds
    const interval = setInterval(spawnTrash, 5000 + Math.random() * 3000);

    return () => clearInterval(interval);
  }, []);

  const handleCollectTrash = useCallback((id: string, reward: { xp: number; coins: number; tokens: number }) => {
    // Remove from state
    setTrashItems(prev => prev.filter(item => item.id !== id));

    // Notify parent
    onCollectTrash?.(reward);
  }, [onCollectTrash]);

  // Centroid helper to place icons in the middle of weird shapes
  const getCentroid = (path: string) => {
      if (!path) return { x: 50, y: 50 };
      const matches = path.match(/[0-9.]+/g);
      if (!matches) return { x: 50, y: 50 };
      
      let minX = 100, maxX = 0, minY = 100, maxY = 0;
      for (let i = 0; i < matches.length; i+=2) {
          const x = parseFloat(matches[i]);
          const y = parseFloat(matches[i+1]);
          if (!isNaN(x)) {
              minX = Math.min(minX, x);
              maxX = Math.max(maxX, x);
          }
          if (!isNaN(y)) {
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
          }
      }
      return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
  };

  const getPollutionColor = (level: number) => {
      if (level >= 75) return "#dc2626"; // High (Red)
      if (level >= 50) return "#d97706"; // Med (Amber)
      return "#ca8a04"; // Low (Yellow-Dark)
  };

  return (
    <div className="w-full h-full bg-slate-950 relative overflow-hidden rounded-xl border border-slate-800 shadow-2xl select-none flex items-center justify-center group bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black p-4">
       
       {/* 1. BACKGROUND LAYER */}
       {/* Grid */}
       <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
       
       {/* 2. TACTICAL HUD OVERLAYS */}
       
       {/* Top Left: Status */}
       <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 pointer-events-none font-mono">
           <div className="flex items-center gap-2 text-emerald-500 mb-1">
               <div className="relative">
                   <Signal size={14} className="animate-pulse md:w-4 md:h-4" />
               </div>
               <span className="text-[10px] md:text-xs font-bold tracking-widest">LINK: ACTIVE</span>
           </div>
           <div className="hidden md:block text-slate-600 text-[10px] font-bold">
               LAT: 37.7749° N <br/>
               LNG: 122.4194° W
           </div>
       </div>

       {/* 3. MAP RENDERER */}
       <div className="relative w-full max-w-[450px] aspect-square z-10">
           <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-2xl">
              <defs>
                  {/* UI Glow Filter */}
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                      <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                      </feMerge>
                  </filter>

                  {/* PATTERNS */}
                  <pattern id="hazardPattern" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                      <rect width="2" height="4" transform="translate(0,0)" fill="#ef4444" fillOpacity="0.15" />
                  </pattern>

                  <pattern id="techGrid" patternUnits="userSpaceOnUse" width="4" height="4">
                       <rect width="4" height="4" fill="transparent" />
                       <circle cx="1" cy="1" r="0.5" fill="#3b82f6" fillOpacity="0.3" />
                  </pattern>
                  
                  <pattern id="cleanPattern" patternUnits="userSpaceOnUse" width="4" height="4">
                       <path d="M0 4 L4 0" stroke="#10b981" strokeWidth="0.5" strokeOpacity="0.2" />
                  </pattern>
              </defs>

              {/* Drop Shadow */}
              {districts.map((d) => (
                  <path key={`shadow-${d.id}`} d={d.mapPath} fill="black" fillOpacity="0.6" transform="translate(1.5, 1.5)" filter="blur(3px)" />
              ))}

              {/* District Shapes */}
              {districts.map((district) => {
                const isActive = activeDistrict?.id === district.id;
                const isHovered = hoveredId === district.id;
                const isRestored = district.status === DistrictStatus.RESTORED;
                const isLocked = district.status === DistrictStatus.LOCKED;
                
                let fill = "url(#techGrid)";
                let stroke = "#334155"; 
                let strokeWidth = 0.5;
                let opacity = 1;

                if (isLocked) {
                    fill = "#0f172a";
                    stroke = "#1e293b";
                    opacity = 0.5;
                } else if (isRestored) {
                    fill = "url(#cleanPattern)";
                    stroke = "#10b981"; 
                    strokeWidth = isHovered ? 1 : 0.5;
                } else if (isActive) {
                    fill = "url(#hazardPattern)";
                    stroke = "#ef4444"; 
                    strokeWidth = 1.5;
                } else {
                    if (isHovered) {
                        stroke = "#38bdf8"; 
                        strokeWidth = 1;
                        fill = "#1e293b";
                    }
                }

                const showPollution = !isRestored && !isLocked;
                const pollutionAlpha = showPollution ? (district.pollutionLevel / 100) * 0.6 : 0;
                const pollutionColor = getPollutionColor(district.pollutionLevel);

                return (
                    <g key={district.id}
                       onClick={() => !isLocked && onSelect(district)}
                       onMouseEnter={() => setHoveredId(district.id)}
                       onMouseLeave={() => setHoveredId(null)}
                       className={`${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                       <path 
                         d={district.mapPath} 
                         fill={fill}
                         stroke={stroke} 
                         strokeWidth={strokeWidth}
                         opacity={opacity}
                         className="transition-all duration-300 ease-out"
                         filter={isActive ? "url(#glow)" : ""}
                       />
                       
                       {showPollution && (
                          <path 
                             d={district.mapPath}
                             fill={pollutionColor}
                             fillOpacity={pollutionAlpha}
                             stroke="none"
                             pointerEvents="none"
                             className="transition-all duration-500 ease-in-out"
                          />
                       )}

                       {isHovered && !isLocked && (
                           <path d={district.mapPath} fill="white" fillOpacity="0.05" pointerEvents="none" />
                       )}
                    </g>
                );
              })}
           </svg>

           {/* MARKERS OVERLAY */}
           <div className="absolute inset-0 pointer-events-none">
               {districts.map((district) => {
                    const center = getCentroid(district.mapPath || "");
                    const isActive = activeDistrict?.id === district.id;
                    const isHovered = hoveredId === district.id;
                    const isRestored = district.status === DistrictStatus.RESTORED;
                    
                    if (district.status === DistrictStatus.LOCKED) return null;

                    let Icon = MapPin;
                    let colorClass = "text-slate-500 border-slate-700 bg-slate-900/80";
                    
                    if (isRestored) {
                        Icon = ShieldCheck;
                        colorClass = "text-emerald-400 border-emerald-500/50 bg-emerald-950/80";
                    } else if (isActive) {
                        Icon = Crosshair;
                        colorClass = "text-red-400 border-red-500 bg-red-950/80";
                    } else if (isHovered) {
                        Icon = Target;
                        colorClass = "text-sky-400 border-sky-500 bg-slate-900";
                    }

                    // SMART LABEL POSITIONING
                    // If district is in the bottom 40% of map, render label ABOVE.
                    const isBottomHalf = center.y > 60;
                    
                    return (
                        <div
                            key={`marker-${district.id}`}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-out z-20"
                            style={{ left: `${center.x}%`, top: `${center.y}%` }}
                        >
                            {/* Active Reticle Animation */}
                            {isActive && (
                                <div className="absolute inset-0 -m-4">
                                    <div className="w-full h-full rounded-full border border-red-500/30 animate-[spin_4s_linear_infinite] border-t-transparent border-l-transparent"></div>
                                    <div className="absolute inset-0 border border-red-500/30 rounded-full animate-[spin_3s_linear_infinite_reverse] scale-75 border-b-transparent border-r-transparent"></div>
                                </div>
                            )}

                            {/* The Marker Icon */}
                            <div className={`
                                relative w-8 h-8 rounded-lg border flex items-center justify-center backdrop-blur-sm shadow-lg
                                transition-all duration-300 z-10
                                ${colorClass}
                                ${isActive || isHovered ? 'scale-110' : 'scale-90 opacity-80 grayscale-[0.3]'}
                            `}>
                                <Icon size={16} className={isActive ? 'animate-pulse' : ''} />
                            </div>

                            {/* Smart Label */}
                            <div className={`
                                absolute left-1/2 -translate-x-1/2 
                                transition-all duration-300 origin-center flex flex-col items-center w-max
                                ${isBottomHalf ? 'bottom-full mb-2 flex-col-reverse' : 'top-full mt-2 flex-col'}
                                ${isActive || isHovered ? 'opacity-100 scale-100 z-50' : 'opacity-0 scale-90 pointer-events-none z-0'}
                            `}>
                                {/* Connecting Line */}
                                <div className={`w-[1px] h-3 ${isActive ? 'bg-red-500' : 'bg-slate-600'}`}></div>
                                
                                {/* Text Box */}
                                <div className={`
                                    px-3 py-1.5 rounded border backdrop-blur-md shadow-xl whitespace-nowrap text-center
                                    ${isActive ? 'bg-red-950/90 border-red-500/50' : (isRestored ? 'bg-emerald-950/90 border-emerald-500/50' : 'bg-slate-900/90 border-slate-600')}
                                `}>
                                    <div className={`text-[10px] font-black uppercase tracking-widest leading-tight
                                        ${isActive ? 'text-red-400' : (isRestored ? 'text-emerald-400' : 'text-white')}
                                    `}>
                                        {district.name}
                                    </div>
                                    {!isRestored && (
                                        <div className="text-[9px] text-slate-400 font-mono mt-0.5 flex items-center justify-center gap-1">
                                            <AlertTriangle size={8} className={district.pollutionLevel > 75 ? 'text-red-500' : 'text-amber-500'} />
                                            <span>TOXICITY: {district.pollutionLevel}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
               })}
           </div>

           {/* FLOATING TRASH */}
           <div className="absolute inset-0 z-30" style={{ pointerEvents: 'none' }}>
             {trashItems.map(trash => (
               <FloatingTrash
                 key={trash.id}
                 id={trash.id}
                 x={trash.x}
                 y={trash.y}
                 onCollect={handleCollectTrash}
               />
             ))}
           </div>
       </div>

       {/* 4. SCANLINE (Subtle) */}
       <div 
          className="absolute left-0 w-full h-[1px] bg-emerald-400/20 pointer-events-none z-0"
          style={{ top: `${scanLineY}%` }}
       ></div>
       
       {/* Bottom Info */}
       <div className="absolute bottom-2 w-full px-4 flex justify-between items-end z-20 pointer-events-none">
           <div className="flex gap-1">
               <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></div>
               <div className="w-1 h-1 bg-emerald-500/50 rounded-full"></div>
               <div className="w-1 h-1 bg-emerald-500/20 rounded-full"></div>
           </div>
           <div className="text-[9px] text-slate-500 font-mono uppercase hidden md:block">
               SECTOR_MAP_V3 // {cityName}
           </div>
       </div>
    </div>
  );
};
