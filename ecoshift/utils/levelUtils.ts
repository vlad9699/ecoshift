export const getLevelBorder = (level: number): string => {
  if (level >= 10) return 'border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.3)]';
  if (level >= 8) return 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.3)]';
  if (level >= 6) return 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]';
  if (level >= 4) return 'border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)]';
  if (level >= 2) return 'border-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.3)]';
  return 'border-slate-600';
};

