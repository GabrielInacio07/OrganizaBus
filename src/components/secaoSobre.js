import { motion } from "framer-motion";
import styles from "@/styles/components/secaoSobre.module.css";
import { useRef } from "react";
import { useInView } from "framer-motion";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.2, // Reduzido para ativar a animação mais cedo
    once: false,
    margin: "0px 0px -100px 0px" // Ajusta o ponto de ativação
  });

  return (
    <div className={styles.sobreWrapper}>
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 30 }} // Reduzi o Y inicial para menos movimento
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ 
          duration: 0.8, // Aumentei a duração para ser mais suave
          ease: [0.16, 0.77, 0.47, 0.97], // Curva de easing personalizada
          when: "beforeChildren",
          staggerChildren: 0.15 // Reduzi o stagger para ser mais rápido
        }}
        className={styles.sobreSection}
      >
        <motion.h2 
          className={styles.subtitle}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ 
            duration: 0.6,
            ease: [0.16, 0.77, 0.47, 0.97]
          }}
        >
          Sobre o OrganizaBus
        </motion.h2>
        
        <motion.p 
          className={styles.text}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ 
            duration: 0.6,
            delay: 0.15,
            ease: [0.16, 0.77, 0.47, 0.97]
          }}
        >
          O OrganizaBus surgiu da necessidade de facilitar o controle financeiro e logístico dos transportes universitários. Nosso sistema permite que estudantes e organizadores tenham uma visão clara dos pagamentos, rotas, passageiros e muito mais.
        </motion.p>
      </motion.section>
    </div>
  );
}