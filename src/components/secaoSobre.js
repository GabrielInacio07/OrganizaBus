import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";

export default function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.2,
    once: false,
    margin: "0px 0px -100px 0px",
  });

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); // Mobile < 768px
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Função auxiliar para decidir se aplica animação ou estado final
  const getAnimationProps = (initial, animate) =>
    isDesktop
      ? { initial, animate }
      : { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } };

  return (
    <div className="px-8 py-20 bg-gray-100 text-center overflow-hidden">
      <motion.section
        ref={ref}
        {...getAnimationProps(
          { opacity: 0, y: 30 },
          isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
        )}
        transition={
          isDesktop
            ? {
                duration: 0.8,
                ease: [0.16, 0.77, 0.47, 0.97],
                when: "beforeChildren",
                staggerChildren: 0.15,
              }
            : {}
        }
        className="max-w-3xl mx-auto"
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-6 text-[#0f1f4b]"
          {...getAnimationProps(
            { opacity: 0, y: 10 },
            isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
          )}
          transition={
            isDesktop
              ? { duration: 0.6, ease: [0.16, 0.77, 0.47, 0.97] }
              : {}
          }
        >
          Sobre o OrganizaBus
        </motion.h2>

        <motion.p
          className="text-1xl md:text-2xl text-[#6B7280] leading-relaxed"
          {...getAnimationProps(
            { opacity: 0, y: 10 },
            isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
          )}
          transition={
            isDesktop
              ? {
                  duration: 0.6,
                  delay: 0.15,
                  ease: [0.16, 0.77, 0.47, 0.97],
                }
              : {}
          }
        >
          O OrganizaBus surgiu da necessidade de facilitar o controle financeiro e logístico dos transportes universitários. Nosso sistema permite que estudantes e organizadores tenham uma visão clara dos pagamentos, rotas, passageiros e muito mais.
        </motion.p>
      </motion.section>
    </div>
  );
}
