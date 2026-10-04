import { useHashScroll } from '../hooks/useUi.js';
import { useAsync } from '../hooks/useAsync.js';
import { fetchGallery, fetchMenu, fetchTestimonials } from '../services/api.js';
import menuSnapshot from '../data/menuSnapshot.json';
import ContactSection from '../components/ContactSection.jsx';
import Gallery from '../components/Gallery.jsx';
import Hero from '../components/Hero.jsx';
import MenuSection from '../components/MenuSection.jsx';
import ReservationForm from '../components/ReservationForm.jsx';
import SignatureSection from '../components/SignatureSection.jsx';
import StorySection from '../components/StorySection.jsx';
import Testimonials from '../components/Testimonials.jsx';

export default function Home() {
  useHashScroll();
  const menu = useAsync(fetchMenu, menuSnapshot);
  const gallery = useAsync(fetchGallery);
  const quotes = useAsync(fetchTestimonials);

  return (
    <>
      <Hero />
      <StorySection />
      <MenuSection items={menu.data} loading={menu.loading} error={menu.error} onRetry={menu.reload} />
      <SignatureSection />
      <Gallery items={gallery.data} loading={gallery.loading} error={gallery.error} onRetry={gallery.reload} />
      <Testimonials items={quotes.data} loading={quotes.loading} error={quotes.error} onRetry={quotes.reload} />
      <ReservationForm />
      <ContactSection />
    </>
  );
}
