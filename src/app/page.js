'use client';

import { useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroContent from "@/components/hero/HeroContent";
import AboutSection from "@/components/secaoSobre";
import Footer from "@/components/Footer";
import Separator from "@/components/separador/Separador";
import ContatoPage from "@/components/Contato";
import EquipePage from "@/components/Equipe";
import LoadingOverlay from "@/components/loadingOverlay";

export default function Home() {
  const sobreRef = useRef(null);
  const equipeRef = useRef(null);
  const contatoRef = useRef(null);

  return (
    <>    
      <LoadingOverlay />
    <div className="w-full min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroContent />
      <div>
        <div ref={sobreRef}>
          <AboutSection />
        </div>
        <Separator />
        <div ref={equipeRef}>
          <EquipePage />
        </div>
        <Separator />
        <div ref={contatoRef}>
          <ContatoPage />
        </div>
      </div>
      <Footer />
    </div>
    </>

  );
}