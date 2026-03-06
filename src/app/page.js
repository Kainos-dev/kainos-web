'use client';
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavBar from "@/components/NavBar";
import Preloader from "@/components/Preloader";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  const lettersRef = useRef([]);
  const taglineRef = useRef(null);
  const moonRef = useRef(null);
  const bgGlowRef = useRef(null);
  const sec1Ref = useRef(null);
  const sec2Ref = useRef(null);
  const sec3Ref = useRef(null);

  // Bloquea el scroll mientras el preloader está activo
  useEffect(() => {
    if (!preloaderDone) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [preloaderDone]);

  // La intro solo arranca cuando el preloader termina
  useEffect(() => {
    if (!preloaderDone) return;

    const ctx = gsap.context(() => {

      /* ══════════════════════════
         ENTRADA (sin scroll)
      ══════════════════════════ */
      gsap.set([sec1Ref.current, sec2Ref.current, sec3Ref.current], {
        opacity: 0,
      });

      const intro = gsap.timeline({ delay: 0.1 });

      // Hace visible la luna antes de animarla
      gsap.set(moonRef.current, { opacity: 1 });

      lettersRef.current.forEach((letter) => {
        intro.to(letter, { opacity: 1, duration: 0.07 });
      });

      intro.from(
        taglineRef.current,
        { opacity: 0, y: 8, duration: 0.5, ease: "power2.out" },
        "-=0.05"
      );

      intro.to(
        bgGlowRef.current,
        { opacity: 1, duration: 1.8, ease: "power2.out" },
        0.1
      );

      intro.from(
        moonRef.current,
        { y: "40vw", duration: 1.8, ease: "power3.out" },
        0.1
      );

      /* ══════════════════════════
         SCROLL — timeline única
         500vh de recorrido total
         dividido en 4 fases
      ══════════════════════════ */
      const main = gsap.timeline({
        scrollTrigger: {
          trigger: "#scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
        },
      });

      // ── FASE 1 (0 → 3): Eclipse
      // La luna crece y sube hasta eclipsar casi todo
      main
        .to(
          moonRef.current,
          {
            width: "145vw",
            height: "145vw",
            bottom: "-8vw",
            left: "50%",
            x: "-50%",
            duration: 3,
            ease: "power2.inOut",
          },
          0
        )
        .to(bgGlowRef.current, { opacity: 0.9, duration: 3 }, 0)
        .fromTo(
          [...lettersRef.current, taglineRef.current],
          { opacity: 1, y: 0 },
          { opacity: 0, y: 0, duration: 1.5, stagger: 0.025, ease: "power2.in" },
          0.4
        );

      // ── FASE 2 (3 → 6): Luna se retira hacia arriba — Sección 1
      main
        .to(
          moonRef.current,
          {
            bottom: "82vh",
            width: "28vw",
            height: "28vw",
            left: "50%",
            x: "-50%",
            duration: 3,
            ease: "power3.inOut",
          },
          3
        )
        .to(bgGlowRef.current, { opacity: 0.12, duration: 2 }, 3)
        .to(
          sec1Ref.current,
          { opacity: 1, y: 0, duration: 2, ease: "power2.out" },
          4
        );

      // ── FASE 3 (6.5 → 9.5): Luna va a la izquierda — Sección 2
      main
        .to(sec1Ref.current, { opacity: 0, duration: 1.2, ease: "power2.in" }, 6.5)
        .to(
          moonRef.current,
          {
            bottom: "6vh",
            width: "40vw",
            height: "40vw",
            left: "auto",
            right: "3vw",
            x: "0%",
            duration: 3,
            ease: "power2.inOut",
          },
          6.8
        )
        .to(
          sec2Ref.current,
          { opacity: 1, duration: 2, ease: "power2.out" },
          7.5
        );

      // ── FASE 4 (10 → 13): Luna se hunde — Sección 3
      main
        .to(sec2Ref.current, { opacity: 0, duration: 1.2, ease: "power2.in" }, 10)
        .to(
          moonRef.current,
          {
            bottom: "-65vw",
            opacity: 0,
            duration: 3,
            ease: "power3.inOut",
          },
          10.2
        )
        .to(bgGlowRef.current, { opacity: 0, duration: 2 }, 10.2)
        .to(
          sec3Ref.current,
          { opacity: 1, duration: 2.5, ease: "power2.out" },
          11
        );

      // Pulsación perpetua del glow (independiente del scroll)
      gsap.to(".moon-glow-ring", {
        scale: 1.06,
        opacity: 0.75,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    return () => ctx.revert();
  }, [preloaderDone]);

  const text = "KAINOS";

  return (
    <>
      {/* Preloader — se desmonta solo al terminar su animación */}
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}

      <NavBar />

      {/* 500vh — el ScrollTrigger necesita este recorrido */}
      <div id="scroll-container" style={{ height: "500vh", background: "#000" }}>

        {/* Todo lo visual está en sticky, se queda fijo mientras scrolleás */}
        <div
          className="sticky top-0 w-full overflow-hidden"
          style={{ height: "100vh", background: "#000" }}
        >

          {/* ── Glow ambiental de fondo ── */}
          <div
            ref={bgGlowRef}
            className="pointer-events-none absolute inset-0 opacity-0"
            style={{
              background: `radial-gradient(
                ellipse 100% 65% at 50% 100%,
                rgba(180, 50, 0, 0.30) 0%,
                rgba(100, 20, 0, 0.14) 45%,
                transparent 100%
              )`,
            }}
          />

          {/* ── Hero: KAINOS + tagline ── */}
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-start pt-40">
            <h1 className="font-outfit-bold text-8xl text-white tracking-widest select-none">
              {text.split("").map((char, idx) => (
                <span
                  key={idx}
                  ref={(el) => (lettersRef.current[idx] = el)}
                  className="inline-block"
                  style={{ opacity: 0 }}
                >
                  {char}
                </span>
              ))}
            </h1>
            <span
              ref={taglineRef}
              className="font-dm-sans-regular text-2xl text-gray-400 mt-4"
              style={{ opacity: 0 }}
            >
              Despega con nosotros 🚀
            </span>
          </div>

          {/* ── Sección 1: Manifiesto ── */}
          <div
            ref={sec1Ref}
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center"
            style={{ transform: "translateY(30px)" }}
          >
            <p
              className="text-white/10 text-xs tracking-[0.5em] uppercase mb-6"
              style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
            >
              Manifiesto
            </p>
            <h2
              className="text-center text-white leading-tight select-none"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontWeight: 700,
                fontSize: "clamp(3rem, 7.5vw, 6.5rem)",
                letterSpacing: "-0.025em",
                maxWidth: "14ch",
              }}
            >
              Lo nuevo{" "}
              <span style={{ color: "rgba(255, 100, 20, 0.92)" }}>
                siempre
              </span>{" "}
              gana.
            </h2>
            <p
              className="text-gray-500 mt-8 text-center"
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "clamp(0.9rem, 1.5vw, 1.15rem)",
                maxWidth: "42ch",
                lineHeight: 1.75,
              }}
            >
              Construimos productos digitales que no se parecen a nada anterior.
              Cada proyecto es un punto de partida, no una iteración.
            </p>
          </div>

          {/* ── Sección 2: Nosotros ── */}
          <div
            ref={sec2Ref}
            className="pointer-events-none absolute inset-0 z-10 flex items-center"
            style={{ paddingLeft: "6vw", paddingRight: "46vw" }}
          >
            <div>
              <p
                className="text-white/10 text-xs tracking-[0.5em] uppercase mb-5"
                style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
              >
                Nosotros
              </p>
              <h2
                className="text-white leading-tight select-none"
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
                  letterSpacing: "-0.025em",
                }}
              >
                Un equipo
                <br />
                <span style={{ color: "rgba(255, 100, 20, 0.88)" }}>
                  obsesionado
                </span>
                <br />
                con el detalle.
              </h2>
              <p
                className="text-gray-500 mt-6"
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  fontSize: "clamp(0.85rem, 1.3vw, 1.05rem)",
                  maxWidth: "36ch",
                  lineHeight: 1.8,
                }}
              >
                Diseño, ingeniería y estrategia trabajando como uno.
                Hacemos menos proyectos para que cada uno sea mejor.
              </p>
              <div className="mt-10 flex gap-12">
                {[["12+", "Proyectos"], ["4", "Años"], ["100%", "Remoto"]].map(
                  ([num, label]) => (
                    <div key={label}>
                      <p
                        style={{
                          fontFamily: "var(--font-outfit), sans-serif",
                          fontWeight: 700,
                          fontSize: "clamp(1.6rem, 3vw, 2.6rem)",
                          color: "rgba(255, 100, 20, 0.9)",
                        }}
                      >
                        {num}
                      </p>
                      <p
                        className="text-gray-600 text-xs mt-1 tracking-widest uppercase"
                        style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
                      >
                        {label}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ── Sección 3: CTA + Footer ── */}
          <div
            ref={sec3Ref}
            className="absolute inset-0 z-10 flex flex-col justify-between px-10 pt-24 pb-8"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
          >

            {/* ── Titular principal ── */}
            <div>
              <h2
                className="pointer-events-none text-white select-none"
                style={{
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(3.5rem, 9vw, 8rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                }}
              >
                LET&apos;S
                <span style={{ color: "rgba(255, 100, 20, 0.92)" }}> BUILD</span>
                <br />
                <span>SOMETHING REMARKABLE</span>
              </h2>
            </div>

            {/* ── Footer ── */}
            <div className="w-full flex flex-col gap-6">

              {/* Fila superior: CTA + nav columns */}
              <div className="flex items-start justify-between gap-8">

                {/* Start a project */}
                <div className="flex-shrink-0">
                  <a
                    href="mailto:hello@kainos.studio"
                    className="group flex items-center gap-3 text-white hover:text-orange-400 transition-colors duration-300"
                    style={{ fontSize: "clamp(0.85rem, 1.2vw, 1rem)", letterSpacing: "0.05em" }}
                  >
                    <span>Start a project</span>
                    <span
                      className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                      style={{ color: "rgba(255,100,20,0.7)" }}
                    >
                      →
                    </span>
                    {/* línea decorativa */}
                    <span
                      className="flex-1 hidden xl:block"
                      style={{
                        width: "8vw",
                        height: "1px",
                        background: "linear-gradient(90deg, rgba(255,100,20,0.3), transparent)",
                        marginLeft: "8px",
                      }}
                    />
                  </a>
                </div>

                {/* Columnas de nav */}
                <div className="flex gap-12 xl:gap-16">

                  {/* Columna 1 */}
                  <div className="flex flex-col gap-2">
                    <p className="text-white/20 text-xs tracking-widest uppercase mb-1">Explore</p>
                    {["Home", "Work", "About", "Contact"].map((item) => (
                      <a
                        key={item}
                        href="#"
                        className="text-gray-500 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {item}
                      </a>
                    ))}
                  </div>

                  {/* Columna 2 */}
                  <div className="flex flex-col gap-2">
                    <p className="text-white/20 text-xs tracking-widest uppercase mb-1">Services</p>
                    {["Web Design", "Development", "AI Integrations", "Strategy"].map((item) => (
                      <a
                        key={item}
                        href="#"
                        className="text-gray-500 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {item}
                      </a>
                    ))}
                  </div>

                  {/* Columna 3 */}
                  <div className="flex flex-col gap-2">
                    <p className="text-white/20 text-xs tracking-widest uppercase mb-1">Contact</p>
                    <a
                      href="mailto:hello@kainos.studio"
                      className="text-gray-500 hover:text-orange-400 transition-colors duration-200 text-sm"
                    >
                      hello@kainos.studio
                    </a>
                    <p className="text-gray-600 text-sm">Buenos Aires</p>
                    <p className="text-gray-600 text-sm">Remote worldwide</p>
                  </div>

                  {/* Columna 4 */}
                  <div className="flex flex-col gap-2">
                    <p className="text-white/20 text-xs tracking-widest uppercase mb-1">Social</p>
                    {["Instagram", "LinkedIn", "Behance", "GitHub"].map((item) => (
                      <a
                        key={item}
                        href="#"
                        className="text-gray-500 hover:text-white transition-colors duration-200 text-sm"
                      >
                        {item}
                      </a>
                    ))}
                  </div>

                </div>
              </div>

              {/* Divisor */}
              <div
                style={{
                  height: "1px",
                  background: "linear-gradient(90deg, rgba(255,100,20,0.15), rgba(255,255,255,0.06) 50%, transparent)",
                }}
              />

              {/* Fila inferior: copyright + legal */}
              <div className="flex items-center justify-between">
                <p className="text-gray-700 text-xs tracking-widest">
                  © 2026 Kainos —{" "}
                  <span className="text-gray-600">Design. Code. Intelligence.</span>
                </p>
                <div className="flex gap-6">
                  {["Privacy", "Terms"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-gray-700 hover:text-gray-400 transition-colors duration-200 text-xs tracking-widest"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ══════════════════════════
              LUNA
          ══════════════════════════ */}
          <div
            ref={moonRef}
            style={{
              position: "absolute",
              bottom: "-60vw",
              left: "50%",
              transform: "translateX(-50%)",
              width: "100vw",
              height: "100vw",
              maxWidth: "1500px",
              maxHeight: "1500px",
              zIndex: 6,
              opacity: 0,
            }}
          >
            {/* Glow naranja — capa pulsante */}
            <div
              className="moon-glow-ring absolute inset-0 rounded-full"
              style={{
                boxShadow: `
                  0   0   45px  14px rgba(255, 100,  20, 0.52),
                  0   0  100px  35px rgba(220,  60,   0, 0.32),
                  0   0  200px  75px rgba(160,  30,   0, 0.20),
                  0   0  380px 140px rgba(100,  15,   0, 0.11),
                  0   0  580px 220px rgba(  60,  5,   0, 0.06)
                `,
              }}
            />

            {/* Cuerpo oscuro */}
            <div
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{ background: "#06060E" }}
            >
              {/* Borde naranja conic */}
              <div
                className="absolute rounded-full"
                style={{
                  inset: "-3px",
                  background: `conic-gradient(
                    from 155deg,
                    transparent          0deg,
                    rgba(255, 75, 10, 0.65)  38deg,
                    rgba(255, 145, 20, 0.95) 100deg,
                    rgba(255, 75, 10, 0.65)  162deg,
                    transparent          205deg,
                    transparent          360deg
                  )`,
                  filter: "blur(2.5px)",
                  zIndex: 0,
                }}
              />

              {/* Relleno oscuro sobre el borde */}
              <div
                className="absolute rounded-full"
                style={{ inset: "2px", background: "#06060E", zIndex: 1 }}
              />

              {/* Cráteres / textura */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `
                    radial-gradient(circle at 28% 38%, rgba(30,15,5,0.42) 0%, transparent 16%),
                    radial-gradient(circle at 52% 58%, rgba(20,10,3,0.36) 0%, transparent 10%),
                    radial-gradient(circle at 18% 66%, rgba(25,12,4,0.30) 0%, transparent 8%),
                    radial-gradient(circle at 68% 28%, rgba(35,18,6,0.24) 0%, transparent 14%),
                    radial-gradient(circle at 42% 44%, rgba(10,5,2,0.14) 0%, transparent 50%)
                  `,
                  zIndex: 2,
                }}
              />
            </div>

            {/* Halo de bruma orbital */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                inset: "-32px",
                background: `radial-gradient(
                  ellipse at 42% 46%,
                  transparent 43%,
                  rgba(200, 60, 0, 0.065) 57%,
                  rgba(140, 30, 0, 0.035) 72%,
                  transparent 88%
                )`,
                animation: "hazeRotate 28s linear infinite",
                zIndex: 3,
              }}
            />
          </div>

        </div>{/* /sticky */}
      </div>{/* /scroll-container */}

      <style>{`
        @keyframes hazeRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}