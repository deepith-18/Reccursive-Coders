import React from 'react';

interface RecursiveCodersLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const RecursiveCodersLogo: React.FC<RecursiveCodersLogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-sm', tag: 'text-[10px]' },
    md: { icon: 'w-9 h-9', text: 'text-base', tag: 'text-[11px]' },
    lg: { icon: 'w-12 h-12', text: 'text-lg', tag: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-2xl', tag: 'text-sm' },
  };

  const { icon, text, tag } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Emblem: Circular with stylized recursive double-chevron */}
      <div
        className={`${icon} rounded-full bg-black border border-white/20 flex items-center justify-center p-1 shadow-lg shrink-0 transition-transform duration-300 hover:scale-105`}
        title="Recursive Coders"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle with break on the right */}
          <path
            d="M 66 24 A 38 38 0 1 0 66 76"
            stroke="white"
            strokeWidth="9"
            strokeLinecap="round"
          />
          {/* Main recursive inner chevron/spiral pointing left */}
          <path
            d="M 64 34 L 40 50 L 64 66"
            stroke="white"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner recursive nested loop */}
          <path
            d="M 52 42 L 44 50 L 52 58"
            stroke="#a78bfa"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Recursive core node */}
          <circle cx="50" cy="50" r="2.5" fill="#22d3ee" />
        </svg>
      </div>

      {/* Typography: Matching official branding */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-white">
            <span className={text}>Recursive Coders</span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold hidden sm:inline-block">
              Bengaluru
            </span>
          </div>
          {showTagline && (
            <span
              className={`${tag} text-zinc-400 italic font-serif tracking-normal`}
              style={{ fontFamily: "'Georgia', 'Cambria', serif" }}
            >
              &ldquo;Think Recursive, Code Progressive&rdquo;
            </span>
          )}
        </div>
      )}
    </div>
  );
};
