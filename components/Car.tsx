"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Car() {
  const [processedSrc, setProcessedSrc] = useState<string>("/car.png");
  const smokeRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Track velocity of the scroll globally to ONLY show smoke while moving
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // self.getVelocity() returns scroll velocity in pixels per second
        const vel = Math.abs(self.getVelocity());
        
        // When velocity is low (car stopped), opacity is 0. 
        // When velocity is high (car moving), opacity ramps up to 1.
        let targetOpacity = 0;
        if (vel > 300) {
          targetOpacity = 1;
        } else if (vel > 50) {
          targetOpacity = (vel - 50) / 250;
        }

        // Animate opacity smoothly to handle sudden stops (dissipating smoke)
        gsap.to(smokeRef.current, { 
          opacity: targetOpacity, 
          duration: 0.2, 
          ease: "power1.out",
          overwrite: "auto"
        });
      }
    });
  });

  // Client-side canvas check to cleanly remove white background of car.png if present
  useEffect(() => {
    const img = new window.Image();
    img.src = "/car.png";
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Check if top-left pixel is white/near-white
        const isWhiteBg = data[0] > 240 && data[1] > 240 && data[2] > 240;

        if (isWhiteBg) {
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // If background is white / light gray, make it transparent
            if (r > 242 && g > 242 && b > 242) {
              data[i + 3] = 0;
            } else if (r > 220 && g > 220 && b > 220) {
              const alphaRatio = (242 - Math.min(r, g, b)) / 22;
              data[i + 3] = Math.round(data[i + 3] * alphaRatio);
            }
          }
          ctx.putImageData(imgData, 0, 0);
          setProcessedSrc(canvas.toDataURL("image/png"));
        }
      } catch (e) {
        setProcessedSrc("/car.png");
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full select-none pointer-events-none flex items-center justify-center">
      {/* Natural Soft Road Shadow Under Car */}
      <div
        className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-[45%] rounded-[40px] pointer-events-none"
        style={{
          background: "rgba(0, 0, 0, 0.45)",
          filter: "blur(12px)",
          transform: "translateY(10px)",
        }}
      />

      {/* Sketchy Skid Mark / Smoke Trail Effect (Behind the car) */}
      <div 
        ref={smokeRef}
        style={{ opacity: 0 }} // Starts hidden
        className="absolute right-[70%] sm:right-[80%] bottom-[10%] sm:bottom-[15%] w-[150%] sm:w-[200%] h-[80px] sm:h-[100px] pointer-events-none z-0 overflow-visible"
      >
        <svg className="w-full h-full overflow-visible" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>
              {`
                @keyframes smoke-pulse-1 {
                  0% { opacity: 0.2; transform: scaleY(0.8) rotate(-1deg); }
                  50% { opacity: 0.5; transform: scaleY(1.1) rotate(-1.5deg); }
                  100% { opacity: 0.2; transform: scaleY(0.8) rotate(-1deg); }
                }
                @keyframes smoke-pulse-2 {
                  0% { opacity: 0.1; transform: scaleY(0.8) rotate(-3deg); }
                  50% { opacity: 0.3; transform: scaleY(1.3) rotate(-2deg); }
                  100% { opacity: 0.1; transform: scaleY(0.8) rotate(-3deg); }
                }
                .smoke-1 {
                  transform-origin: right center;
                  animation: smoke-pulse-1 1.2s infinite ease-in-out;
                }
                .smoke-2 {
                  transform-origin: right center;
                  animation: smoke-pulse-2 1.8s infinite ease-in-out;
                }
              `}
            </style>
            
            {/* SVG Filter to create a torn, scraped, and scattered texture */}
            <filter id="sketchy-skid" x="-20%" y="-20%" width="140%" height="140%">
              {/* High horizontal frequency, low vertical frequency makes streaks. Animate it to boil! */}
              <feTurbulence type="fractalNoise" baseFrequency="0.15 0.015" numOctaves="3" result="noise">
                <animate attributeName="baseFrequency" values="0.15 0.015; 0.1 0.03; 0.15 0.015" dur="1.5s" repeatCount="indefinite" />
              </feTurbulence>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G">
                <animate attributeName="scale" values="30;60;30" dur="1.5s" repeatCount="indefinite" />
              </feDisplacementMap>
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
            
            {/* Gradient to fade out the trail to the left */}
            <linearGradient id="fade-trail" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="rgba(40, 40, 40, 0.9)" />
              <stop offset="30%" stopColor="rgba(80, 80, 80, 0.6)" />
              <stop offset="70%" stopColor="rgba(140, 140, 140, 0.2)" />
              <stop offset="100%" stopColor="rgba(180, 180, 180, 0)" />
            </linearGradient>
          </defs>
          
          {/* Main skid mark (lower, darker, streaky) */}
          <rect className="smoke-1" x="0" y="60%" width="85%" height="15px" fill="url(#fade-trail)" filter="url(#sketchy-skid)" />
          
          {/* Secondary scattered smoke (higher, lighter) */}
          <rect className="smoke-2" x="15%" y="40%" width="75%" height="30px" fill="url(#fade-trail)" filter="url(#sketchy-skid)" />
        </svg>
      </div>

      {/* The Car Image from public/car.png */}
      <div className="relative z-10 w-full h-full flex items-center justify-center drop-shadow-[0_12px_22px_rgba(0,0,0,0.35)]">
        <img
          src={processedSrc}
          alt="Car"
          className="w-full h-full object-contain pointer-events-none select-none scale-[1.3] sm:scale-[1.4] md:scale-[1.5]"
          draggable={false}
        />
      </div>
    </div>
  );
}
