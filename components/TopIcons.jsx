'use client';

import { useEffect } from 'react';
import Image from 'next/image';

export default function TopIcons() {
  useEffect(() => {
    const cartTriggers = Array.from(document.querySelectorAll('.pb-cart-trigger, a[href="/cart"]'));
    function onCartClick(e){
      if (typeof window.openCartPopup === 'function') {
        e.preventDefault();
        e.stopPropagation();
        window.openCartPopup();
      }
    }
    cartTriggers.forEach(el => { el.addEventListener('click', onCartClick, { passive: false }); el.setAttribute('role','button'); el.setAttribute('aria-haspopup','dialog'); el.style.cursor='pointer'; });

    const userTriggers = Array.from(document.querySelectorAll('.pb-user-trigger, a[href="/account"]'));
    function onUserClick(e){
      if (typeof window.openAccountPopup === 'function') {
        e.preventDefault();
        e.stopPropagation();
        window.openAccountPopup();
      }
    }
    userTriggers.forEach(el => { el.addEventListener('click', onUserClick, { passive: false }); el.setAttribute('role','button'); el.setAttribute('aria-haspopup','dialog'); el.style.cursor='pointer'; });

    return () => {
      cartTriggers.forEach(el => el.removeEventListener('click', onCartClick));
      userTriggers.forEach(el => el.removeEventListener('click', onUserClick));
    };
  }, []);
  return (
    <div className="pb-top-icons" aria-label="Acciones rápidas">
      <a href="/account" className="pb-top-icon pb-user-trigger" title="Cuenta">
        <Image src="/icon/user.png" alt="Cuenta" width={24} height={24} />
      </a>
      <a href="/cart" className="pb-top-icon pb-cart-trigger" title="Carrito">
        <Image src="/icon/carrito.png" alt="Carrito" width={24} height={24} />
      </a>
    </div>
  );
}

