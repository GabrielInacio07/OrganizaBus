import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

export default function EquipePage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px", amount: 0.3 });

  return (
    <section ref={ref} className="px-6 py-16 bg-gray-200 text-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: [0.16, 0.77, 0.47, 0.97] }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-bold mb-6 text-[#1E3A8A]">Nossa Equipe</h1>
        <p className="text-lg text-[#4B5563] mb-8">
          Conheça os membros dedicados que tornam o OrganizaBus possível.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
     
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 0.77, 0.47, 0.97] }}
          >
            <img
              src="/img/vitor.jpg" 
              alt="Vitor Giacomini"
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h2 className="text-2xl font-semibold mb-2 text-[#1E3A8A]">Vitor Giacomini</h2>
            <p className="text-[#6B7280]">Desenvolvedor Frontend</p>
          </motion.div>

          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 0.77, 0.47, 0.97] }}
          >
            <img
              src="/img/gabriel.jpg"
              alt="Gabriel Inácio"
              className="w-32 h-32 rounded-full object-cover mb-4 align-center justify-center"
            />
            <h2 className="text-2xl font-semibold mb-2 text-[#1E3A8A]">Gabriel Inácio</h2>
            <p className="text-[#6B7280]">Desenvolvedor Backend</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
