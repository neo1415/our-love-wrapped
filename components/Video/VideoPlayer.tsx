'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
  src: string;
  onComplete: () => void;
  onError?: () => void;
}

export default function VideoPlayer({ src, onComplete, onError }: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error(`Video load failed: ${src}`, e);
    setHasError(true);
    onError?.();
  };

  const handleRetry = () => {
    setIsRetrying(true);
    setHasError(false);
    
    // Force reload
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch((err) => {
        console.error('Video play failed:', err);
        setHasError(true);
        setIsRetrying(false);
      });
    }
    
    setTimeout(() => setIsRetrying(false), 1000);
  };

  const handleSkip = () => {
    onComplete();
  };

  if (hasError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mx-auto mb-4 h-16 w-16 text-burgundy"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          
          <h2 className="mb-2 font-title text-2xl text-cream">
            Video could not be loaded
          </h2>
          
          <p className="mb-6 font-body text-cream/70">
            Please check your connection and try again.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="rounded-full bg-burgundy px-6 py-3 font-ui text-cream transition-colors hover:bg-burgundy/80 disabled:opacity-50"
            >
              {isRetrying ? 'Retrying...' : 'Retry'}
            </button>
            
            <button
              onClick={handleSkip}
              className="rounded-full bg-cream/20 px-6 py-3 font-ui text-cream transition-colors hover:bg-cream/30"
            >
              Skip
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        playsInline
        controls
        className="h-full w-full object-contain"
        onEnded={onComplete}
        onError={handleError}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
