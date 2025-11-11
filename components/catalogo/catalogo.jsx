"use client";

import { useEffect, useState } from "react";
import "./catalogo.css";
import ModelsLoader from "../ModelsLoader";
import PBConfig from "../PBConfig";
import BackgroundCanvas from "../BackgroundCanvas";
import Hero from "../Hero";
import Collage from "../Collage";
import MusicDrawer from "../MusicDrawer";
import ProductModal from "../ProductModal";
import Footer from "../Footer";
import TopIcons from "../TopIcons";
import CartDrawer from "../CartDrawer";
import OrdersView from "../OrdersView";
import AccountPopup from "../AccountPopup";

export default function CatalogoPage() {
  const [view, setView] = useState("catalog"); // 'catalog' | 'orders'

  useEffect(() => {
    // global toggles
    window.showOrders = () => setView("orders");
    window.showCatalog = () => setView("catalog");
    const heroEls = Array.from(document.querySelectorAll('header.hero, header.hero img'));
    const onHero = () => setView("catalog");
    heroEls.forEach(el => el.addEventListener('click', onHero));
    return () => { heroEls.forEach(el => el.removeEventListener('click', onHero)); };
  }, []);

  return (
    <div>
      <PBConfig />
      <ModelsLoader />
      <BackgroundCanvas />
      <Hero />
      {view === 'orders' ? <OrdersView /> : <Collage />}
      <MusicDrawer />
      <ProductModal />
      <CartDrawer />
      <AccountPopup />
      <Footer />
      <TopIcons />
    </div>
  );
}
