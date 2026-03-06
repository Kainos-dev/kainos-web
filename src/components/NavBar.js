'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function NavBar() {
  const navRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // La nav desaparece cuando el scroll llega al 80% del recorrido total
      // (justo cuando empieza la Fase 4 — el footer)
      ScrollTrigger.create({
        trigger: '#scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: false,
        onUpdate: (self) => {
          // self.progress va de 0 a 1
          // La fase 4 arranca aprox en el 75% del scroll
          const threshold = 0.75;
          const isInFooter = self.progress >= threshold;

          gsap.to(navRef.current, {
            opacity: isInFooter ? 0 : 1,
            y: isInFooter ? -12 : 0,
            duration: 0.5,
            ease: 'power2.out',
            pointerEvents: isInFooter ? 'none' : 'auto',
            overwrite: true,
          });
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <nav ref={navRef} className="fixed top-0 w-full bg-opacity-95 z-50">
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
            className="text-white font-bold hover:text-gray-400 transition-colors"
          >
            Nosotros
          </Link>
          <Link
            href="/proyectos"
            className="text-white font-bold hover:text-gray-400 transition-colors"
          >
            Proyectos
          </Link>
        </div>
      </div>
    </nav>
  );
}