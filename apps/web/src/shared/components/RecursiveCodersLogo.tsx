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
      {/* Official Emblem: Exact authentic image from brand */}
      <img
        src="/recursive-coders-logo.png"
        alt="Recursive Coders"
        className={`${icon} rounded-full object-cover shrink-0 shadow-lg border border-white/20 transition-transform duration-300 hover:scale-105`}
        title="Recursive Coders"
      />

      {/* Typography: Matching official branding */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5 font-bold tracking-tight text-zinc-900 dark:text-white">
            <span className={text}>Recursive Coders</span>
            <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 font-semibold hidden sm:inline-block">
              Bengaluru
            </span>
          </div>
          {showTagline && (
            <span
              className={`${tag} text-zinc-600 dark:text-zinc-400 italic font-serif tracking-normal`}
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
