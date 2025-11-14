'use client';

import { useEffect, useState } from 'react';
import MusicDrawer from './MusicDrawer';
import MusicDrawerMobile from './MusicDrawerMobile';

export default function AdaptiveMusicDrawer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width:768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (isMobile) return <MusicDrawerMobile />;
  return <MusicDrawer />;
}

