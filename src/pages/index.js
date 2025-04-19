//Estilos
import styles from "@/styles/Home.module.css";

//Importações React
import { useRef } from "react";
import { useInView } from "framer-motion";

//Components
import Navbar from "@/components/Navbar";
import HeroContent from "@/components/hero/HeroContent";
import AboutSection from "@/components/secaoSobre";


export default function Home() {
  const sobreRef = useRef(null);
  const isInView = useInView(sobreRef, { once: true, margin: "-100px", amount: 0.3 });

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.sliderWrapper}>
       
        <HeroContent />
      </div>
     
      <div ref={sobreRef} className={styles.sobreWrapper}>
        <AboutSection isInView={isInView} />
      </div>
     
    </div>
  );
}