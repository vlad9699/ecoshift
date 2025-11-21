import React, { useEffect, useState } from 'react';
import { Sparkles, Leaf, Globe } from 'lucide-react';

interface LoaderProps {
  progress?: number;
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ progress = 0, message }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const loadingMessages = [
    'Initializing eco-systems',
    'Scanning city districts',
    'Calibrating drone fleet',
    'Loading environmental data',
    'Preparing mission control',
    'Syncing satellite data',
    'Analyzing pollution levels',
    'Ready for deployment'
  ];

  const currentMessage = message || loadingMessages[Math.floor((progress / 100) * loadingMessages.length)] || 'Loading';

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/30 via-slate-950 to-slate-950"></div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-emerald-400/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Logo/Title */}
        <div className="text-center mb-4">
          <h1 className="font-Fredoka text-6xl md:text-8xl font-bold text-white tracking-tight mb-2">
            ECO<span className="text-emerald-500">SHIFT</span>
          </h1>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>
        </div>

        {/* Animated Icons */}
        <div className="flex items-center justify-center gap-8 md:gap-12 mb-8">
          {/* Drone Icon */}
          <div className="relative" style={{ animation: 'float 3s ease-in-out infinite' }}>
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Sparkles 
                size={48} 
                className="text-emerald-400 animate-pulse"
                style={{ animationDuration: '2s' }}
              />
            </div>
          </div>

          {/* Leaf Icon */}
          <div className="relative" style={{ animation: 'float 3s ease-in-out infinite 0.3s' }}>
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.3s' }}></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Leaf 
                size={48} 
                className="text-emerald-400 animate-pulse"
                style={{ animationDuration: '2s', animationDelay: '0.3s' }}
              />
            </div>
          </div>

          {/* Globe Icon */}
          <div className="relative" style={{ animation: 'float 3s ease-in-out infinite 0.6s' }}>
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Globe 
                size={48} 
                className="text-emerald-400 animate-pulse"
                style={{ animationDuration: '2s', animationDelay: '0.6s' }}
              />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md">
          <div className="mb-3 text-center">
            <p className="text-emerald-400 font-mono text-sm font-bold uppercase tracking-wider">
              {currentMessage}{dots}
            </p>
          </div>
          
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/50 via-emerald-600/50 to-emerald-900/50 animate-[shimmer_2s_infinite]"></div>
            
            {/* Progress fill */}
            <div 
              className="relative h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 transition-all duration-500 ease-out shadow-[0_0_20px_rgba(16,185,129,0.6)]"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]"></div>
            </div>
            
            {/* Progress percentage */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-300 drop-shadow-lg">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex items-center gap-2 mt-4">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

