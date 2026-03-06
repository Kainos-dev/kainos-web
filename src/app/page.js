'use client';
import { useRef, useEffect } from "react";
import gsap from "gsap";
import NavBar from "@/components/NavBar";

export default function Home() {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);

  useEffect(() => {
    if (lettersRef.current.length) {
      gsap.set(lettersRef.current, { opacity: 0 });

      const tl = gsap.timeline();

      lettersRef.current.forEach((letter) => {
        tl.to(letter, {
          opacity: 1,
          duration: 0.1,
        });
      });
    }
  }, []);

  const text = "KAINOS";

  return (
    <>
      <NavBar />
      <div
        ref={containerRef}
        className="flex min-h-screen items-center justify-center pt-20"
      >
        <div className="flex flex-col items-center">
          <h1 className="font-outfit-bold text-8xl text-black dark:text-white">
            {text.split("").map((char, idx) => (
              <span
                key={idx}
                ref={(el) => (lettersRef.current[idx] = el)}
                className="inline-block"
              >
                {char}
              </span>
            ))}
          </h1>
          <span
            className="font-dm-sans-regular text-2xl text-gray-400 mt-4"
          >
            Despega con nosotros 🚀
          </span>
        </div>
      </div>

      <div className="h-[150vh]">

      </div>
    </>
  );
}
