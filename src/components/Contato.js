import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

export default function ContatoPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px", amount: 0.3 });

  return (
    <section
      ref={ref}
      className="bg-gray-200 py-16 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: [0.16, 0.77, 0.47, 0.97] }}
        className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        <div>
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Fale com a gente</h2>
          <p className="text-gray-600 text-lg mb-6">
            Tem dúvidas, sugestões ou precisa de suporte? Envie uma mensagem e responderemos o quanto antes.
          </p>
          <ul className="text-gray-700 space-y-2">
            <li><strong>Email:</strong> contato@organizabus.com</li>
            <li><strong>Telefone:</strong> (11) 99999-9999</li>
            <li><strong>Endereço:</strong> Rua da Mobilidade, 123, Centro</li>
          </ul>
        </div>

        <form className="bg-gray-100 p-6 rounded-lg shadow-lg">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Mensagem
            </label>
            <textarea
              id="message"
              rows="4"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Enviar
          </button>
        </form>
      </motion.div>
    </section>
  );
}