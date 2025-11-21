import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

interface FloatingTrashProps {
  id: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  onCollect: (id: string, reward: { xp: number; coins: number; tokens: number }) => void;
}

export const FloatingTrash: React.FC<FloatingTrashProps> = ({ id, x, y, onCollect }) => {
  const [collected, setCollected] = useState(false);
  const [position, setPosition] = useState({ x, y });
  const [opacity, setOpacity] = useState(0);
  const [scale, setScale] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [reward, setReward] = useState<{ xp: number; coins: number; tokens: number } | null>(null);

  // Floating animation
  useEffect(() => {
    let animationId: number;
    let startY = y;
    let offset = 0;
    let direction = Math.random() > 0.5 ? 1 : -1;
    const speed = 0.02 + Math.random() * 0.03;

    const animate = () => {
      offset += speed * direction;
      if (Math.abs(offset) > 2) {
        direction *= -1;
      }
      setPosition(prev => ({ ...prev, y: startY + offset }));
      animationId = requestAnimationFrame(animate);
    };

    // Fade in and scale up on appear
    setTimeout(() => {
      setOpacity(1);
      setScale(1);
    }, 100);

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [y]);

  const handleClick = () => {
    if (collected) return;
    
    // Generate reward
    const rewardData = {
      xp: 10 + Math.floor(Math.random() * 20), // 10-30 XP
      coins: 5 + Math.floor(Math.random() * 10), // 5-15 coins
      tokens: Math.random() > 0.7 ? 1 : 0, // 30% chance for 1 token
    };

    setCollected(true);
    setReward(rewardData);
    setShowReward(true);
    setScale(1.5);
    
    // Hide reward after animation
    setTimeout(() => {
      setShowReward(false);
    }, 1500);
    
    // Call onCollect after animation
    setTimeout(() => {
      onCollect(id, rewardData);
    }, 200);
  };

  if (collected && opacity === 0) {
    return null;
  }

  return (
    <div
      className="absolute cursor-pointer z-30 transition-all duration-200 hover:scale-110 pointer-events-auto"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
      onClick={handleClick}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-amber-500/40 rounded-full blur-xl animate-pulse"></div>
      
      {/* Trash icon */}
      <div className="relative bg-amber-900/90 border-2 border-amber-500 rounded-full p-2 shadow-lg backdrop-blur-sm hover:border-amber-400 transition-colors">
        <Trash2 
          size={20} 
          className="text-amber-400 drop-shadow-lg animate-bounce"
          style={{ animationDuration: '1.5s' }}
        />
      </div>

      {/* Sparkle particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400 rounded-full"
            style={{
              left: `${50 + (Math.cos((i * Math.PI) / 3) * 30)}%`,
              top: `${50 + (Math.sin((i * Math.PI) / 3) * 30)}%`,
              animation: 'sparkle 2s infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Reward Popup */}
      {showReward && reward && (
        <div 
          className="absolute -top-12 left-1/2 whitespace-nowrap bg-emerald-950/95 border-2 border-emerald-500 rounded-lg px-3 py-1.5 shadow-lg z-50"
          style={{
            animation: 'rewardFloat 1.5s ease-out forwards',
            transform: 'translate(-50%, 0)',
          }}
        >
          <div className="text-emerald-400 font-bold text-xs">
            +{reward.xp} XP +{reward.coins} 🪙
            {reward.tokens > 0 && ` +${reward.tokens} 💎`}
          </div>
        </div>
      )}

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes rewardFloat {
          0% { opacity: 0; transform: translate(-50%, 0) scale(0.5); }
          20% { opacity: 1; transform: translate(-50%, -10px) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -30px) scale(0.8); }
        }
      `}</style>
    </div>
  );
};

