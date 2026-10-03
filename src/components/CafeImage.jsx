import { useState } from 'react';

export default function CafeImage({ src, alt, className = '', priority = false, ...rest }) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div {...rest} className={`grid place-items-center bg-cream-deep px-4 text-center text-sm text-stone ${className}`} role="img" aria-label={alt}>
        Photo unavailable
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      {...rest}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setFailed(true)}
    />
  );
}
