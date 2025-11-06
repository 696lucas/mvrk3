'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <header className="hero" id="hero">
      <Image
        src="/lettering/lettering-Bp-zbET-.webp"
        alt="Pórtate Bien"
        width={1200}
        height={300}
        priority
      />
    </header>
  );
}

