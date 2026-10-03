import FadeUp from './FadeUp.jsx';

export default function Reveal({ children, className = '', delay = 0 }) {
  return (
    <FadeUp className={className} delay={delay}>
      {children}
    </FadeUp>
  );
}
