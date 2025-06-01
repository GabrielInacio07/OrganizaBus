import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.2,
    once: false,
    margin: "0px 0px -100px 0px",
  });

  return (
    <div className="px-6 py-16 bg-gray-200 text-center overflow-hidden">
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{
          duration: 0.8,
          ease: [0.16, 0.77, 0.47, 0.97],
          when: "beforeChildren",
          staggerChildren: 0.15,
        }}
        className="max-w-3xl mx-auto"
      >
        <motion.h2
          className="text-4xl font-bold mb-6 text-[#1E3A8A]"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, ease: [0.16, 0.77, 0.47, 0.97] }}
        >
          Sobre o OrganizaBus
        </motion.h2>

        <motion.p
          className="text-lg text-[#6B7280] leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 0.77, 0.47, 0.97] }}
        >
          O OrganizaBus surgiu da necessidade de facilitar o controle financeiro e logístico dos transportes universitários. Nosso sistema permite que estudantes e organizadores tenham uma visão clara dos pagamentos, rotas, passageiros e muito mais.
        </motion.p>
      </motion.section>
    </div>
  );
}
