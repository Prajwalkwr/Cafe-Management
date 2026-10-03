import { useLocation, useNavigate } from 'react-router-dom';
import { scrollToId } from '../utils/scroll.js';

export default function SectionLink({ id, className, children, onNavigate, ...rest }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <a
      href={`/#${id}`}
      className={className}
      {...rest}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        onNavigate?.();
        if (location.pathname !== '/') {
          navigate(`/#${id}`);
          return;
        }
        scrollToId(id);
      }}
    >
      {children}
    </a>
  );
}
