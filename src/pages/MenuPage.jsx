import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MenuSection from '../components/MenuSection.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { fetchMenu } from '../services/api.js';
import menuSnapshot from '../data/menuSnapshot.json';
import { MENU_CATEGORIES } from '../../shared/site.js';

export default function MenuPage() {
  const [params] = useSearchParams();
  const requested = params.get('category');
  const initialCategory = MENU_CATEGORIES.includes(requested) ? requested : 'All';
  const menu = useAsync(fetchMenu, menuSnapshot);

  useEffect(() => {
    document.title = 'Menu · Mithaas Café';
    return () => {
      document.title = 'Mithaas Café | Kathmandu';
    };
  }, []);

  return (
    <div className="pt-20">
      <MenuSection
        items={menu.data}
        loading={menu.loading}
        error={menu.error}
        onRetry={menu.reload}
        initialCategory={initialCategory}
      />
    </div>
  );
}
