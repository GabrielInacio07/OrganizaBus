import Navbar from "@/components/Navbar";
import styles from "@/styles/Home.module.css";
import { TypeAnimation } from "react-type-animation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import VamosComecar from "@/components/StyledButton";

export default function Home() {
  const sobreRef = useRef(null);
  const isInView = useInView(sobreRef, { once: true, margin: "-100px" });

  return (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.sliderWrapper}>
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          className={styles.swiper}
        >
          <SwiperSlide>
            <div
              className={styles.slide}
              style={{ backgroundImage: "" }}
            />
          </SwiperSlide>
          <SwiperSlide>
            <div
              className={styles.slide}
              style={{ backgroundImage: "" }}
            />
          </SwiperSlide>
          <SwiperSlide>
            <div
              className={styles.slide}
              style={{ backgroundImage: "" }}
            />
          </SwiperSlide>
        </Swiper>

        <main className={styles.overlayContent}>
          <h1 className={styles.title}>
            <TypeAnimation
              sequence={[" Bem-vindo a OrganizaBus", 2000, ""]}
              speed={{ type: "keyStrokeDelayInMs", value: 120 }}
              style={{ fontSize: "2.5rem" }}
              repeat={Infinity}
            />
          </h1>
          <p className={styles.description}>
            Uma solução completa e segura para gerenciar os pagamentos do seu transporte universitário.
          </p>
          <VamosComecar/>
        </main>
      </div>

      <div ref={sobreRef} className={styles.sobreWrapper}>
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className={styles.sobreSection}
        >
          <h2 className={styles.subtitle}>Sobre o OrganizaBus</h2>
          <p className={styles.text}>
            O OrganizaBus surgiu da necessidade de facilitar o controle financeiro e logístico dos transportes universitários. Nosso sistema permite que estudantes e organizadores tenham uma visão clara dos pagamentos, rotas, passageiros e muito mais.
          </p>
        </motion.section>
      </div>
    </div>
  );
}
