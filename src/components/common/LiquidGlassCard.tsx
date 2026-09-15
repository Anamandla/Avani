import React from 'react';

interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'light' | 'dark' | 'hero';
  onClick?: () => void;
}

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className = '',
  id,
  variant = 'light',
  onClick
}) => {
  if (variant === 'dark') {
    return (
      <div
        id={id}
        onClick={onClick}
        className={`relative overflow-hidden rounded-3xl bg-[#0F1115]/90 backdrop-blur-xl border border-white/15 text-white shadow-[0_20px_45px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.25)] transition-all duration-300 ${className}`}
      >
        {/* Top edge light highlight bar */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
        {/* Subtle ambient light gradient from top-right */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[#2B3BF6]/20 blur-3xl pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div
        id={id}
        onClick={onClick}
        className={`relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-2xl border border-white/80 text-[#0F1115] shadow-[0_20px_50px_-15px_rgba(43,59,246,0.12),0_4px_16px_-4px_rgba(15,17,21,0.06),inset_0_1.5px_0_0_rgba(255,255,255,1)] transition-all duration-300 ${className}`}
      >
        {/* Specular top-edge refraction highlight */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-white/20 via-white to-white/20 pointer-events-none" />
        {/* Faint blue/cyan refractive aura behind glass */}
        <div className="absolute -top-20 -left-20 w-56 h-56 rounded-full bg-[#2B3BF6]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-[#00D8FF]/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-xl border border-white/70 text-[#0F1115] shadow-[0_12px_32px_-8px_rgba(15,17,21,0.08),inset_0_1px_0_0_rgba(255,255,255,0.95)] transition-all duration-300 ${className}`}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
