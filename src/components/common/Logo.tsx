import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  inverted?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = false,
  inverted = false
}) => {
  const markDimensions = {
    sm: { w: 26, h: 26 },
    md: { w: 34, h: 34 },
    lg: { w: 44, h: 44 }
  }[size];

  const textSize = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }[size];

  // Colors based on user's uploaded brand logo
  const capsuleColor = inverted ? '#74B9FF' : '#4DA3FF';
  const circleColor = inverted ? '#FFFFFF' : '#2342FF';
  const textColor = inverted ? 'text-white' : 'text-[#0F1115]';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="avani-brand-logo">
      {/* Exact Vector Replica of User's Uploaded Brand Logo */}
      <svg
        width={markDimensions.w}
        height={markDimensions.h}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-label="Avani logo"
      >
        {/* Sky-blue diagonal pill / capsule angled from bottom-left to top-right */}
        <line
          x1="36"
          y1="63"
          x2="54"
          y2="37"
          stroke={capsuleColor}
          strokeWidth="15"
          strokeLinecap="round"
        />
        {/* Vivid royal/cobalt blue accent circle */}
        <circle
          cx="65"
          cy="61.5"
          r="7.5"
          fill={circleColor}
        />
      </svg>

      <div className="flex flex-col leading-none">
        <span className={`font-display font-bold tracking-tight ${textSize} ${textColor}`}>
          Avani
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase font-medium tracking-wider text-[#5A6A80] mt-0.5">
            by Aeonium
          </span>
        )}
      </div>
    </div>
  );
};

