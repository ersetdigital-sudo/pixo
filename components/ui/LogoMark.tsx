export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="pixoNavGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE9A8" />
          <stop offset=".5" stopColor="#FFC24B" />
          <stop offset="1" stopColor="#FF6A2C" />
        </linearGradient>
        <linearGradient id="pixoNavEdge" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#4C8DFF" />
          <stop offset="1" stopColor="#FFC24B" />
        </linearGradient>
      </defs>
      <path d="M20 2.5 34.6 11v18L20 37.5 5.4 29V11z" fill="#101a33" stroke="url(#pixoNavEdge)" strokeWidth="2" strokeLinejoin="round" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13 11h12l4 4v4l-4 4h-6.5v6H13V11zm5.5 4.5h5.1l1.1 1.1v1.3l-1.1 1.1h-5.1v-3.5z"
        fill="url(#pixoNavGold)"
      />
    </svg>
  );
}

export function LogoHex({ className = "h-56 w-56" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={`logo-float relative ${className}`} aria-label="Logo PIXOGAMEONLINE">
      <defs>
        <linearGradient id="pixoGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD97A" />
          <stop offset=".55" stopColor="#FFC24B" />
          <stop offset="1" stopColor="#FF6A2C" />
        </linearGradient>
        <linearGradient id="pixoEdge" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#4C8DFF" />
          <stop offset="1" stopColor="#FFC24B" />
        </linearGradient>
      </defs>
      <polygon points="100,10 178,55 178,145 100,190 22,145 22,55" fill="#101a33" stroke="url(#pixoEdge)" strokeWidth="3.5" strokeLinejoin="round" />
      <polygon points="100,28 162,64 162,136 100,172 38,136 38,64" fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.10)" strokeWidth="1.5" />
      <g transform="translate(20.2 24) scale(3.8)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13 11h12l4 4v4l-4 4h-6.5v6H13V11zm5.5 4.5h5.1l1.1 1.1v1.3l-1.1 1.1h-5.1v-3.5z"
          fill="url(#pixoGold)"
        />
        <path d="M13 11h12l4 4" fill="none" stroke="rgba(255,255,255,.45)" strokeWidth=".7" />
      </g>
      <path d="M62 152h18" stroke="#4C8DFF" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      <path d="M120 152h18" stroke="#FF6A2C" strokeWidth="3" strokeLinecap="round" opacity=".8" />
      <circle cx="100" cy="100" r="78" fill="none" stroke="rgba(76,141,255,.22)" strokeWidth="1.2" strokeDasharray="5 9" />
    </svg>
  );
}
