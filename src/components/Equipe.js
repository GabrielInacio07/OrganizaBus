import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";

export default function EquipePage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px", amount: 0.3 });

  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768); // Mobile < 768px
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getAnimationProps = (initial, animate) =>
    isDesktop
      ? { initial, animate }
      : { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } };

  return (
    <section ref={ref} className="px-8 py-20 bg-gray-100 text-center overflow-hidden">
      <motion.div
        {...getAnimationProps(
          { opacity: 0, y: 30 },
          isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
        )}
        transition={
          isDesktop
            ? { duration: 0.8, ease: [0.16, 0.77, 0.47, 0.97] }
            : {}
        }
        className="max-w-5xl mx-auto"
      >
        <h1 className="text-4xl font-extrabold mb-8 text-[#0f1f4b]">Nossa Equipe</h1>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto">
          Conheça os membros dedicados que tornam o OrganizaBus possível.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {[{
            name: "Vitor Giacomini",
            role: "Desenvolvedor Frontend",
            img: "/img/imagem-perfil.jpg"
          }, {
            name: "Gabriel Inácio",
            role: "Desenvolvedor Backend",
            img: "/img/imagem-perfil.jpg"
          }].map(({ name, role, img }, i) => (
            <motion.div
              key={name}
              className="bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center"
              {...getAnimationProps(
                { opacity: 0, y: 20 },
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              )}
              transition={
                isDesktop
                  ? {
                      delay: 0.2 + i * 0.2,
                      duration: 0.6,
                      ease: [0.16, 0.77, 0.47, 0.97],
                    }
                  : {}
              }
            >
              <img
                src={img}
                alt={name}
                className="w-36 h-36 rounded-full object-cover mb-6 shadow-md"
              />
              <h2 className="text-2xl font-semibold mb-2 text-[#0f1f4b]">{name}</h2>
              <p className="text-gray-500">{role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
