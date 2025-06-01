import React from 'react';
import { FaInstagram, FaGithub } from 'react-icons/fa';

const developers = [
    {
        name: 'Desenvolvedor 1',
        instagram: 'https://instagram.com/seu_instagram1',
        github: 'https://github.com/seu_github1',
    },
    {
        name: 'Desenvolvedor 2',
        instagram: 'https://instagram.com/seu_instagram2',
        github: 'https://github.com/seu_github2',
    },
];

const Footer = () => (
    <footer className="bg-[#0f1f4b] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
                <h3 className="text-2xl font-bold mb-4">OrganizaBus</h3>
                <p className="text-sm opacity-80">
                    Sistema moderno para gestão de pagamentos no transporte universitário.
                </p>
            </div>
            <div>
                <h4 className="text-xl font-semibold mb-4 ">Desenvolvedores</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {developers.map((dev, idx) => (
                        <div key={idx}>
                            <p className="font-medium mb-2">{dev.name}</p>
                            <div className="flex gap-4 text-lg">
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
        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/70">
            © 2025 OrganizaBus — Todos os direitos reservados.
        </div>
    </footer>
);

export default Footer;
