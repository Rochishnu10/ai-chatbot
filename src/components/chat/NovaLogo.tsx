import * as React from 'react';

export function NovaLogo({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))' }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))' }} />
        </linearGradient>
      </defs>
      <path
        d="M12 2L9.5 9.5L2 12L9.5 14.5L12 22L14.5 14.5L22 12L14.5 9.5L12 2Z"
        stroke="url(#logoGradient)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M5 5L7 10"
        stroke="url(#logoGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
       <path
        d="M19 5L17 10"
        stroke="url(#logoGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
       <path
        d="M5 19L7 14"
        stroke="url(#logoGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
       <path
        d="M19 19L17 14"
        stroke="url(#logoGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
