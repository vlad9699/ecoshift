
import React, { useState, useEffect } from 'react';
import { MousePointer, Keyboard, Zap, Target, Shield, Crosshair, ChevronRight, CheckCircle2, Wind, Anchor, Truck, X } from 'lucide-react';
import { useLanguage } from '../i18n';

interface TutorialModalProps {
  gameType: 'AIR' | 'WATER' | 'GROUND';
  onComplete: () => void;
  onClose?: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ gameType, onComplete, onClose }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(0);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (onClose) {
          onClose();
        } else {
          onComplete();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, onComplete]);

  const getContent = () => {
    // Common Controls
    const controls = (
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/10 flex flex-col items-center text-center">
           <Keyboard size={32} className="text-slate-400 mb-2" />
           <div className="flex gap-1 mb-2">
              <span className="px-2 py-1 bg-slate-700 rounded text-white font-mono text-xs border-b-2 border-slate-900">W</span>
              <span className="px-2 py-1 bg-slate-700 rounded text-white font-mono text-xs border-b-2 border-slate-900">A</span>
              <span className="px-2 py-1 bg-slate-700 rounded text-white font-mono text-xs border-b-2 border-slate-900">S</span>
              <span className="px-2 py-1 bg-slate-700 rounded text-white font-mono text-xs border-b-2 border-slate-900">D</span>
           </div>
           <p className="text-sm text-slate-300">{t.modals.tutorial.moveVehicle}</p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/10 flex flex-col items-center text-center">
           <MousePointer size={32} className="text-slate-400 mb-2" />
           <p className="text-sm text-slate-300 mt-2">{t.modals.tutorial.aimSteer}</p>
        </div>
      </div>
    );

    // Specific Content
    switch (gameType) {
      case 'AIR':
        return [
          {
            title: t.modals.tutorial.aerialOperations.title,
            icon: <Wind size={40} className="text-emerald-400" />,
            content: (
              <div className="space-y-4">
                <p className="text-slate-300">{t.modals.tutorial.aerialOperations.description}</p>
                <div className="bg-emerald-900/20 border border-emerald-500/30 p-3 rounded-lg flex items-center gap-3">
                   <div className="text-2xl">🛢️</div>
                   <div className="text-sm text-emerald-100"><strong>{t.modals.tutorial.aerialOperations.collect}</strong></div>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg flex items-center gap-3">
                   <div className="text-2xl">☁️</div>
                   <div className="text-sm text-red-100"><strong>{t.modals.tutorial.aerialOperations.avoid}</strong></div>
                </div>
              </div>
            )
          },
          {
            title: t.modals.tutorial.flightControls.title,
            icon: <Keyboard size={40} className="text-emerald-400" />,
            content: (
              <div>
                 <p className="text-slate-300 mb-2">{t.modals.tutorial.flightControls.description}</p>
                 {controls}
                 <div className="mt-4 p-3 bg-slate-800 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{t.modals.tutorial.flightControls.boost}</span>
                    <span className="px-2 py-1 bg-slate-700 rounded text-xs font-mono">SHIFT</span>
                 </div>
                 <div className="mt-2 p-3 bg-slate-800 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-400">{t.modals.tutorial.flightControls.empBlast}</span>
                    <span className="px-2 py-1 bg-slate-700 rounded text-xs font-mono">SPACE</span>
                 </div>
              </div>
            )
          }
        ];

      case 'WATER':
        return [
          {
            title: t.modals.tutorial.deepSeaOps.title,
            icon: <Anchor size={40} className="text-blue-400" />,
            content: (
              <div className="space-y-4">
                <p className="text-slate-300">{t.modals.tutorial.deepSeaOps.description}</p>
                <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg flex items-center gap-3">
                   <div className="text-2xl">🛍️</div>
                   <div className="text-sm text-blue-100"><strong>{t.modals.tutorial.deepSeaOps.collect}</strong></div>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg flex items-center gap-3">
                   <div className="text-2xl">💣</div>
                   <div className="text-sm text-red-100"><strong>{t.modals.tutorial.deepSeaOps.danger}</strong></div>
                </div>
              </div>
            )
          },
          {
            title: t.modals.tutorial.submersibleControls.title,
            icon: <Keyboard size={40} className="text-blue-400" />,
            content: (
              <div>
                 <p className="text-slate-300 mb-2">{t.modals.tutorial.submersibleControls.description}</p>
                 {controls}
                 <div className="mt-4 p-3 bg-slate-800 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{t.modals.tutorial.submersibleControls.turboProp}</span>
                    <span className="px-2 py-1 bg-slate-700 rounded text-xs font-mono">SHIFT</span>
                 </div>
                 <div className="mt-2 p-3 bg-slate-800 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-bold text-blue-400">{t.modals.tutorial.submersibleControls.sonar}</span>
                    <span className="px-2 py-1 bg-slate-700 rounded text-xs font-mono">SPACE</span>
                 </div>
              </div>
            )
          }
        ];

      case 'GROUND':
        return [
          {
            title: t.modals.tutorial.roverOperations.title,
            icon: <Truck size={40} className="text-amber-400" />,
            content: (
              <div className="space-y-4">
                <p className="text-slate-300">{t.modals.tutorial.roverOperations.description}</p>
                <div className="bg-amber-900/20 border border-amber-500/30 p-3 rounded-lg flex items-center gap-3">
                   <div className="text-2xl">📦</div>
                   <div className="text-sm text-amber-100"><strong>{t.modals.tutorial.roverOperations.destroyCrates}</strong></div>
                </div>
                <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg flex items-center gap-3">
                   <div className="text-2xl">🐞</div>
                   <div className="text-sm text-red-100"><strong>{t.modals.tutorial.roverOperations.combat}</strong></div>
                </div>
              </div>
            )
          },
          {
            title: t.modals.tutorial.drivingManual.title,
            icon: <Crosshair size={40} className="text-amber-400" />,
            content: (
              <div>
                 <p className="text-slate-300 mb-2">{t.modals.tutorial.drivingManual.description}</p>
                 {controls}
                 <div className="mt-4 p-3 bg-slate-800 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-bold text-red-400">{t.modals.tutorial.drivingManual.fireWeapon}</span>
                    <span className="px-2 py-1 bg-slate-700 rounded text-xs font-mono">SPACE</span>
                 </div>
                 <div className="mt-2 text-xs text-slate-500 italic text-center">
                    {t.modals.tutorial.drivingManual.tip}
                 </div>
              </div>
            )
          }
        ];
    }
    return [];
  };

  const steps = getContent();
  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  const themeColor = gameType === 'AIR' ? 'emerald' : gameType === 'WATER' ? 'blue' : 'amber';
  const borderColor = gameType === 'AIR' ? 'border-emerald-500' : gameType === 'WATER' ? 'border-blue-500' : 'border-amber-500';
  const btnColor = gameType === 'AIR' ? 'bg-emerald-600 hover:bg-emerald-500' : gameType === 'WATER' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-amber-600 hover:bg-amber-500';

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      onComplete();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 px-4"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
       <div className={`max-w-md w-full bg-slate-900 border-2 ${borderColor} rounded-2xl shadow-2xl overflow-hidden flex flex-col relative`}>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white z-10"
            aria-label="Close tutorial"
          >
            <X size={20} />
          </button>
          
          {/* Header */}
          <div className={`p-6 pb-0 flex items-center gap-4 pr-12`}>
             <div className={`p-3 rounded-full bg-slate-800 ${borderColor} border`}>
                {currentStep.icon}
             </div>
             <div className="flex-1">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-wide">{currentStep.title}</h2>
                <div className="flex gap-1 mt-1">
                   {steps.map((_, i) => (
                      <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? `w-8 ${btnColor.split(' ')[0]}` : 'w-2 bg-slate-700'}`}></div>
                   ))}
                </div>
             </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1">
             {currentStep.content}
          </div>

          {/* Footer */}
          <div className="p-6 pt-0 flex justify-between items-center">
             <button 
               onClick={() => {
                   if (step > 0) setStep(step - 1);
               }}
               className={`text-sm font-bold text-slate-500 hover:text-white transition-colors ${step === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
             >
               {t.modals.tutorial.back}
             </button>

             <button 
               onClick={() => {
                   if (isLast) {
                       onComplete();
                   } else {
                       setStep(step + 1);
                   }
               }}
               className={`px-6 py-3 rounded-xl font-black text-white shadow-lg transition-transform hover:scale-105 flex items-center gap-2 ${btnColor}`}
             >
               {isLast ? t.modals.tutorial.startMission : t.modals.tutorial.next}
               {isLast ? <CheckCircle2 size={18} /> : <ChevronRight size={18} />}
             </button>
          </div>
       </div>
    </div>
  );
};
