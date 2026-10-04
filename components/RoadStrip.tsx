"use client";

import React from "react";

export default function RoadStrip() {
  return (
    <div className="relative w-full h-full bg-[#181a1e] flex items-center overflow-hidden select-none">
      {/* Clean Subtle Top Edge Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-white/15" />

      {/* Minimalist Center Dashed Lane Divider */}
      <div className="w-full flex items-center justify-between gap-6 sm:gap-10 px-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={`dash-${i}`}
            className="h-[2px] sm:h-[3px] w-12 sm:w-16 rounded-full bg-white/25 shrink-0"
          />
        ))}
      </div>

      {/* Clean Subtle Bottom Edge Line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-white/15" />
    </div>
  );
}
