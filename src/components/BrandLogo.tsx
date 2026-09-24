import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'color' | 'monochrome' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Modern Standalone Geometric Brand Logo:
 * Recreated with high precision from the user's uploaded images.
 * Intertwining Navy Blue (#142247) Ayin shape and Vivid Orange (#FF5A00) Upward Growth Arrow.
 * Rendered purely as the logo mark without any text beside it.
 */
export default function BrandLogo({
  className = '',
  variant = 'color',
  size = 'md',
}: BrandLogoProps) {
  const isMonochrome = variant === 'monochrome';
  const isWhite = variant === 'white';

  const navyColor = isWhite ? '#FFFFFF' : isMonochrome ? '#CBD5E1' : '#142247';
  const orangeColor = isWhite ? '#FDBA74' : isMonochrome ? '#FFFFFF' : '#FF5A00';

  const sizeClasses = {
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-14 h-14',
    xl: 'w-16 h-16',
  }[size];

  return (
    <div 
      className={`inline-flex items-center justify-center select-none group-hover:scale-105 transition-transform duration-200 ${className}`}
      title="עושים החזר"
      aria-label="לוגו עושים החזר"
    >
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={sizeClasses}
      >
        {/* 1. Deep Navy Blue Ayin Base Bracket */}
        <path
          d="M 3,18 
             C 3,8 9.5,2 18,2 
             L 18,2 
             L 18,65 
             C 18,71 22.5,75.5 28.5,75.5 
             C 34.5,75.5 39,71 39,65 
             L 39,34 
             C 39,29 43.5,25 48.5,25 
             L 49.5,25 
             C 54.5,25 59,29 59,34 
             L 59,84 
             C 59,92.8 52,100 43,100 
             L 18,100 
             C 9,100 3,92.8 3,84 
             Z"
          fill={navyColor}
        />

        {/* 2. Energetic Orange Interlocking Path & Growth Arrow */}
        <path
          d="M 23,24 
             C 23,22 24.5,20.5 26.5,20.5 
             L 45,0 
             L 58,0 
             L 98,25 
             L 80,25 
             L 80,91.5 
             C 80,96.2 76.2,100 71.5,100 
             C 66.8,100 63,96.2 63,91.5 
             L 63,25 
             L 43.5,25 
             L 43.5,61 
             C 43.5,69 37.5,75 29.5,75 
             C 21.5,75 15.5,69 15.5,61 
             L 15.5,24 
             Z"
          fill={orangeColor}
        />
      </svg>
    </div>
  );
}
