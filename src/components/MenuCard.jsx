import CafeImage from './CafeImage.jsx';
import { resolveImage } from '../data/images.js';
import { formatNpr } from '../utils/format.js';

export default function MenuCard({ item, onView }) {
  return (
    <article data-cursor="hover" className="menu-card group overflow-hidden rounded-[1.4rem] border border-line bg-paper">
      <div className="overflow-hidden">
        <CafeImage
          src={resolveImage(item.image)}
          alt={item.name}
          className="card-zoom aspect-[4/3] w-full object-cover"
        />
      </div>
      <div className="p-5">
        <p className="text-xs tracking-[0.18em] text-coffee uppercase">{item.category}</p>
        <h3 className="display mt-2 text-3xl">{item.name}</h3>
        <p className="mt-2 min-h-12 text-sm leading-relaxed text-stone">{item.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="font-medium">{formatNpr(item.price)}</p>
          <button type="button" className="btn btn-line btn-small" onClick={() => onView(item)}>
            View <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </article>
  );
}
