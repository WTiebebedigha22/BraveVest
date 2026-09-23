import { useState } from 'react';
import './SmartImage.css';

/**
 * Image with:
 *  - native lazy loading (defers off-screen images)
 *  - async decoding (doesn't block rendering)
 *  - gradient placeholder while loading
 *  - graceful fallback on error
 */
export default function SmartImage({ src, alt, className = '', aspect = '4/3', eager = false }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className={'simg simg--placeholder ' + className} style={{ aspectRatio: aspect }} aria-label={alt} />
    );
  }

  return (
    <div className={'simg ' + className} style={{ aspectRatio: aspect }}>
      {!loaded && <div className="simg__placeholder" aria-hidden />}
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={'simg__img ' + (loaded ? 'is-loaded' : '')}
      />
    </div>
  );
}
