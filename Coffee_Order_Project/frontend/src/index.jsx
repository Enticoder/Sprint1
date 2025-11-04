import React, { useEffect, useState } from 'react';

// Lightweight image carousel sized to its parent. Designed to slot into the
// right panel of Auth without altering the overall UI.
export default function CoffeeCarousel({ images = DEFAULT_IMAGES, interval = 4000 }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {images.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt="Coffee variety"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 600ms ease',
            opacity: idx === current ? 1 : 0,
          }}
        />
      ))}
    </div>
  );
}

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1468352337715-fb17f42eb630?q=80&w=1200&auto=format&fit=crop', // espresso
  'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1200&auto=format&fit=crop', // latte art
  'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1200&auto=format&fit=crop', // cappuccino
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop', // flat white
  'https://images.unsplash.com/photo-1485206412256-701ddd4b18c7?q=80&w=1200&auto=format&fit=crop', // mocha
];
