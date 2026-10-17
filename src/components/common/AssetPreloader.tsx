import { useEffect } from 'react';
import heroBg from '../../assets/hero.avif';

const CRITICAL_ASSETS = [
  '/logo2.png',
  '/logo3.png',
  heroBg
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
