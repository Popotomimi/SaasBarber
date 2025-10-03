"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaInstagram,
  FaTiktok,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaRegCopyright,
} from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#1a1a1a] text-white py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start divide-y md:divide-y-0 md:divide-x divide-gray-700">
        {/* Logo e nome */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4 px-4 py-6 md:py-0">
          <Image
            src="/img/logo.jpg"
            alt="Logo Artista do Corte"
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="text-lg font-semibold">Artista do Corte</span>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left px-4 py-6 md:py-0">
          <h3 className="text-md font-semibold mb-4">Barbearia nas redes</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-3">
              <FaInstagram className="text-pink-500 text-xl" />
              <Link
                href="https://www.instagram.com/artista_docorte/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                Instagram: @artista_docorte
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <FaTiktok className="text-black text-xl" />
              <Link
                href="https://www.tiktok.com/@artista_do_corte"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                TikTok: @artista_do_corte
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left px-4 py-6 md:py-0">
          <h3 className="text-md font-semibold mb-4">
            Desenvolvido por Roberto de Oliveira
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-3">
              <FaLinkedin className="text-blue-600 text-xl" />
              <Link
                href="https://www.linkedin.com/in/roberto-de-oliveira-35976621b/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                LinkedIn
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <FaGithub className="text-gray-300 text-xl" />
              <Link
                href="https://github.com/Popotomimi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                GitHub
              </Link>
            </li>
            <li className="flex items-center gap-3">
              <FaGlobe className="text-green-400 text-xl" />
              <Link
                href="https://popotomimi.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline">
                Portfólio
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left px-4 py-6 md:py-0">
          <p className="flex items-center gap-2 text-sm text-gray-400">
            <FaRegCopyright /> {year} Artista do Corte. Todos os direitos
            reservados.
          </p>
          <Link
            href="/termos-de-uso"
            className="underline hover:text-white transition text-sm text-gray-400 mt-2">
            Termos de uso
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
