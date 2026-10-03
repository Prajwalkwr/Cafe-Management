export default function Logo({ tone = 'dark' }) {
  const color = tone === 'light' ? '#F6F1E8' : '#1B1613';
  return (
    <span className="inline-flex items-center gap-2.5">
      <svg width="36" height="36" viewBox="0 0 36 36" aria-hidden="true">
        <circle cx="18" cy="18" r="16.5" fill="none" stroke={color} strokeWidth="1" />
        <path d="M7.5 24.5 L13.5 15 L18 20.5 L23 12.5 L28.5 24.5" fill="none" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M18 7.5c1.3 2.2 1.2 3.8 0 5.4-1.2-1.6-1.3-3.2 0-5.4Z" fill={color} />
      </svg>
      <span className="leading-none">
        <span className="block font-serif text-[1.45rem] tracking-tight" style={{ color }}>Mithaas</span>
        <span className="mt-1 block text-[0.62rem] tracking-[0.32em] uppercase" style={{ color }}>Café</span>
      </span>
    </span>
  );
}
