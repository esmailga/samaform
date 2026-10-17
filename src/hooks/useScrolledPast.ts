import { useSyncExternalStore } from 'react';

// Scroll offset at which the hero logo hands over to the navbar logo.
export const LOGO_HANDOFF_SCROLL = 80;

// One shared window listener notifies every subscriber in the same tick, so
// components reading this hook (Hero, Navbar) always re-render together.
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('scroll', notify, { passive: true });
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener('scroll', notify);
  };
}

export function useScrolledPast(offset: number) {
  return useSyncExternalStore(subscribe, () => window.scrollY > offset, () => false);
}
