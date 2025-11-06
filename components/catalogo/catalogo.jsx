"use client";

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

export default function CatalogoPage() {
  return (
    <div>
      <PBConfig />
      <ModelsLoader />
      <BackgroundCanvas />
      <Hero />
      <Collage />
      <MusicDrawer />
      <ProductModal />
      <CartDrawer />
      <Footer />
      <TopIcons />
    </div>
  );
}
