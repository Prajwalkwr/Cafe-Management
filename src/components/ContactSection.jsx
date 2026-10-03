import { CAFE_CONTACT, CAFE_LOCATION, CAFE_SOCIAL, WEEKDAY_HOURS, WEEKEND_HOURS, mapEmbedUrl, mapLink } from '../../shared/site.js';
import Eyebrow from './Eyebrow.jsx';
import FadeUp from './FadeUp.jsx';

function SocialIcon({ name }) {
  if (name === 'Instagram') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="17" cy="7" r="0.8" fill="currentColor" />
      </svg>
    );
  }
  if (name === 'Facebook') {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.6l.4-3H13v-2c0-.6.4-1 1-1Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d="M14 7c.8 1.6 2.1 2.8 3.7 3.3v2.2c-1.3 0-2.5-.4-3.5-1v5.2c0 2.6-2 4.3-4.5 4.3S5.2 19.3 5.2 16.7 7.2 12.4 9.7 12.4c.3 0 .7 0 1 .1v2.4c-.3-.1-.6-.2-1-.2-1.2 0-2.2 1-2.2 2.4s1 2.4 2.2 2.4 2.2-1 2.2-2.4V4h2.1c.1 1.1.5 2.1 1 3Z" fill="currentColor" />
    </svg>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" className="section scroll-mt-24">
      <div className="shell grid gap-10 lg:grid-cols-2">
        <div>
          <Eyebrow>Visit</Eyebrow>
          <h2 className="display mt-3 text-4xl sm:text-5xl">Come and Say Hello</h2>
          <div className="mt-8 space-y-6">
            <FadeUp>
            <div>
              <h3 className="text-sm tracking-[0.16em] uppercase text-stone">Opening Hours</h3>
              <p className="mt-2">{WEEKDAY_HOURS.label}<br />{WEEKDAY_HOURS.display}</p>
              <p className="mt-2">{WEEKEND_HOURS.label}<br />{WEEKEND_HOURS.display}</p>
            </div>
            </FadeUp>
            <FadeUp delay={0.08}>
            <div>
              <h3 className="text-sm tracking-[0.16em] uppercase text-stone">Address</h3>
              <p className="mt-2">
                {CAFE_LOCATION.name}<br />
                {CAFE_LOCATION.street}<br />
                {CAFE_LOCATION.city}, {CAFE_LOCATION.country}
              </p>
            </div>
            </FadeUp>
            <FadeUp delay={0.16}>
            <div>
              <h3 className="text-sm tracking-[0.16em] uppercase text-stone">Contact</h3>
              <p className="mt-2">
                <a className="underline decoration-line underline-offset-4" href={`tel:${CAFE_CONTACT.phoneHref}`}>{CAFE_CONTACT.phone}</a>
              </p>
              <p className="mt-1">
                <a className="underline decoration-line underline-offset-4" href={`mailto:${CAFE_CONTACT.email}`}>{CAFE_CONTACT.email}</a>
              </p>
            </div>
            <ul className="mt-4 flex flex-wrap gap-3">
              {CAFE_SOCIAL.map((item) => (
                <li key={item.name}>
                  {item.url ? (
                    <a href={item.url} className="social-chip inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm" target="_blank" rel="noreferrer">
                      <SocialIcon name={item.name} />
                      {item.name}
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-sm text-stone">
                      <SocialIcon name={item.name} />
                      {item.handle}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            </FadeUp>
          </div>
        </div>
        <FadeUp delay={0.24} className="min-w-0">
          <div className="overflow-hidden rounded-[1.6rem] border border-line bg-paper">
            <iframe
              title={`Map showing ${CAFE_LOCATION.name} in ${CAFE_LOCATION.city}`}
              src={mapEmbedUrl()}
              className="h-80 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a href={mapLink()} className="mt-3 inline-block text-sm underline decoration-line underline-offset-4" target="_blank" rel="noreferrer">
            Open in Maps
          </a>
        </FadeUp>
      </div>
    </section>
  );
}
