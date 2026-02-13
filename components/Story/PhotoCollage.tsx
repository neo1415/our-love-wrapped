'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface PhotoCollageProps {
  photos: Array<{ 
    src: string; 
    alt: string;
    focalPoint?: 'top center' | 'center center' | 'top left' | 'top right';
    collageRole?: 'hero' | 'accent' | 'strip' | 'equal';
  }>;
  layout?: 'hero-feature' | 'polaroid-scatter' | 'intimate-duo' | 'masonry-burst' | 'cinematic-strip' | 'featured-strip';
  onComplete: () => void;
  isPlaying: boolean;
}

export default function PhotoCollage({ photos, layout = 'intimate-duo', onComplete, isPlaying }: PhotoCollageProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  console.log('=== PHOTO COLLAGE RENDER ===');
  console.log('Photos received:', photos);
  console.log('Layout:', layout);
  console.log('===========================');

  const handleImageError = (index: number) => {
    console.error(`❌ COLLAGE PHOTO ${index} FAILED TO LOAD: ${photos[index]?.src}`);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleImageLoad = (index: number) => {
    console.log(`✅ COLLAGE PHOTO ${index} LOADED SUCCESSFULLY: ${photos[index]?.src}`);
  };

  if (!photos || photos.length === 0) {
    console.error('❌ NO PHOTOS PROVIDED TO COLLAGE!');
    return (
      <div className="flex h-screen items-center justify-center overflow-hidden">
        <p className="text-cream">No photos to display</p>
      </div>
    );
  }

  // STYLE 1: HERO FEATURE - One big photo + small overlapping rotated photo
  if (layout === 'hero-feature' && photos.length >= 2) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="flex h-screen items-center justify-center overflow-hidden p-4 md:p-6"
      >
        <div className="relative w-full max-w-5xl">
          {/* Big hero photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl"
          >
            {imageErrors[0] ? (
              <div className="flex h-full w-full items-center justify-center bg-burgundy/20">
                <p className="text-sm text-cream/50">Photo unavailable</p>
              </div>
            ) : (
              <img
                src={photos[0].src}
                alt={photos[0].alt}
                onError={() => handleImageError(0)}
                onLoad={() => handleImageLoad(0)}
                className="h-full w-full object-cover"
                style={{
                  objectPosition: photos[0].focalPoint || 'top center',
                }}
              />
            )}
          </motion.div>

          {/* Small overlapping photo */}
          <motion.div
            initial={{ opacity: 0, rotate: 0, scale: 0.8 }}
            animate={{ opacity: 1, rotate: -3, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute bottom-4 right-4 md:bottom-8 md:right-8 h-32 w-24 md:h-48 md:w-36 overflow-hidden rounded-xl md:rounded-2xl shadow-2xl"
            style={{
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {imageErrors[1] ? (
              <div className="flex h-full w-full items-center justify-center bg-burgundy/20">
                <p className="text-xs text-cream/50">Photo unavailable</p>
              </div>
            ) : (
              <img
                src={photos[1].src}
                alt={photos[1].alt}
                onError={() => handleImageError(1)}
                onLoad={() => handleImageLoad(1)}
                className="h-full w-full object-cover"
                style={{
                  objectPosition: photos[1].focalPoint || 'top center',
                }}
              />
            )}
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // STYLE 2: POLAROID SCATTER - 3-4 photos scattered like Polaroids
  if (layout === 'polaroid-scatter') {
    const rotations = [-5, 3, -2, 4];
    const mobilePositions = [
      'top-2 left-2',
      'top-16 right-4',
      'bottom-16 left-4',
      'bottom-2 right-2',
    ];
    const desktopPositions = [
      'md:top-4 md:left-4',
      'md:top-12 md:right-8',
      'md:bottom-8 md:left-12',
      'md:bottom-4 md:right-4',
    ];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="flex h-screen items-center justify-center overflow-hidden p-4 md:p-6"
      >
        <div className="relative h-[70vh] md:h-[80vh] w-full max-w-4xl">
          {photos.slice(0, 4).map((photo, index) => (
            <motion.div
              key={`${photo.src}-${index}`}
              initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: rotations[index] 
              }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: 'spring',
                stiffness: 100,
              }}
              className={`absolute ${mobilePositions[index]} ${desktopPositions[index]} h-56 w-44 md:h-72 md:w-56 bg-cream p-2 md:p-3 shadow-2xl`}
              style={{
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              }}
            >
              <div className="relative h-full w-full overflow-hidden">
                {imageErrors[index] ? (
                  <div className="flex h-full w-full items-center justify-center bg-burgundy/20">
                    <p className="text-xs text-dark-bg/50">Photo unavailable</p>
                  </div>
                ) : (
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    onError={() => handleImageError(index)}
                    onLoad={() => handleImageLoad(index)}
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: photo.focalPoint || 'top center',
                    }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // STYLE 3: INTIMATE DUO - Two photos side by side
  if (layout === 'intimate-duo' && photos.length >= 2) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="flex h-screen items-center justify-center overflow-hidden p-4 md:p-6"
      >
        <div className="grid w-full max-w-5xl grid-cols-2 gap-2 md:gap-4">
          {photos.slice(0, 2).map((photo, index) => (
            <motion.div
              key={`${photo.src}-${index}`}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl"
              style={{
                aspectRatio: '3/4',
              }}
            >
              {imageErrors[index] ? (
                <div className="flex h-full w-full items-center justify-center bg-burgundy/20">
                  <p className="text-sm text-cream/50">Photo unavailable</p>
                </div>
              ) : (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  onError={() => handleImageError(index)}
                  onLoad={() => handleImageLoad(index)}
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: photo.focalPoint || 'top center',
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // STYLE 4: MASONRY BURST - Pinterest-style varying heights
  if (layout === 'masonry-burst') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="flex h-screen items-center justify-center overflow-hidden p-4 md:p-6"
      >
        <div 
          className="w-full max-w-5xl"
          style={{
            columnCount: 2,
            columnGap: '8px',
          }}
        >
          {photos.map((photo, index) => (
            <motion.div
              key={`${photo.src}-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="mb-2 overflow-hidden rounded-xl md:rounded-2xl shadow-xl"
              style={{
                breakInside: 'avoid',
              }}
            >
              {imageErrors[index] ? (
                <div className="flex h-64 w-full items-center justify-center bg-burgundy/20">
                  <p className="text-sm text-cream/50">Photo unavailable</p>
                </div>
              ) : (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  onError={() => handleImageError(index)}
                  onLoad={() => handleImageLoad(index)}
                  className="w-full"
                  style={{
                    height: 'auto',
                    objectFit: 'contain',
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // STYLE 5: CINEMATIC STRIP - 3 tall narrow photos like film frames
  if (layout === 'cinematic-strip' && photos.length >= 3) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="flex h-screen items-center justify-center overflow-hidden p-4 md:p-6"
      >
        <div className="grid w-full max-w-5xl grid-cols-3 gap-1">
          {photos.slice(0, 3).map((photo, index) => (
            <motion.div
              key={`${photo.src}-${index}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="relative overflow-hidden border border-rose-gold/30 shadow-2xl"
              style={{
                aspectRatio: '2/3',
              }}
            >
              {imageErrors[index] ? (
                <div className="flex h-full w-full items-center justify-center bg-burgundy/20">
                  <p className="text-xs text-cream/50">Photo unavailable</p>
                </div>
              ) : (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  onError={() => handleImageError(index)}
                  onLoad={() => handleImageLoad(index)}
                  className="h-full w-full object-cover"
                  style={{
                    objectPosition: photo.focalPoint || 'top center',
                  }}
                />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  // STYLE 6: FEATURED + STRIP - 1 hero photo + 3 thumbnails below
  if (layout === 'featured-strip' && photos.length >= 4) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className="flex h-screen items-center justify-center overflow-hidden p-4 md:p-6"
      >
        <div className="w-full max-w-5xl space-y-2 md:space-y-4">
          {/* Hero photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[50vh] md:h-[60vh] w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl"
          >
            {imageErrors[0] ? (
              <div className="flex h-full w-full items-center justify-center bg-burgundy/20">
                <p className="text-sm text-cream/50">Photo unavailable</p>
              </div>
            ) : (
              <img
                src={photos[0].src}
                alt={photos[0].alt}
                onError={() => handleImageError(0)}
                onLoad={() => handleImageLoad(0)}
                className="h-full w-full object-cover"
                style={{
                  objectPosition: photos[0].focalPoint || 'top center',
                }}
              />
            )}
          </motion.div>

          {/* Thumbnail strip */}
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {photos.slice(1, 4).map((photo, index) => (
              <motion.div
                key={`${photo.src}-${index + 1}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-xl"
                style={{
                  aspectRatio: '1/1',
                }}
              >
                {imageErrors[index + 1] ? (
                  <div className="flex h-full w-full items-center justify-center bg-burgundy/20">
                    <p className="text-xs text-cream/50">Photo unavailable</p>
                  </div>
                ) : (
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    onError={() => handleImageError(index + 1)}
                    onLoad={() => handleImageLoad(index + 1)}
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: photo.focalPoint || 'top center',
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // FALLBACK: Default to intimate duo for any unhandled cases
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="flex h-screen items-center justify-center overflow-hidden p-4 md:p-6"
    >
      <div className="grid w-full max-w-5xl grid-cols-2 gap-2 md:gap-4">
        {photos.slice(0, 2).map((photo, index) => (
          <motion.div
            key={`${photo.src}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="relative overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl"
            style={{
              aspectRatio: '3/4',
            }}
          >
            {imageErrors[index] ? (
              <div className="flex h-full w-full items-center justify-center bg-burgundy/20">
                <p className="text-sm text-cream/50">Photo unavailable</p>
              </div>
            ) : (
              <img
                src={photo.src}
                alt={photo.alt}
                onError={() => handleImageError(index)}
                onLoad={() => handleImageLoad(index)}
                className="h-full w-full object-cover"
                style={{
                  objectPosition: photo.focalPoint || 'top center',
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
