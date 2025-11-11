'use client';

import Image from 'next/image';

export default function Hero() {
  return (
    <header className="hero" id="hero">
      <Image
        src="/lettering/portate%20bien%20solo.png"
        alt="Portate bien"
        width={1200}
        height={300}
        priority
      />
    </header>
  );
}
