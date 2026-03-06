'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

export default function Preloader({ onComplete }) {
    const overlayRef = useRef(null);
    const logoRef = useRef(null);
    const glowRef = useRef(null);
    const lineTopRef = useRef(null);
    const lineBottomRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    // Desmonta el componente y avisa a Home
                    if (onComplete) onComplete();
                },
            });

            /* ── 1. Estado inicial ── */
            gsap.set(overlayRef.current, { scale: 1, opacity: 1 });
            gsap.set(logoRef.current, { opacity: 0, scale: 0.85 });
            gsap.set(glowRef.current, { opacity: 0, scale: 0.6 });
            gsap.set([lineTopRef.current, lineBottomRef.current], { scaleX: 0, opacity: 0 });

            /* ── 2. Logo entra ── */
            tl.to(logoRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'power3.out',
            }, 0.2);

            /* ── 3. Glow naranja aparece alrededor del logo ── */
            tl.to(glowRef.current, {
                opacity: 1,
                scale: 1,
                duration: 1,
                ease: 'power2.out',
            }, 0.4);

            /* ── 4. Líneas decorativas se expanden ── */
            tl.to([lineTopRef.current, lineBottomRef.current], {
                scaleX: 1,
                opacity: 1,
                duration: 0.7,
                ease: 'power2.inOut',
                stagger: 0.1,
            }, 0.7);

            /* ── 5. Hold — el logo respira una vez ── */
            tl.to(logoRef.current, {
                scale: 1.06,
                duration: 0.5,
                ease: 'sine.inOut',
                yoyo: true,
                repeat: 1,
            }, 1.4);

            /* ── 6. Líneas y glow se desvanecen antes de la salida ── */
            tl.to([lineTopRef.current, lineBottomRef.current, glowRef.current], {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
            }, 2.4);

            /* ── 7. Scale out + fade — el overlay explota y desaparece ── */
            tl.to(overlayRef.current, {
                scale: 1.15,
                opacity: 0,
                duration: 0.7,
                ease: 'power3.in',
            }, 2.6);

        });

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
            style={{ transformOrigin: 'center center' }}
        >
            {/* Glow ambiental alrededor del logo */}
            <div
                ref={glowRef}
                className="absolute"
                style={{
                    width: '280px',
                    height: '280px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,80,10,0.18) 0%, rgba(180,40,0,0.08) 50%, transparent 70%)',
                    filter: 'blur(20px)',
                }}
            />

            {/* Línea decorativa superior */}
            <div
                ref={lineTopRef}
                className="absolute"
                style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -80px)',
                    width: '120px',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,100,20,0.5), transparent)',
                    transformOrigin: 'center center',
                }}
            />

            {/* Logo K */}
            <div ref={logoRef} className="relative z-10">
                <Image
                    src="/logo_K_blanco.png"
                    alt="Kainos"
                    width={90}
                    height={90}
                    priority
                    style={{
                        filter: 'drop-shadow(0 0 20px rgba(255, 100, 20, 0.4))',
                    }}
                />
            </div>

            {/* Línea decorativa inferior */}
            <div
                ref={lineBottomRef}
                className="absolute"
                style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, 68px)',
                    width: '120px',
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, rgba(255,100,20,0.5), transparent)',
                    transformOrigin: 'center center',
                }}
            />
        </div>
    );
}