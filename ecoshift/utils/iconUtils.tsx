import React from 'react';
import { Wind, ShoppingBag, Award, Zap, Flag, Crosshair, Truck, Star } from 'lucide-react';

export const getIcon = (name: string) => {
  switch(name) {
    case 'Wind': return <Wind size={20} />;
    case 'ShoppingBag': return <ShoppingBag size={20} />;
    case 'Award': return <Award size={20} />;
    case 'Zap': return <Zap size={20} />;
    case 'Flag': return <Flag size={20} />;
    case 'Crosshair': return <Crosshair size={20} />;
    case 'Truck': return <Truck size={20} />;
    default: return <Star size={20} />;
  }
};

