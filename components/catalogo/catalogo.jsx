"use client";

import { useEffect, useRef, useState } from "react";
import "./catalogo.css";
import ModelsLoader from "../ModelsLoader";
import PBConfig from "../PBConfig";
import Hero from "../Hero";
import Collage from "../Collage";
import ProductModal from "../ProductModal";
import Footer from "../Footer";
import TopIcons from "../TopIcons";
import CartDrawer from "../CartDrawer";
import OrdersView from "../OrdersView";
import AccountPopup from "../AccountPopup";
import NewsletterModal from "../NewsletterModal";

export default function CatalogoPage() {
  const [view, setView] = useState("catalog"); // 'catalog' | 'orders'
  const ordersAnchorRef = useRef(null);

  useEffect(() => {
    // helper para hacer scroll al panel de pedidos
    const scrollToOrders = () => {
      try {
        const el =
          ordersAnchorRef.current ||
          document.getElementById("pb-orders-anchor") ||
          document.querySelector(".pb-orders");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch {}
    };

    // global toggles
    window.showOrders = () => {
      setView("orders");
      // intenta desplazar después de renderizar
      setTimeout(scrollToOrders, 50);
      setTimeout(scrollToOrders, 300);
    };
    window.showCatalog = () => setView("catalog");
    // abrir pedidos automáticamente si viene ?show=orders
    try {
      const params = new URLSearchParams(window.location.search);
      if ((params.get("show") || "").toLowerCase() === "orders") {
        window.showOrders();
      }
    } catch {}
    const heroEls = Array.from(document.querySelectorAll('header.hero, header.hero img'));
    const onHero = () => setView("catalog");
    heroEls.forEach(el => el.addEventListener('click', onHero));
    return () => { heroEls.forEach(el => el.removeEventListener('click', onHero)); };
  }, []);

  return (
    <div>
      <PBConfig />
      <ModelsLoader />
      <Hero />
      {/* ancla para hacer scroll al abrir pedidos */}
      <div id="pb-orders-anchor" ref={ordersAnchorRef} />
      {view === 'orders' ? <OrdersView /> : <Collage />}
      <ProductModal />
      <CartDrawer />
      <AccountPopup />
      <Footer />
      <NewsletterModal />
      <TopIcons />
    </div>
  );
}
