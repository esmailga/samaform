import {
  Home, Building, ShoppingBag, Utensils, Briefcase, Sparkles, Hotel, School, Trees, Warehouse, Hospital,
  Landmark, Store, Coffee, Dumbbell, Car, Palette, Square, type LucideIcon,
} from 'lucide-react';

// Icons the admin can pick for picture cards (imported one by one so the site doesn't bundle every icon)
export const CARD_ICONS: Record<string, LucideIcon> = {
  Home, Building, ShoppingBag, Utensils, Briefcase, Sparkles, Hotel, School, Trees, Warehouse, Hospital,
  Landmark, Store, Coffee, Dumbbell, Car, Palette,
};

export const cardIcon = (name?: string): LucideIcon => (name && CARD_ICONS[name]) || Square;
