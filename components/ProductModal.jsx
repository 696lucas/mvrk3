"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export default function ProductModal() {
  const [relatedItems, setRelatedItems] = useState([]);
  const [carouselUrl, setCarouselUrl] = useState('');
  const [carouselAlt, setCarouselAlt] = useState('Producto');
  const [canCarousel, setCanCarousel] = useState(false);
  const canCarouselRef = useRef(false);
  const carouselFnsRef = useRef({ next: () => {}, prev: () => {} });
  useEffect(() => {
    try { window.PB_MODAL_OWNER = 'react'; } catch (_) {}

    const bodyEl = document.body;
    const modalEl = document.getElementById('pbProductModal');
    const overlayEl = document.getElementById('pbModalOverlay');
    const closeBtn = document.getElementById('pbProdCloseBtn');
    const cardEl = modalEl?.querySelector('.pb-product-modal-card');
    if (!modalEl) return;

    const titleEl = document.getElementById('pbProdTitle');
    const priceEl = document.getElementById('pbProdPrice');
    const descEl  = document.getElementById('pbProdDesc');
    const subEl   = document.getElementById('pbProdSub');
    const colorRowEl = document.getElementById('pbColorRow');
    const colorsBlockEl = document.querySelector('.pb-prod-colors-block');
    const sizeRowEl = document.getElementById('pbSizeRow');
    const sizesBlockEl = document.querySelector('.pb-prod-sizes-block');
    const qtyBoxEl = document.getElementById('pbQtyBox');
    const qtyNumEl = document.getElementById('pbQtyNum');
    const atcBtnEl = document.getElementById('pbATCBtn');
    const relatedRowEl = document.getElementById('pbRelatedRow');

    const frameEl  = cardEl?.querySelector('.pb-prod-carousel-frame');

    const clamp = (x, min, max) => Math.min(max, Math.max(min, x));
    const basename = (p)=> (p||'').split('/').pop();
    const applyAlias = (name)=> name;
    const fixAssetUrl = (u)=>{ if(!u) return u; const b = basename(u); return u.replace(/[^/]*$/, b); };
    const formatDescHtml = (raw) => {
      if (!raw) return '';
      const str = String(raw).replace(/\r\n/g, '\n');
      // Si ya trae HTML, respétalo.
      if (/<(p|br|ul|ol|li|div|span|strong|em|h\d)/i.test(str)) return str;
      // Convierte saltos dobles en párrafos y simples en <br>
      return str
        .split(/\n{2,}/)
        .map(s => s.trim())
        .filter(Boolean)
        .map(block => `<p>${block.replace(/\n/g, '<br />')}</p>`)
        .join('');
    };
    const lockBodyScroll = () => { bodyEl.classList.add('pb-modal-open', 'pb-product-modal-open'); };
    const unlockBodyScroll = () => { bodyEl.classList.remove('pb-product-modal-open'); bodyEl.classList.remove('pb-modal-open'); };

    let activeModelId = null;
    let activeVariantIndex = 0;
    let selectedSizeId = null;
    let currentImages = [];
    let currentImageIndex = 0;

    function renderCarouselImage(){
      if (!currentImages.length) return;
      const url = fixAssetUrl(currentImages[currentImageIndex]);
      setCarouselUrl(url || '');
      setCarouselAlt(titleEl?.textContent || 'Producto');
    }
    function goPrevImg(){
      if (!canCarouselRef.current || currentImages.length < 2) return;
      currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
      renderCarouselImage();
    }
    function goNextImg(){
      if (!canCarouselRef.current || currentImages.length < 2) return;
      currentImageIndex = (currentImageIndex + 1) % currentImages.length;
      renderCarouselImage();
    }
    // Mobile/desktop swipe support (no arrows)
    let startX = 0, startY = 0, isPointerDown = false, didSwipe = false;
    const SWIPE_THRESH = 40; // px
    const onPointerDown = (e) => {
      if (!canCarouselRef.current || currentImages.length <= 1) return;
      isPointerDown = true; didSwipe = false;
      const p = e.touches ? e.touches[0] : e;
      startX = p.clientX; startY = p.clientY;
    };
    const onPointerMove = (e) => {
      if (!isPointerDown) return;
      if (!canCarouselRef.current || currentImages.length <= 1) return;
      const p = e.touches ? e.touches[0] : e;
      const dx = p.clientX - startX; const dy = p.clientY - startY;
      if (!didSwipe && Math.abs(dx) > SWIPE_THRESH && Math.abs(dx) > Math.abs(dy) * 1.2) {
        didSwipe = true;
        if (dx < 0) goNextImg(); else goPrevImg();
      }
    };
    const onPointerUp = () => { isPointerDown = false; didSwipe = false; };
    if (frameEl) {
      try { frameEl.style.touchAction = 'pan-y'; } catch {}
      frameEl.addEventListener('touchstart', onPointerDown, { passive: true });
      frameEl.addEventListener('touchmove', onPointerMove, { passive: true });
      frameEl.addEventListener('touchend', onPointerUp, { passive: true });
      frameEl.addEventListener('mousedown', onPointerDown);
      frameEl.addEventListener('mousemove', onPointerMove);
      frameEl.addEventListener('mouseup', onPointerUp);
      frameEl.addEventListener('mouseleave', onPointerUp);
    }

    // Swipe support removed to restore previous behavior

    function renderMedia(images){
      currentImages = images || [];
      currentImageIndex = 0;
      const enabled = currentImages.length > 1;
      canCarouselRef.current = enabled;
      setCanCarousel(enabled);
      renderCarouselImage();
    }

    // Expose carousel controls to JSX buttons
    carouselFnsRef.current = { next: goNextImg, prev: goPrevImg };

    function getColorValue(variant){
      if (variant?.colorLabel) return String(variant.colorLabel).trim();
      const opts = variant?.selectedOptions || [];
      const c = opts.find(o => String(o?.name||'').toLowerCase() === 'color');
      return c ? String(c.value||'').trim() : '';
    }

    function pickGalleryImages(model, variant){
      const gallery =
        model?.variantGallery ||
        (model?.variantGalleryJson ? (()=>{ try { return JSON.parse(model.variantGalleryJson); } catch { return null; } })() : null);
      if (!gallery || typeof gallery !== 'object') return null;
      const color = getColorValue(variant);
      const key = color || 'default';
      const arr = gallery[key];
      return Array.isArray(arr) ? arr : null;
    }

    // Legacy base updater
    function escapeHtml(text){
      return String(text)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
    }

    function baseUpdateVariantContent(model, variant){
      const fullTitle = variant.colorLabel ? `${model.title} (${variant.colorLabel})` : model.title;
      if (titleEl) titleEl.textContent = fullTitle;
      if (priceEl) priceEl.textContent = variant.price || '';
      if (subEl)   subEl.textContent   = variant.colorLabel ? String(variant.colorLabel) : '';
      if (descEl){
        const rawDesc =
          variant?.desc ??
          variant?.description ??
          variant?.body_html ??
          variant?.bodyHtml ??
          model?.desc ??
          model?.description ??
          '';
        const looksLikeHtml = /<[^>]+>/.test(String(rawDesc));
        if (looksLikeHtml) {
          descEl.innerHTML = rawDesc;
        } else {
          const bulletParts = String(rawDesc).split(/•/).map(s=>s.trim()).filter(Boolean);
          if (bulletParts.length >= 2){
            descEl.innerHTML = `<ul>${bulletParts.map(li=>`<li>${escapeHtml(li)}</li>`).join('')}</ul>`;
          } else {
            descEl.textContent = rawDesc;
          }
        }
      }
      if (qtyNumEl) qtyNumEl.textContent = '1';
      if (atcBtnEl){ atcBtnEl.disabled = true; atcBtnEl.textContent = 'Agotado'; atcBtnEl.style.cursor = 'not-allowed'; atcBtnEl.style.opacity = '.6'; }
      const byColor = pickGalleryImages(model, variant);

      // Metafield => usar sus imágenes. Sin metafield => solo la primera imagen para evitar carrusel.
      let imgs = [];
      if (Array.isArray(byColor) && byColor.length > 0) {
        imgs = byColor;
      } else {
        const fallback = Array.isArray(variant.images) ? variant.images : [];
        imgs = fallback.length ? [fallback[0]] : [];
      }

      renderMedia(imgs.map(fixAssetUrl));
      renderRelated(variant.key);
    }

    function buildColorPills(model){
      if (!colorRowEl || !colorsBlockEl) return;
      colorRowEl.innerHTML = '';
      const hasRealColors = (model.variants||[]).length > 1 || (model.variants||[]).some(v=> v.colorLabel && v.colorLabel.trim()!=='');
      if (!hasRealColors){ colorsBlockEl.style.display='none'; return; }
      colorsBlockEl.style.display='grid';
      (model.variants||[]).forEach((v,i)=>{
        const pill = document.createElement('button');
        pill.className = 'pb-color-pill' + (i===activeVariantIndex?' active':'');
        pill.textContent = v.colorLabel || ('Color '+(i+1));
        pill.addEventListener('click', (ev)=>{
          ev.stopPropagation(); if (activeVariantIndex===i) return;
          const prevScroll = modalEl.scrollTop;
          activeVariantIndex = i;
          if (typeof window.updateVariantContent === 'function') window.updateVariantContent(model, model.variants[i]);
          Array.from(colorRowEl.children).forEach((btn, idx)=>{ btn.classList.toggle('active', idx===activeVariantIndex); });
          modalEl.scrollTop = prevScroll;
        });
        colorRowEl.appendChild(pill);
      });
    }

    function buildSizePillsByKey(cdnKey){
      if (!sizeRowEl) return;
      sizeRowEl.innerHTML = '';
      const sizes = (window.KEY_TO_SIZES && window.KEY_TO_SIZES.get(cdnKey)) || [];
      const hide = !sizes.length;
      if (sizesBlockEl) sizesBlockEl.style.display = hide ? 'none' : '';
      sizeRowEl.style.display = hide ? 'none' : '';
      if (hide){ selectedSizeId = null; return; }
      selectedSizeId = null;
      sizes.forEach((s)=>{
        const pill = document.createElement('button'); pill.className = 'pb-size-pill'; pill.textContent = s.label || '';
        if (!s.available){ pill.disabled = true; pill.classList.add('is-disabled'); }
        if (s.available && !selectedSizeId){ selectedSizeId = s.id; pill.classList.add('active'); }
        pill.addEventListener('click', (ev)=>{ ev.stopPropagation(); if (!s.available) return; selectedSizeId = s.id; Array.from(sizeRowEl.children).forEach(b=> b.classList.remove('active')); pill.classList.add('active'); });
        sizeRowEl.appendChild(pill);
      });
    }

    function renderRelated(currentVariantKey){
      const relKeys = getRelatedKeys(currentVariantKey);
      const items = [];
      relKeys.forEach((vKey)=>{
        const match = findModelByVariantKey(vKey);
        if (!match) return;
        const { modelId, model, variantIndex } = match;
        const variant = model.variants[variantIndex];
        if (variant.soldOut) return;
        const firstImg = (variant.images && variant.images[0]) ? fixAssetUrl(variant.images[0]) : '';
        items.push({
          modelId,
          variantIndex,
          firstImg,
          title: model.title,
          price: variant.price || '',
          soldOut: false,
        });
      });
      setRelatedItems(items);
    }

    function findModelByVariantKey(variantKey){
      const key = applyAlias(basename(variantKey||''));
      const PB_MODELS = window.PB_MODELS || {};
      for (const modelId in PB_MODELS){ const model = PB_MODELS[modelId]; const idx = (model.variants||[]).findIndex(v => applyAlias(basename(v.key)) === key); if (idx !== -1) return { modelId, model, variantIndex: idx }; }
      return null;
    }
    function getRelatedKeys(currentVariantKey){
      const current = applyAlias(basename(currentVariantKey||''));
      const PB_MODELS = window.PB_MODELS || {};
      const allKeys = new Set();
      for (const m of Object.values(PB_MODELS)){ for (const v of (m.variants||[])){ if (v.soldOut) continue; const k = applyAlias(basename(v.key||'')); if (k && k !== current) allKeys.add(k); } }
      const arr = Array.from(allKeys); for (let i=arr.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [arr[i],arr[j]]=[arr[j],arr[i]]; }
      return arr.slice(0,5);
    }

    function openProductModalByModelAndVariant(modelId, variantIndex){
      const PB_MODELS = window.PB_MODELS || {};
      const model = PB_MODELS[modelId]; if (!model) return;
      activeModelId = modelId; activeVariantIndex = Number(variantIndex)||0;
      const variant = model.variants[activeVariantIndex];
      buildColorPills(model);
      if (typeof window.updateVariantContent === 'function') window.updateVariantContent(model, variant);
      modalEl.classList.add('is-open'); modalEl.setAttribute('aria-hidden','false'); lockBodyScroll(); modalEl.scrollTop = 0;
    }
    function openProductModalFromCollage(variantKey, imgURL){
      const match = findModelByVariantKey(variantKey);
      if (match){ openProductModalByModelAndVariant(match.modelId, match.variantIndex); return; }
      activeModelId = null; activeVariantIndex = 0;
      const fallbackModel = { title: applyAlias(basename(variantKey)).replace(/\.(png|webp|jpg|jpeg)$/i,'').replace(/[_-]+/g,' ').trim(), variants:[{ colorLabel:'', key: applyAlias(basename(variantKey)), price:'', desc:'', images:[imgURL], soldOut:true }] };
      buildColorPills(fallbackModel);
      if (typeof window.updateVariantContent === 'function') window.updateVariantContent(fallbackModel, fallbackModel.variants[0]);
      modalEl.classList.add('is-open'); modalEl.setAttribute('aria-hidden','false'); lockBodyScroll(); modalEl.scrollTop = 0;
    }
    function closeProductModal(){ modalEl.classList.remove('is-open'); modalEl.setAttribute('aria-hidden','true'); unlockBodyScroll(); }

    const interactiveSelectors = [
      '.pb-prod-carousel-frame',
      '.pb-prod-carousel-image',
      '.pb-colors-row',
      '.pb-color-pill',
      '.pb-sizes-row',
      '.pb-size-pill',
      '.pb-qty-box',
      '.pb-qty-btn',
      '#pbATCBtn',
      '.pb-related-row',
      '.pb-related-card',
      'button',
      'a'
    ];
    const onCardClick = (event) => {
      if (!modalEl.classList.contains('is-open')) return;
      const target = event.target;
      if (!cardEl?.contains(target)) return;
      if (interactiveSelectors.some((selector) => target.closest(selector))) return;
      event.stopPropagation();
      closeProductModal();
    };

    const onCloseClick = (ev)=>{ ev.stopPropagation(); closeProductModal(); };
    const onOverlayClick = ()=> closeProductModal();
    const onEsc = (e)=>{ if (e.key === 'Escape') closeProductModal(); };
    closeBtn && closeBtn.addEventListener('click', onCloseClick);
    cardEl && cardEl.addEventListener('click', onCardClick);
    overlayEl && overlayEl.addEventListener('click', onOverlayClick);
    document.addEventListener('keydown', onEsc);

    // Mobile only: tap on background area around the card closes the modal
    const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width:768px)').matches;
    const onModalBgTap = (e) => {
      if (!modalEl.classList.contains('is-open')) return;
      if (cardEl && cardEl.contains(e.target)) return;
      closeProductModal();
    };
    if (isMobile) modalEl.addEventListener('click', onModalBgTap);
    const onQty = (e)=>{ const btn = e.target.closest('.pb-qty-btn'); if(!btn) return; e.stopPropagation(); let qty = parseInt(qtyNumEl?.textContent||'1',10); const delta = parseInt(btn.dataset.delta||'0',10); qty = clamp(qty+delta,1,9); if(qtyNumEl) qtyNumEl.textContent=String(qty); };
    qtyBoxEl && qtyBoxEl.addEventListener('click', onQty);

    window.openProductModalByModelAndVariant = openProductModalByModelAndVariant;
    window.openProductModalFromCollage = openProductModalFromCollage;

    window.updateVariantContent = function(model, variant){
      baseUpdateVariantContent(model, variant);
      const keyRaw = (variant?.key || (variant?.images && variant.images[0]) || '') || '';
      const cdnKey = String(keyRaw).split('?')[0];
      buildSizePillsByKey(cdnKey);
      const vPayload = (window.KEY_TO_VARIANT && window.KEY_TO_VARIANT.get(cdnKey)) || null;
      if (priceEl && vPayload?.price) priceEl.textContent = vPayload.price;
      if (atcBtnEl){
        const available = vPayload ? vPayload.available : !variant.soldOut;
        atcBtnEl.disabled = !available; atcBtnEl.textContent = available ? 'Añadir al carrito' : 'Agotado';
        atcBtnEl.style.cursor = available ? 'pointer' : 'not-allowed'; atcBtnEl.style.opacity = available ? '1' : '.6';
        atcBtnEl.onclick = async (ev)=>{ ev.stopPropagation(); if (!available) return; const qty = Math.max(1, Math.min(9, parseInt(qtyNumEl?.textContent||'1',10) || 1)); const variantId = selectedSizeId || (vPayload && vPayload.id); if (variantId && typeof window.cartAdd === 'function') await window.cartAdd(variantId, qty); };
        atcBtnEl.ondblclick = (e)=>{ e.stopPropagation(); if (typeof window.openCartPopup === 'function') window.openCartPopup(); };
      }
    };

    return () => {
      closeBtn && closeBtn.removeEventListener('click', onCloseClick);
      cardEl && cardEl.removeEventListener('click', onCardClick);
      overlayEl && overlayEl.removeEventListener('click', onOverlayClick);
      document.removeEventListener('keydown', onEsc);
      if (isMobile) modalEl.removeEventListener('click', onModalBgTap);
      qtyBoxEl && qtyBoxEl.removeEventListener('click', onQty);
      if (frameEl){
        frameEl.removeEventListener('touchstart', onPointerDown);
        frameEl.removeEventListener('touchmove', onPointerMove);
        frameEl.removeEventListener('touchend', onPointerUp);
        frameEl.removeEventListener('mousedown', onPointerDown);
        frameEl.removeEventListener('mousemove', onPointerMove);
        frameEl.removeEventListener('mouseup', onPointerUp);
        frameEl.removeEventListener('mouseleave', onPointerUp);
      }
      bodyEl.classList.remove('pb-product-modal-open');
      bodyEl.classList.remove('pb-modal-open');
    };
  }, []);

  return (
    <div id="pbProductModal" aria-hidden="true">
      <div className="pb-modal-overlay" id="pbModalOverlay" aria-hidden="true"></div>

      <div className="pb-product-modal-card" role="dialog" aria-modal="true" aria-labelledby="pbProdTitle">
        <button className="pb-prod-close-btn" id="pbProdCloseBtn" aria-label="Cerrar">
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>

        <section className="pb-prod-main">
          {/* Mobile brand to go back to catalog (mobile-only via CSS) */}
          <a
            className="pb-modal-brand"
            href="#"
            onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); if (typeof window.showCatalog==='function') window.showCatalog(); const m=document.getElementById('pbProductModal'); if(m){ m.classList.remove('is-open'); m.setAttribute('aria-hidden','true'); } document.body.classList.remove('pb-modal-open'); document.body.classList.remove('pb-product-modal-open'); }}
            aria-label="Volver al catálogo"
          >
            <img src="/lettering/logo-C-sEIKdg.webp" alt="Logo PB" />
          </a>
          <div className="pb-prod-gallery">
            <div className="pb-prod-carousel-frame">
              <Image id="pbCarouselImage" className="pb-prod-carousel-image" alt={carouselAlt} src={carouselUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=='} width={500} height={500} unoptimized />
            </div>
            {canCarousel && (
              <>
                <button
                  type="button"
                  aria-label="Anterior"
                  onClick={(e)=>{ e.stopPropagation(); carouselFnsRef.current.prev(); }}
                  style={{ position:'absolute', left:'6px', top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', padding:'6px', cursor:'pointer', zIndex:3 }}
                >
                  <img src="/icon/flechaizquierda.png" alt="Anterior" style={{ width:'42px', height:'42px', filter:'drop-shadow(0 4px 8px rgba(0,0,0,.35))' }} />
                </button>
                <button
                  type="button"
                  aria-label="Siguiente"
                  onClick={(e)=>{ e.stopPropagation(); carouselFnsRef.current.next(); }}
                  style={{ position:'absolute', right:'6px', top:'50%', transform:'translateY(-50%)', background:'transparent', border:'none', padding:'6px', cursor:'pointer', zIndex:3 }}
                >
                  <img src="/icon/flechaderecha.png" alt="Siguiente" style={{ width:'42px', height:'42px', filter:'drop-shadow(0 4px 8px rgba(0,0,0,.35))' }} />
                </button>
              </>
            )}
          </div>

          <div className="pb-prod-details">
            <div>
              <h2 className="pb-prod-title" id="pbProdTitle"></h2>
              <div className="pb-prod-price" id="pbProdPrice"></div>
              <div className="pb-prod-sub" id="pbProdSub"></div>
            </div>

            <div className="pb-prod-colors-block">
              <div className="pb-prod-label">Color</div>
              <div className="pb-colors-row" id="pbColorRow"></div>
            </div>

            <div className="pb-prod-sizes-block">
              <div className="pb-prod-label">Talla</div>
              <div className="pb-sizes-row" id="pbSizeRow"></div>
            </div>

            <div className="pb-purchase-row">
              <div className="pb-qty-box" id="pbQtyBox">
                <button className="pb-qty-btn" data-delta="-1">−</button>
                <div className="pb-qty-num" id="pbQtyNum">1</div>
                <button className="pb-qty-btn" data-delta="1">+</button>
              </div>
              <button className="pb-atc-btn" id="pbATCBtn" disabled>Agotado</button>
            </div>

            <div
              className="pb-prod-desc"
              id="pbProdDesc"
              style={{ fontWeight: 600, lineHeight: 1.5, whiteSpace: 'pre-line' }}
            ></div>
          </div>
        </section>

        <aside className="pb-related-block">
          <div className="pb-related-title"><span>You may also like</span></div>
          <div className="pb-related-row" id="pbRelatedRow">
            {relatedItems.map((it, idx) => (
              <button
                key={`${it.modelId}-${it.variantIndex}-${idx}`}
                type="button"
                className="pb-related-card"
                onClick={(ev) => {
                  ev.stopPropagation();
                  if (typeof window.openProductModalByModelAndVariant === 'function') {
                    window.openProductModalByModelAndVariant(it.modelId, it.variantIndex);
                  }
                }}
              >
                <div className="pb-related-imgwrap">
                  <Image src={it.firstImg} alt={it.title} width={120} height={120} unoptimized />
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 12, lineHeight: 1.3 }}>{it.title}</div>
                <div style={{ opacity: 0.7, fontSize: 12 }}>{it.price}</div>
                <div className="pb-related-chip">{it.soldOut ? 'Agotado' : 'Disponible'}</div>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
