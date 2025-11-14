'use client';

import Image from 'next/image';

export default function MusicDrawerMobile() {
  return (
    <aside className="music-drawer music-drawer--mobile" id="musicDrawerMobile">
      <button
        className="music-drawer__trigger"
        aria-label="Abrir reproductor móvil"
      >
        <Image
          className="music-drawer__icon"
          src="/ipod/IPod_29_2009.webp"
          alt="Reproductor"
          width={32}
          height={32}
        />
      </button>
    </aside>
  );
}

