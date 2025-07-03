import React from 'react';
import { FaInstagram, FaGithub } from 'react-icons/fa';
import Image from 'next/image';

const developers = [
  {
    name: 'Gabriel Inácio',
    instagram: 'https://instagram.com/gabriel_inacio07',
    github: 'https://github.com/gabrielinacio07',
  },
  {
    name: 'Vitor Giacomini',
    instagram: 'https://instagram.com/vgiacominixx.dev',
    github: 'https://github.com/VitorGiacomini',
  },
];

const Footer = () => (
  <footer className="bg-[#0f1f4b] text-white px-4 py-10">
    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
      
      {/* Logo + Texto */}
      <div className="flex flex-col items-center md:flex-row md:items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md">
          <Image
            src="/img/logo.png"
            alt="Logo OrganizaBus"
            width={70}
            height={70}
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold mt-2 md:mt-0">OrganizaBus</h3>
          <p className="text-sm text-white/80 leading-relaxed mt-1 md:mt-0">
            Sistema moderno para gestão de pagamentos no transporte universitário.
          </p>
        </div>
      </div>

      {/* Desenvolvedores */}
      <div>
        <h4 className="text-lg font-semibold mb-4">Desenvolvedores</h4>
        <div className="flex flex-col sm:flex-row sm:justify-center md:justify-start sm:gap-10 gap-6">
          {developers.map((dev, idx) => (
            <div key={idx} className="flex flex-col items-center md:items-start">
              <p className="font-medium text-sm">{dev.name}</p>
              <div className="flex gap-4 text-xl mt-1">
                <a
                  href={dev.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F97316] transition"
                >
                  <FaInstagram />
                </a>
                <a
                  href={dev.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#F97316] transition"
                >
                  <FaGithub />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="mt-10 border-t border-white/20 pt-6 text-center text-xs text-white/60">
      © 2025 OrganizaBus — Todos os direitos reservados.
    </div>
  </footer>
);

export default Footer;
