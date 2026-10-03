import { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import CustomCursor from '../components/CustomCursor.jsx';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import PageLoader from '../components/PageLoader.jsx';
import { IntroProvider } from '../context/IntroContext.jsx';

export default function SiteLayout() {
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <IntroProvider ready={ready}>
      <PageLoader onReady={onReady} />
      <CustomCursor />
      <div inert={ready ? undefined : true}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[110] focus:rounded-full focus:bg-paper focus:px-4 focus:py-2">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      </div>
    </IntroProvider>
  );
}
