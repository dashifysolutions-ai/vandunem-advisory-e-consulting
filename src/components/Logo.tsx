import React from "react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
}

export default function Logo({ className = "h-10", showText = true, textColor = "text-white" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Visual VA Circular Monogram Symbol */}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto aspect-square overflow-visible"
      >
        <defs>
          {/* Metallic Deep Blue Gradient for the circular background */}
          <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#0B132B" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.5" />
          </linearGradient>

          {/* Glowing tech-blue for the text/shapes */}
          <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* Drop shadow for visual depth */}
          <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Outer Ring */}
        <circle cx="50" cy="50" r="46" stroke="url(#textGrad)" strokeWidth="1" strokeOpacity="0.3" />

        {/* Background Circle */}
        <circle cx="50" cy="50" r="42" fill="url(#circleGrad)" stroke="url(#textGrad)" strokeWidth="1.5" />

        {/* Intertwined V and A Letters */}
        <g filter="url(#shadow)">
          {/* Left Wing of V */}
          <path
            d="M 28 32 L 45 74 L 52 74 L 38 32 Z"
            fill="url(#textGrad)"
          />
          {/* Right Wing of V / Left of A */}
          <path
            d="M 45 74 L 62 32 L 68 32 L 51 74 Z"
            fill="url(#textGrad)"
            opacity="0.85"
          />
          {/* Right Leg of A */}
          <path
            d="M 54 50 L 64 74 L 70 74 L 59 46 Z"
            fill="url(#textGrad)"
          />
          {/* Crossbar of A */}
          <path
            d="M 41 58 L 59 58 L 57 61 L 43 61 Z"
            fill="#FFFFFF"
          />
        </g>
      </svg>

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span className={`font-serif tracking-[0.25em] text-lg font-bold leading-none ${textColor}`}>
            VANDUNEM
          </span>
          <span className="text-[7px] tracking-[0.23em] text-blue-400 font-sans font-medium uppercase mt-1">
            Advisory & Consulting
          </span>
        </div>
      )}
    </div>
  );
}
