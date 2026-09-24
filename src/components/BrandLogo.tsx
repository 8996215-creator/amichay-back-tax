import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'color' | 'monochrome' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Precision Brand Logo:
 * - Symbol from the reference image by itself on top.
 * - Underneath it: "עושים החזר" ("עושים" in Navy Blue / White, "החזר" in Orange).
 */
export default function BrandLogo({
  className = '',
  variant = 'color',
  size = 'md',
}: BrandLogoProps) {
  const isDark = variant === 'monochrome';
  const isWhite = variant === 'white';

  const navyColor = isWhite ? '#FFFFFF' : isDark ? '#FFFFFF' : '#162446';
  const orangeColor = isWhite ? '#FFFFFF' : isDark ? '#FFA043' : '#FF5E00';
  const textColorNavy = isWhite ? 'text-white' : isDark ? 'text-white' : 'text-[#162446]';
  const textColorOrange = isWhite ? 'text-white' : isDark ? 'text-orange-400' : 'text-[#FF5E00]';

  // Mark dimensions according to size prop
  const markDimensions = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11 md:w-12 md:h-12',
    lg: 'w-14 h-14 md:w-16 md:h-16',
    xl: 'w-20 h-20',
  }[size];

  const textSizeClasses = {
    sm: 'text-[11px]',
    md: 'text-xs md:text-sm',
    lg: 'text-sm md:text-base',
    xl: 'text-lg md:text-xl',
  }[size];

  return (
    <div 
      className={`inline-flex flex-col items-center justify-center text-center select-none group-hover:scale-105 transition-transform duration-200 ${className}`}
      title="עושים החזר"
      aria-label="לוגו עושים החזר"
    >
      {/* 1. The Vector Picture / Symbol by itself on top */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`${markDimensions} shrink-0 drop-shadow-xs`}
      >
        {/* Deep Navy Blue Ayin Base */}
        <path
          d="M 0,16.5 
             C 0,7.4 7.4,0 16.5,0 
             L 16.5,0 
             L 16.5,67 
             C 16.5,70.5 19.5,73 23,73 
             L 37.5,73 
             C 41,73 44,70.5 44,67 
             L 44,40 
             C 44,35 48,31 52.5,31 
             C 57,31 60.5,35 60.5,40 
             L 60.5,83.5 
             C 60.5,92.6 53.1,100 44,100 
             L 16.5,100 
             C 7.4,100 0,92.6 0,83.5 
             Z"
          fill={navyColor}
        />

        {/* Vibrant Orange Ribbon & Growth Arrow */}
        <path
          d="M 22.5,18 
             C 22.5,14 26,11 30,11 
             L 44,0 
             L 60.5,0 
             L 100,25 
             L 82.5,25 
             L 82.5,91.5 
             C 82.5,96.2 78.7,100 74,100 
             C 69.3,100 66,96.2 66,91.5 
             L 66,25 
             L 45,25 
             L 38.5,34 
             L 38.5,67 
             C 38.5,71.5 35,75 30.5,75 
             C 26,75 22.5,71.5 22.5,67 
             Z"
          fill={orangeColor}
        />
      </svg>

      {/* 2. Directly Underneath: "עושים החזר" */}
      <div className={`mt-1 font-display font-black tracking-tight leading-none whitespace-nowrap ${textSizeClasses}`}>
        <span className={textColorNavy}>עושים </span>
        <span className={textColorOrange}>החזר</span>
      </div>
    </div>
  );
}
