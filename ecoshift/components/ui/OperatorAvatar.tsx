import React from 'react';

interface OperatorAvatarProps {
  level: number;
}

export const OperatorAvatar: React.FC<OperatorAvatarProps> = ({ level }) => {
  const skinColor = "#eab676";

  let suitColor = "#475569"; 
  let shirtColor = "#94a3b8"; 
  let accessoryType = "NONE"; 
  
  if (level < 2) {
    suitColor = "#f97316";
    shirtColor = "#cbd5e1";
    accessoryType = "HARDHAT";
  } else if (level < 5) {
    suitColor = "#15803d";
    shirtColor = "#166534"; 
    accessoryType = "HEADSET";
  } else if (level < 10) {
    suitColor = "#0f172a";
    shirtColor = "#334155"; 
    accessoryType = "NIGHTVISION";
  } else {
    suitColor = "#eab308";
    shirtColor = "#ffffff";
    accessoryType = "HALO";
  }

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full bg-slate-800/50">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
           <stop offset="0%" stopColor="#1e293b" />
           <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#bgGrad)" />

      <path d="M20,100 L80,100 L80,90 Q80,65 50,65 Q20,65 20,90 Z" fill={suitColor} />
      <path d="M40,100 L60,100 L60,90 Q60,75 50,75 Q40,75 40,90 Z" fill={shirtColor} />

      <rect x="42" y="55" width="16" height="15" fill={skinColor} />

      <ellipse cx="50" cy="45" rx="18" ry="22" fill={skinColor} />

      <circle cx="43" cy="42" r="2" fill="#1e293b" />
      <circle cx="57" cy="42" r="2" fill="#1e293b" />
      
      <path d="M45,55 Q50,57 55,55" fill="none" stroke="#be8e5e" strokeWidth="1.5" />

      <path d="M32,35 Q32,15 50,15 Q68,15 68,35 L68,40 L66,40 L66,35 Q66,25 50,25 Q34,25 34,35 L34,40 L32,40 Z" fill="#553e2e" />

      {accessoryType === 'HARDHAT' && (
        <g>
           <path d="M28,35 Q28,12 50,12 Q72,12 72,35 L76,35 L76,40 L24,40 L24,35 Z" fill="#facc15" />
           <rect x="45" y="12" width="10" height="5" fill="#facc15" rx="1" />
           <path d="M29,35 Q29,18 50,18 Q71,18 71,35" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.5" />
        </g>
      )}

      {accessoryType === 'HEADSET' && (
         <g>
            <path d="M28,40 Q28,15 50,15 Q72,15 72,40" fill="none" stroke="#1f2937" strokeWidth="4" />
            <rect x="26" y="38" width="6" height="12" rx="2" fill="#1f2937" />
            <rect x="68" y="38" width="6" height="12" rx="2" fill="#1f2937" />
            <path d="M68,48 L55,58" fill="none" stroke="#1f2937" strokeWidth="2" />
            <circle cx="55" cy="58" r="2" fill="#1f2937" />
         </g>
      )}

      {accessoryType === 'NIGHTVISION' && (
         <g>
            <path d="M30,35 L70,35" stroke="#000" strokeWidth="3" />
            <rect x="35" y="35" width="12" height="10" rx="2" fill="#1e293b" />
            <rect x="53" y="35" width="12" height="10" rx="2" fill="#1e293b" />
            <circle cx="41" cy="40" r="3" fill="#10b981" className="animate-pulse" />
            <circle cx="59" cy="40" r="3" fill="#10b981" className="animate-pulse" />
         </g>
      )}

      {accessoryType === 'HALO' && (
         <g>
             <path d="M35,42 Q50,48 65,42 L65,38 Q50,44 35,38 Z" fill="#22d3ee" opacity="0.9" />
             <path d="M30,30 L35,20 L45,25 L50,15 L55,25 L65,20 L70,30" fill="none" stroke="#eab308" strokeWidth="2" />
         </g>
      )}
    </svg>
  );
};

