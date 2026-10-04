"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Car from "./Car";
import RoadStrip from "./RoadStrip";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const roadStripRef = useRef<HTMLDivElement>(null);
  const carWrapperRef = useRef<HTMLDivElement>(null);
  
  const c1Ref = useRef<HTMLDivElement>(null);
  const c2Ref = useRef<HTMLDivElement>(null);
  const c3Ref = useRef<HTMLDivElement>(null);
  const c4Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Initial states
    gsap.set([c1Ref.current, c2Ref.current, c3Ref.current, c4Ref.current], { opacity: 0, y: 30 });
    gsap.set(roadStripRef.current, { "--p": 0 });
    gsap.set(carWrapperRef.current, { left: "0%", x: "0%" });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5, // similar to Framer's spring damping
      }
    });

    // 1. Animate road strip --p from 0 to 1 over the whole timeline
    tl.to(roadStripRef.current, { "--p": 1, ease: "none", duration: 1 }, 0);

    // 2. Animate car wrapper from left to right
    tl.to(carWrapperRef.current, { left: "100%", x: "-10%", ease: "none", duration: 1 }, 0);

    // 3. Animate cards at exact offsets to match original staggered timings
    // Card 1: 58% (Lime Neon) [0.1 to 0.25]
    tl.to(c1Ref.current, { opacity: 1, y: 0, ease: "power1.out", duration: 0.15 }, 0.1);
    // Card 3: 23% (Sky Blue) [0.2 to 0.35]
    tl.to(c3Ref.current, { opacity: 1, y: 0, ease: "power1.out", duration: 0.15 }, 0.2);
    // Card 2: 27% (Dark Charcoal) [0.3 to 0.45]
    tl.to(c2Ref.current, { opacity: 1, y: 0, ease: "power1.out", duration: 0.15 }, 0.3);
    // Card 4: 40% (Vibrant Orange) [0.4 to 0.55]
    tl.to(c4Ref.current, { opacity: 1, y: 0, ease: "power1.out", duration: 0.15 }, 0.4);

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[220vh] bg-[#cfcfcf] text-black"
    >
      {/* Subtle Sketchy Filter for UI Cards */}
      <svg className="hidden">
        <defs>
          <filter id="sketchy-ui">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Sticky Viewport - Clean & Vertically Centered */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-[#cfcfcf]">

        {/* Main Center Stage Container */}
        <div className="w-full flex flex-col justify-center py-4">

          {/* ------------------------------------------------------ */}
          {/* TOP BENTO CARDS (Above the road strip)                 */}
          {/* ------------------------------------------------------ */}
          <div className="w-full px-4 sm:px-8 flex justify-end mb-4 sm:mb-8">
            <div className="flex flex-wrap items-center justify-end">
              {/* Card 1: 58% (Lime Neon) */}
              <div
                ref={c1Ref}
                style={{ filter: "url(#sketchy-ui)", opacity: 0, transform: "translateY(30px)" }}
                className="w-56 sm:w-72 md:w-80 p-5 sm:p-6 rounded-sm bg-[#d7fc44] shadow-sm mr-12 sm:mr-20 mb-4 -rotate-2 mt-6"
              >
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-black tracking-tight leading-none">
                  58%
                </div>
                <p className="text-sm sm:text-base font-bold text-black mt-3 leading-tight">
                  Increase in pick up point use
                </p>
              </div>

              {/* Card 2: 27% (Dark Charcoal) */}
              <div
                ref={c2Ref}
                style={{ filter: "url(#sketchy-ui)", opacity: 0, transform: "translateY(30px)" }}
                className="w-56 sm:w-72 md:w-80 p-5 sm:p-6 rounded-sm bg-[#26282c] text-white shadow-sm ml-2 mt-12 rotate-3"
              >
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none">
                  27%
                </div>
                <p className="text-sm sm:text-base font-medium text-neutral-300 mt-3 leading-tight">
                  Increase in pick up point use
                </p>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* MINIMALIST STRIP: ROAD + GREEN REVEAL + CAR             */}
          {/* ------------------------------------------------------ */}
          <div
            ref={roadStripRef}
            className="relative w-full h-36 sm:h-44 md:h-52 overflow-hidden select-none [--car-w:310px] sm:[--car-w:390px] md:[--car-w:470px]"
            style={{ "--p": 0 } as any}
          >
            {/* LAYER 1 (AHEAD OF CAR): Minimalist Dark Highway Road */}
            <div className="absolute inset-0 z-0">
              <RoadStrip />
            </div>

            {/* LAYER 2 (BEHIND CAR): Green "WELCOME ITZFIZZ" Strip Reveal */}
            <div
              className="absolute inset-0 z-10 bg-[#30d173] flex items-center overflow-hidden"
              style={{
                WebkitMaskImage: "linear-gradient(to left, transparent calc((1 - var(--p)) * 100% + (var(--p) * var(--car-w) * 0.1) - 30px), black calc((1 - var(--p)) * 100% + (var(--p) * var(--car-w) * 0.1) + 150px))",
                maskImage: "linear-gradient(to left, transparent calc((1 - var(--p)) * 100% + (var(--p) * var(--car-w) * 0.1) - 30px), black calc((1 - var(--p)) * 100% + (var(--p) * var(--car-w) * 0.1) + 150px))"
              }}
            >
              {/* Centered Large Bold Text: WELCOME ITZFIZZ */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tight sm:tracking-wider text-black text-center whitespace-nowrap">
                  WELCOME ITZFIZZ
                </h1>
              </div>
            </div>

            {/* LAYER 3: Car Driving from Left (0%) to Right End + 90% off-screen */}
            <div className="absolute inset-0 z-20 flex items-center pointer-events-none">
              <div ref={carWrapperRef} style={{ left: "0%", transform: "translateX(0%)" }} className="absolute flex items-center h-full w-[var(--car-w)]">
                <Car />
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------ */}
          {/* BOTTOM BENTO CARDS (Below the road strip)              */}
          {/* ------------------------------------------------------ */}
          <div className="w-full px-4 sm:px-8 flex justify-end mt-4 sm:mt-8">
            <div className="flex flex-wrap items-center justify-end">
              {/* Card 3: 23% (Sky Blue) */}
              <div
                ref={c3Ref}
                style={{ filter: "url(#sketchy-ui)", opacity: 0, transform: "translateY(30px)" }}
                className="w-56 sm:w-72 md:w-80 p-5 sm:p-6 rounded-sm bg-[#5ec4fc] shadow-sm mr-16 sm:mr-24 mb-8 -rotate-3 mt-2"
              >
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-black tracking-tight leading-none">
                  23%
                </div>
                <p className="text-sm sm:text-base font-bold text-black mt-3 leading-tight">
                  Decreased in customer phone calls
                </p>
              </div>

              {/* Card 4: 40% (Vibrant Orange) */}
              <div
                ref={c4Ref}
                style={{ filter: "url(#sketchy-ui)", opacity: 0, transform: "translateY(30px)" }}
                className="w-56 sm:w-72 md:w-80 p-5 sm:p-6 rounded-sm bg-[#f97316] shadow-sm mt-8 rotate-1"
              >
                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-black tracking-tight leading-none">
                  40%
                </div>
                <p className="text-sm sm:text-base font-bold text-black mt-3 leading-tight">
                  Decreased in customer phone calls
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
