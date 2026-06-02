'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * IMPORTANTE
 * - Ya NO se busca nada en /videos/...
 * - Portadas:  /public/portadas
 * - Canciones: /public/canciones
 *
 * Recomendación futura (si quieres “emparejar por nombre base” sin lista manual):
 *  - Renombra audios para que se llamen EXACTAMENTE igual que la portada (sin artista delante),
 *    ej: "Tempo 2.mp3" y "Tempo 2.png"
 *  - Con eso, bastaría con name="Tempo 2" y listo.
 */

const BASE_TRACKS = [
  // name = nombre base lógico del track (y el que se verá si no pones title)
  // coverFile/audioFile = nombres reales de archivo en /public/portadas y /public/canciones

  { name: 'Alguien', title: 'Alguien', coverFile: 'alguien.png', audioFile: 'caos! - Alguien.mp3' },
  { name: 'CHAYANNE', title: 'CHAYANNE', coverFile: 'chayane.png', audioFile: 'ShakeDaBlock! - CHAYANNE.mp3' },
  { name: 'Coi Leray (Remix)', title: 'Coi Leray (Remix)', coverFile: 'coileray.png', audioFile: 'Fronti - Coi Leray (Remix).mp3' },
  { name: 'mi ñerY', title: 'mi ñerY', coverFile: 'mi ñery.png', audioFile: 'eluney benedetti - mi ñerY.mp3' },

  { name: 'Tempo 2', title: 'Tempo 2', coverFile: 'Tempo 2.png', audioFile: 'Carolina Durante - Tempo 2.mp3' },
  { name: 'Black Jeep', title: 'Black Jeep', coverFile: 'Black Jeep.png', audioFile: 'fakemink - Black Jeep.mp3' },
  { name: 'Estrella Michelin', title: 'Estrella Michelin', coverFile: 'Estrella michelin.png', audioFile: 'Guxo - Estrella Michelin (feat. eestsyde.xo).mp3' },
  { name: 'Suano', title: 'Suano', coverFile: 'suano.png', audioFile: 'Ntg - Suano.mp3' },
  { name: 'SONRIE', title: 'SONRIE', coverFile: 'SONRIE.png', audioFile: 'Raly - SONRIE.mp3' },
  { name: 'Brandy Boo', title: 'Brandy Boo', coverFile: 'Brandy Boo.png', audioFile: 'Yung Brandy - Brandy Boo.mp3' },

  // Si este archivo cambia de nombre exacto, ajusta aquí:
  // La portada es "MIA.png" pero el audio suele venir como "M.I.A (...).mp3"
  // Pon aquí el nombre EXACTO del mp3 que tengas en /public/canciones
  { name: 'MIA', title: 'MIA', coverFile: 'MIA.png', audioFile: 'R8venge - M.I.A (feat. Yvngrobv).mp3' },

  { name: 'MAYBACH', title: 'MAYBACH', coverFile: 'MAYBACH.png', audioFile: 'Ugly - MAYBACH.mp3' },
  { name: 'ROCKMAN', title: 'ROCKMAN', coverFile: 'ROCKMAN.png', audioFile: 'Mk.gee - ROCKMAN.mp3' },

  // Kitate (tu portada se llama "Kitate.png"; el mp3 tiene nombre largo)
  { name: 'Kitate', title: 'Kitate', coverFile: 'Kitate.png', audioFile: 'benjitalkapone - Kitate.mp3' },

  { name: 'Demure', title: 'Demure', coverFile: 'Demure.png', audioFile: 'superreservao - Demure.mp3' },
  { name: 'CEO', title: 'CEO', coverFile: 'ceo.png', audioFile: 'Guxo - CEO.mp3' },

  { name: 'TE WA METER UN BEBÉ', title: 'TE WA METER UN BEBÉ', coverFile: 'TE WA METER UN BEBÉ.png', audioFile: 'VEI HABACHE - TE WA METER UN BEBÉ.mp3' },



  // #bestie (portada: "beestie.png" / audio: "Ugly - #bestie.mp3")
  { name: '#bestie', title: '#bestie', coverFile: 'beestie.png', audioFile: 'Ugly - #bestie.mp3' },

  { name: 'ran kan kan', title: 'ran kan kan', coverFile: 'ran kan kan.png', audioFile: 'Xiyo - ran kan kan.mp3' },
  { name: 'PIRRI', title: 'PIRRI', coverFile: 'PIRRI.png', audioFile: 'Ralphie Choo - PIRRI.mp3' },

  // Intergaláctica: portada "INTERGALACTICA A.png", audio "ANB - Intergaláctica.mp3"
  { name: 'Intergaláctica', title: 'Intergaláctica', coverFile: 'INTERGALACTICA.png', audioFile: 'ANB - Intergaláctica.mp3' },

  // P&M&M: portada "P&M&M.png", audio "Biberon - P M M (...).mp3"
  { name: 'P&M&M', title: 'P&M&M', coverFile: 'P&M&M.png', audioFile: 'Bíberon - P M M (feat. alberrrt).mp3' },

  // DIGITAL15: portada "digital 15.png", audio "Yk l t 5 Junaa - DIGITAL15.mp3"
  { name: 'DIGITAL15', title: 'DIGITAL15', coverFile: 'digital 15.png', audioFile: 'Yk It s Junaa - DIGITAL15.mp3' },

  // ENGANCHAO: portada "enganchao.png", audio "Biberon - ENGANCHAO.mp3"
  { name: 'ENGANCHAO', title: 'ENGANCHAO', coverFile: 'enganchao.png', audioFile: 'Bíberon - ENGANCHAO (feat. Dalsy).mp3' },

  // NoSTOi: portada "NoSTOi.png", audio "MVRK - NoSTOi.mp3"
  { name: 'NoSTOi', title: 'NoSTOi', coverFile: 'NoSTOi.png', audioFile: 'MVRK - NoSTOi.mp3' },

  // YOTMB: portada "YOTMB.png", audio "MVRK - YOTMB.mp3"
  { name: 'YOTMB', title: 'YOTMB', coverFile: 'YOTMB.png', audioFile: 'MVRK - YOTMB.mp3' },

  { name: 'Hermes', title: 'Hermes', coverFile: 'hermes.png', audioFile: 'Abhir - Hermes.mp3' },
  { name: 'Pop Up', title: 'Pop Up', coverFile: 'popup.png', audioFile: 'MVRK - Pop Up.mp3' },
  { name: 'Nevera', title: 'Nevera', coverFile: 'nevera.png', audioFile: 'Robert Dinero - Nevera.mp3' },
];

// Rutas reales en /public/videos
const COVER_BASES = ['/videos/portadas'];
const AUDIO_BASES = ['/videos/canciones'];

// Importante: encodeURIComponent para evitar problemas con #, &, espacios, tildes en los nombres de archivos.
const toUrl = (base, file) => `${base}/${encodeURIComponent(file)}`;

  const TRACKS = BASE_TRACKS.map((t) => {
  // Si algún día renombráis y queréis “por nombre base”:
  // - Si no hay coverFile/audioFile, se intenta con `${name}.png/jpg` y `${name}.mp3`
  const coverCandidates = [];
  const audioCandidates = [];

  // COVERS
  if (t.coverFile) {
    COVER_BASES.forEach((base) => coverCandidates.push(toUrl(base, t.coverFile)));
  } else {
    // fallback por nombre base (por si renombráis en el futuro)
    ['png', 'jpg', 'jpeg', 'webp'].forEach((ext) => {
      COVER_BASES.forEach((base) => coverCandidates.push(toUrl(base, `${t.name}.${ext}`)));
    });
  }

  // AUDIOS
  if (t.audioFile) {
    AUDIO_BASES.forEach((base) => audioCandidates.push(toUrl(base, t.audioFile)));
  } else {
    // fallback por nombre base (por si renombráis en el futuro)
    ['mp3', 'wav', 'm4a', 'ogg'].forEach((ext) => {
      AUDIO_BASES.forEach((base) => audioCandidates.push(toUrl(base, `${t.name}.${ext}`)));
    });
  }

  return { ...t, coverCandidates, audioCandidates };
});

// Tracks that get extra entries in the bag until they've been played once
const BOOST_ONCE = new Set(['hermes', 'nevera']);

export default function MusicDrawer() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(max-width:768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    try {
      window.PB_MUSIC_OWNER = 'react';
    } catch (_) {}

    const audio = document.getElementById('ipodAudio');
    const cover = document.getElementById('ipodCover');
    if (!audio || !cover) return;

    const progress = document.getElementById('ipodProgress');
    const progressFill = document.getElementById('ipodProgressFill');

    const enableWheelGestures =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      !window.matchMedia('(max-width:768px)').matches;

    const ui = {
      title: document.getElementById('ipodTitle'),
      artist: document.getElementById('ipodArtist'),
      prev: document.getElementById('btnPrev'),
      next: document.getElementById('btnNext'),
      play: document.getElementById('btnPlay'),
      wheel: document.getElementById('ipodWheel'),
    };

    let i = 0;
    let interacted = false;
    let keyboardEnabled = false;
    let coverAttempt = 0;
    let audioAttempt = 0;
    const ipodScreen = document.querySelector('.ipod-screen');

    const setAspect = (w = 4, h = 3) => {
      if (ipodScreen) ipodScreen.style.aspectRatio = `${w} / ${h}`;
    };

    let coverFailed = false;
    const onCoverLoad = () => {
      const w = cover.naturalWidth || 4;
      const h = cover.naturalHeight || 3;
      setAspect(w, h);
      cover.style.opacity = '1';
    };

    const onCoverError = () => {
      const t = TRACKS[i];
      if (t?.coverCandidates && coverAttempt + 1 < t.coverCandidates.length) {
        coverAttempt += 1;
        cover.src = t.coverCandidates[coverAttempt];
        return;
      }
      if (coverFailed) return;
      coverFailed = true;
      console.warn('[ipod] No se pudo cargar la portada', t?.coverCandidates?.[coverAttempt]);
      cover.removeAttribute('src');
      cover.style.opacity = '0';
    };

    cover.addEventListener('load', onCoverLoad);
    cover.addEventListener('error', onCoverError);

    function setProgress(pct) {
      if (!progressFill) return;
      const clamped = Math.max(0, Math.min(1, pct || 0));
      progressFill.style.transform = `scaleX(${clamped})`;
    }

    const onTimeUpdate = () => {
      if (!audio || !audio.duration || !isFinite(audio.duration)) return setProgress(0);
      setProgress(audio.currentTime / audio.duration);
    };

    const onLoadedMeta = () => {
      setProgress(0);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('durationchange', onLoadedMeta);
    audio.addEventListener('ended', () => setProgress(1));

    let history = [];
    let bag = [];

    // Indices of boosted tracks not yet played — gets 3 entries in the bag instead of 1
    const boostedUnplayed = new Set(
      TRACKS.reduce((acc, t, idx) => {
        if (BOOST_ONCE.has(t.name.toLowerCase())) acc.push(idx);
        return acc;
      }, [])
    );

    function shuffleLocal(a) {
      for (let j = a.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [a[j], a[k]] = [a[k], a[j]];
      }
      return a;
    }

    function refillBag(excludeIndex) {
      const candidates = [];
      [...Array(TRACKS.length).keys()]
        .filter((idx) => idx !== excludeIndex)
        .forEach((idx) => {
          candidates.push(idx);
          if (boostedUnplayed.has(idx)) {
            candidates.push(idx);
            candidates.push(idx);
          }
        });
      bag = shuffleLocal(candidates);
    }

    function loadTrack(index, autoplay = false) {
      i = (index + TRACKS.length) % TRACKS.length;
      boostedUnplayed.delete(i);
      const t = TRACKS[i];

      if (ui.title) ui.title.textContent = t.title || '';
      if (ui.artist) ui.artist.textContent = t.artist || '';

      coverFailed = false;
      coverAttempt = 0;
      audioAttempt = 0;

      cover.alt = t.title || 'Cover';
      cover.style.opacity = '0';
      const firstCover = t.coverCandidates?.[0] || '';
      if (firstCover) {
        cover.src = firstCover;
      } else {
        cover.removeAttribute('src');
      }

      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_) {}

      audio.src = t.audioCandidates?.[0] || '';
      if (audio.load) audio.load();

      setProgress(0);

      if (autoplay) {
        audio.play().catch(() => {});
      }
    }

    function next() {
      if (!bag.length) refillBag(i);
      history.push(i);
      const ni = bag.shift();
      loadTrack(ni, true);
    }

    function prev() {
      if (history.length) {
        const ni = history.pop();
        loadTrack(ni, true);
      } else {
        loadTrack(i - 1, true);
      }
    }

    async function togglePlay() {
      try {
        if (audio.paused) {
          audio.muted = false;
          await audio.play();
          interacted = true;
        } else {
          audio.pause();
        }
      } catch (_e) {}
    }

    function stopPlayback() {
      try {
        audio.pause();
        audio.currentTime = 0;
        setProgress(0);
      } catch (_) {}
    }

    const onPrev = () => prev();
    const onNext = () => next();
    const onPlay = () => togglePlay();
    const onPlayDbl = (e) => {
      e.preventDefault();
      stopPlayback();
    };

    ui.prev && ui.prev.addEventListener('click', onPrev);
    ui.next && ui.next.addEventListener('click', onNext);
    ui.play && ui.play.addEventListener('click', onPlay);
    ui.play && ui.play.addEventListener('dblclick', onPlayDbl);

    const onEnded = () => next();

    const onAudioError = () => {
      const t = TRACKS[i];
      if (t?.audioCandidates && audioAttempt + 1 < t.audioCandidates.length) {
        audioAttempt += 1;
        audio.src = t.audioCandidates[audioAttempt];
        if (audio.load) audio.load();
        audio.play().catch(() => {});
        return;
      }
      console.warn('[ipod] No se pudo reproducir el audio', t?.audioCandidates?.[audioAttempt]);
      next();
    };

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onAudioError);

    const onKeyDown = (e) => {
      if (!keyboardEnabled) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    [ui.prev, ui.next, ui.play, ui.wheel, cover].forEach((el) => {
      if (!el) return;
      el.addEventListener(
        'click',
        async () => {
          if (!interacted) {
            try {
              audio.muted = false;
              await audio.play();
              interacted = true;
              keyboardEnabled = true;
            } catch (_) {}
          }
        },
        { once: true }
      );
    });

    // clickwheel
    let dragging = false;
    let lastA = null;
    let accum = 0;
    const STEP = 40;

    function angle(e) {
      const r = ui.wheel.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const p = e.touches ? e.touches[0] : e;
      return (Math.atan2(p.clientY - cy, p.clientX - cx) * 180) / Math.PI;
    }

    function start(e) {
      dragging = true;
      lastA = angle(e);
      e.preventDefault();
    }

    function move(e) {
      if (!dragging) return;
      const a = angle(e);
      const da = a - lastA;
      lastA = a;
      accum += da;
      if (Math.abs(accum) > STEP) {
        if (accum > 0) next();
        else prev();
        accum = 0;
      }
      e.preventDefault();
    }

    function end() {
      dragging = false;
      lastA = null;
      accum = 0;
    }

    const onTouchStart = (e) => start(e);
    const onTouchMove = (e) => move(e);
    const onTouchEnd = () => end();

    if (enableWheelGestures && ui.wheel) {
      ui.wheel.addEventListener('mousedown', onTouchStart);
      document.addEventListener('mousemove', onTouchMove);
      document.addEventListener('mouseup', onTouchEnd);
      ui.wheel.addEventListener('touchstart', onTouchStart, { passive: false });
      document.addEventListener('touchmove', onTouchMove, { passive: false });
      document.addEventListener('touchend', onTouchEnd);
    }

    // initial state
    try {
      const startIndex = TRACKS.findIndex((t) => t.name.toLowerCase() === 'pop up');
      loadTrack(startIndex !== -1 ? startIndex : 0, false);
    } catch (_) {}

    return () => {
      cover.removeEventListener('load', onCoverLoad);
      cover.removeEventListener('error', onCoverError);

      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('durationchange', onLoadedMeta);

      ui.prev && ui.prev.removeEventListener('click', onPrev);
      ui.next && ui.next.removeEventListener('click', onNext);
      if (ui.play) {
        ui.play.removeEventListener('click', onPlay);
        ui.play.removeEventListener('dblclick', onPlayDbl);
      }
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onAudioError);
      document.removeEventListener('keydown', onKeyDown);
      if (enableWheelGestures && ui.wheel) {
        ui.wheel.removeEventListener('mousedown', onTouchStart);
        document.removeEventListener('mousemove', onTouchMove);
        document.removeEventListener('mouseup', onTouchEnd);
        ui.wheel.removeEventListener('touchstart', onTouchStart);
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, []);

  const handleTriggerClick = (e) => {
    if (!isMobile) return;
    try {
      e.preventDefault();
    } catch (_) {}
    setIsOpenMobile((open) => !open);
  };

  const drawerClassName = `music-drawer${isMobile && isOpenMobile ? ' is-open-mobile' : ''}`;

  return (
    <aside className={drawerClassName} id="musicDrawer">
      <button
        className="music-drawer__trigger"
        id="musicTrigger"
        aria-controls="musicPanel"
        aria-expanded="false"
        aria-label="Abrir reproductor"
        type="button"
        onClick={handleTriggerClick}
      >
        <Image className="music-drawer__icon" src="/ipod/IPod_29_2009.webp" alt="Reproductor" width={32} height={32} />
      </button>

      <div className="music-drawer__panel" id="musicPanel" role="region" aria-label="Reproductor iPod">
        {/* iPod MINI */}
        <div className="ipod-photo" aria-label="iPod mini">
          <div className="overlay">
            <div className="ipod-screen">
              <img id="ipodCover" alt="Portada" />
              <audio id="ipodAudio" preload="metadata" />

              <div className="ipod-progress" id="ipodProgress" aria-hidden="true">
                <div className="ipod-progress__fill" id="ipodProgressFill" />
              </div>

              <div>
                <div className="ipod-title" id="ipodTitle"></div>
                <div className="ipod-artist" id="ipodArtist"></div>
              </div>
            </div>
            <div className="ipod-wheel" id="ipodWheel">
              <button className="ipod-hotzone prev" id="btnPrev" aria-label="Anterior" title="Anterior" />
              <button className="ipod-hotzone next" id="btnNext" aria-label="Siguiente" title="Siguiente" />
              <button className="ipod-hotzone play" id="btnPlay" aria-label="Play/Pause" title="Play/Pause" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
