import { useState } from 'react';
import CafeImage from './CafeImage.jsx';
import Eyebrow from './Eyebrow.jsx';
import FadeUp from './FadeUp.jsx';
import Marquee from './Marquee.jsx';
import RevealImage from './RevealImage.jsx';
import RevealText from './RevealText.jsx';
import { resolveImage } from '../data/images.js';

const points = [
  { title: 'Locally Inspired', text: 'Dishes and drinks drawn from Kathmandu kitchens and the hills beyond.' },
  { title: 'Freshly Prepared', text: 'Momo dough, chiya, and coffee made in small batches through the day.' },
  { title: 'Warm Hospitality', text: 'A table that feels looked after, whether you stay for ten minutes or two hours.' },
];

export default function StorySection() {
  const [open, setOpen] = useState(false);

  return (
    <section id="story" className="section scroll-mt-24">
      <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <RevealImage className="rounded-[1.6rem]">
          <CafeImage
            src={resolveImage('mithaas-interior.jpg')}
            alt="A quiet corner of Mithaas Café with a wooden bench, plant, and brass cup"
            className="aspect-[4/5] w-full object-cover"
            data-cursor="image"
          />
        </RevealImage>
        <FadeUp delay={0.12}>
          <Eyebrow>Our Story</Eyebrow>
          <RevealText
            as="h2"
            className="display mt-4 text-4xl sm:text-5xl"
            lines={['A café created with warmth,', 'flavour, and a little bit of home.']}
          />
          <div className="mt-6 space-y-4 text-stone leading-relaxed">
            <p>
              Mithaas Café opened in Kathmandu in 2020 so Nepali hospitality and modern café culture could share the same room. The idea was simple: locally inspired food, coffee worth lingering over, and a comfortable place to sit.
            </p>
            <p>
              We cook with ingredients we know, pour chiya the way the valley drinks it, and keep the lights warm. Come in for a quick cup or stay long enough for the table to feel familiar.
            </p>
          </div>
          <ul className="mt-8 space-y-4">
            {points.map((point) => (
              <li key={point.title}>
                <p className="font-medium">{point.title}</p>
                <p className="text-sm text-stone">{point.text}</p>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-line mt-8" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            {open ? 'Close story' : 'Discover Our Story'}
          </button>
          {open && (
            <div className="mt-5 space-y-4 text-stone leading-relaxed">
              <p>
                The name Mithaas is about sweetness in the broadest sense: a good bite, a kind welcome, the feeling of being expected. Our first guests were neighbours. Many of them still take the same table.
              </p>
              <p>
                The kitchen leans on Newari khaja, Thakali sets, and the snacks people order without looking at the board. The coffee bar stays quiet and precise. Between them is the room we wanted all along — wooden, planted, and unhurried.
              </p>
            </div>
          )}
        </FadeUp>
      </div>
      <div className="mt-16">
        <Marquee />
      </div>
      <div className="shell mt-10">
        <div className="dhaka" />
        <blockquote className="mx-auto max-w-3xl py-12 text-center">
          <p className="display text-3xl italic sm:text-4xl">
            “Every cup is prepared with care, because the smallest moments are often the ones we remember.”
          </p>
          <footer className="mt-5 text-sm tracking-[0.18em] text-stone uppercase">The Mithaas kitchen</footer>
        </blockquote>
        <div className="dhaka" />
      </div>
    </section>
  );
}
