import { useEffect } from 'react';

const CRITICAL_ASSETS = [
  '/public/logo2.png',
  '/public/logo3.png',
  '/src/assets/hero.jpg'
  // Add other critical assets here if needed
];

export default function AssetPreloader() {
  useEffect(() => {
    CRITICAL_ASSETS.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return null;
}
