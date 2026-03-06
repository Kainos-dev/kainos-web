'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function NavBar() {
  return (
    <nav className="fixed top-0 w-full bg-opacity-95 z-50">
        <div className="flex justify-between items-center h-30 px-30">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <Image
              src="/logo_K_blanco.png"
              alt="Kainos Logo"
              width={50}
              height={50}
            />
          </Link>

          {/* Links */}
          <div className="flex gap-8 items-center uppercase text-lg">
            <Link
              href="/nosotros"
              className="font-outfit text-black font-bold hover:text-gray-300 transition-colors"
            >
              Nosotros
            </Link>
            <Link
              href="/proyectos"
              className="font-outfit text-black font-bold hover:text-gray-300 transition-colors"
            >
              Proyectos
            </Link>
          </div>
      </div>
    </nav>
  );
}
