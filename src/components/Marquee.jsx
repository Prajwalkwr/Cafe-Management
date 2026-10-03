const PHRASE = 'Good coffee. Warm conversations. A little taste of home.';

export default function Marquee() {
  const line = `${PHRASE}  ·  `;
  return (
    <div className="marquee border-y border-line py-4" aria-hidden="true">
      <div className="marquee-track font-serif text-2xl text-coffee italic sm:text-3xl">
        <span>{line.repeat(4)}</span>
        <span>{line.repeat(4)}</span>
      </div>
    </div>
  );
}
