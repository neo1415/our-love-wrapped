'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

interface TextSlideProps {
  lines: string[];
  onComplete: () => void;
  isPlaying: boolean;
  special?: 'overlay' | 'valentine';
  backgroundPhoto?: string;
  iceCreamCode?: string; // Ice cream delivery code
}

/**
 * Parse text markers:
 * - *text* for italic emphasis
 * - **text** for bold emphasis
 * - {{name}} for pet name styling
 */
function parseTextMarkers(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let currentIndex = 0;
  let key = 0;

  // Regex to match markers
  const markerRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|\{\{[^}]+\}\})/g;
  let match;

  while ((match = markerRegex.exec(text)) !== null) {
    // Add text before the marker
    if (match.index > currentIndex) {
      parts.push(
        <span key={key++}>{text.slice(currentIndex, match.index)}</span>
      );
    }

    const marker = match[0];

    // Bold: **text**
    if (marker.startsWith('**') && marker.endsWith('**')) {
      const content = marker.slice(2, -2);
      parts.push(
        <strong key={key++} className="font-bold text-rose-gold">
          {content}
        </strong>
      );
    }
    // Italic: *text*
    else if (marker.startsWith('*') && marker.endsWith('*')) {
      const content = marker.slice(1, -1);
      parts.push(
        <em key={key++} className="italic text-rose-gold">
          {content}
        </em>
      );
    }
    // Pet name: {{name}}
    else if (marker.startsWith('{{') && marker.endsWith('}}')) {
      const content = marker.slice(2, -2);
      parts.push(
        <span key={key++} className="font-semibold text-burgundy">
          {content}
        </span>
      );
    }

    currentIndex = match.index + marker.length;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(<span key={key++}>{text.slice(currentIndex)}</span>);
  }

  return parts;
}

export default function TextSlide({ lines, onComplete, isPlaying, special, backgroundPhoto, iceCreamCode }: TextSlideProps) {
  const [showYesResponse, setShowYesResponse] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [noClickAttempts, setNoClickAttempts] = useState(0);
  const [showNoMessage, setShowNoMessage] = useState(false);
  
  // Parse all lines for markers
  const parsedLines = useMemo(() => {
    return lines.map((line) => parseTextMarkers(line));
  }, [lines]);

  const handleYesClick = () => {
    setShowYesResponse(true);
  };

  const handleNoHover = () => {
    // Only run away if attempts < 9
    if (noClickAttempts < 9) {
      // Make the button run away!
      const randomX = (Math.random() - 0.5) * 200;
      const randomY = (Math.random() - 0.5) * 200;
      setNoButtonPosition({ x: randomX, y: randomY });
      setNoClickAttempts(prev => prev + 1);
      
      // After 9 attempts, show message and transform to Yes
      if (noClickAttempts === 8) {
        setTimeout(() => {
          setShowNoMessage(true);
        }, 500);
      }
    } else {
      // After 9 attempts, clicking No acts like Yes
      setShowYesResponse(true);
    }
  };

  const handleNoClick = () => {
    handleNoHover();
  };

  // Valentine style - falling hearts, pulsing heart, valentine message
  if (special === 'valentine' && backgroundPhoto) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background photo */}
        <img
          src={backgroundPhoto}
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter: 'brightness(0.4)',
            objectPosition: 'top center',
          }}
        />
        
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-dark-bg/40" />
        
        {/* Falling hearts animation */}
        {Array.from({ length: showYesResponse ? 50 : 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: -100, 
              x: `${Math.random() * 100}vw`,
              opacity: 0,
              rotate: Math.random() * 360,
            }}
            animate={{ 
              y: '110vh',
              opacity: [0, 1, 1, 0],
              rotate: Math.random() * 360 + 180,
            }}
            transition={{
              duration: showYesResponse ? 2 : 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="pointer-events-none absolute text-4xl"
          >
            ❤️
          </motion.div>
        ))}
        
        {/* Main content */}
        {!showYesResponse ? (
          <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-12">
            {/* I Love You text */}
            <motion.h1
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="font-heading text-8xl text-rose-gold md:text-9xl"
              style={{
                textShadow: '0 0 40px rgba(183, 110, 121, 0.6), 0 4px 20px rgba(0,0,0,0.8)',
                fontSize: 'clamp(4rem, 15vw, 10rem)',
              }}
            >
              {parsedLines[0] || 'I Love You'}
            </motion.h1>

            {/* Pulsing heart */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1,
                delay: 0.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="text-8xl md:text-9xl"
              style={{
                fontSize: 'clamp(4rem, 12vw, 8rem)',
              }}
            >
              ❤️
            </motion.div>

            {/* Will you be my Valentine message */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="font-body text-3xl text-cream md:text-4xl"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                fontSize: 'clamp(1.5rem, 5vw, 3rem)',
              }}
            >
              Will you be my Valentine?
            </motion.p>

            {/* Yes/No Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.6 }}
              className="flex gap-6 mt-4 relative"
            >
              <motion.button
                onClick={handleYesClick}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 bg-rose-gold text-dark-bg font-heading text-2xl rounded-full shadow-lg"
                style={{
                  fontSize: 'clamp(1.2rem, 4vw, 2rem)',
                }}
              >
                Yes! 💕
              </motion.button>
              
              <motion.button
                onClick={handleNoClick}
                onMouseEnter={noClickAttempts < 9 ? handleNoHover : undefined}
                onTouchStart={noClickAttempts < 9 ? handleNoHover : undefined}
                animate={{ 
                  x: noButtonPosition.x, 
                  y: noButtonPosition.y,
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 500, 
                  damping: 15 
                }}
                className={`px-12 py-4 font-heading text-2xl rounded-full shadow-lg cursor-pointer ${
                  noClickAttempts >= 9 
                    ? 'bg-rose-gold text-dark-bg' 
                    : 'bg-cream/20 text-cream'
                }`}
                style={{
                  fontSize: 'clamp(1.2rem, 4vw, 2rem)',
                }}
              >
                {noClickAttempts >= 9 ? 'Yes! 💕' : 'No'}
              </motion.button>
            </motion.div>

            {/* Funny message after 3 attempts */}
            {showNoMessage && (
              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-body text-xl text-rose-gold mt-6 text-center"
                style={{
                  textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                  fontSize: 'clamp(1rem, 3.5vw, 1.5rem)',
                }}
              >
                My baby seems to be lost 😢<br/>
                <span className="text-sm text-cream/80">There's only one answer here... 😏</span>
              </motion.p>
            )}
          </div>
        ) : (
          // Response after clicking Yes - Ice Cream Delivery Code
          <div className="relative z-10 flex flex-col items-center gap-8 px-6 py-12 max-w-2xl">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="text-8xl mb-4"
            >
              🍦
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-heading text-5xl text-rose-gold md:text-6xl text-center"
              style={{
                textShadow: '0 0 40px rgba(183, 110, 121, 0.6), 0 4px 20px rgba(0,0,0,0.8)',
                fontSize: 'clamp(2rem, 8vw, 4rem)',
              }}
            >
              A Sweet Surprise! 🎉
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="font-body text-2xl text-cream md:text-3xl text-center"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                fontSize: 'clamp(1.2rem, 4vw, 2rem)',
              }}
            >
              I've ordered ice cream for you! 🍨
            </motion.p>

            {/* Ice Cream Code Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="bg-cream/10 backdrop-blur-sm rounded-2xl p-8 border-2 border-rose-gold/50 shadow-2xl mt-4"
            >
              <p className="font-body text-lg text-cream/80 text-center mb-3">
                Your Order Code:
              </p>
              <div className="font-heading text-7xl text-rose-gold tracking-widest text-center"
                style={{
                  textShadow: '0 0 30px rgba(183, 110, 121, 0.8)',
                  fontSize: 'clamp(3rem, 12vw, 6rem)',
                  letterSpacing: '0.3em',
                }}
              >
                {iceCreamCode || '0000'}
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="font-body text-xl text-cream/90 md:text-2xl text-center mt-4"
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                fontSize: 'clamp(1rem, 3.5vw, 1.5rem)',
              }}
            >
              Use this code when it's delivered! 💕
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="font-body text-lg text-cream/70 text-center mt-2"
              style={{
                fontSize: 'clamp(0.9rem, 3vw, 1.2rem)',
              }}
            >
              Enjoy, my Valentine! ❤️
            </motion.p>
          </div>
        )}
      </div>
    );
  }

  // Special overlay style for Section 8 final slide
  if (special === 'overlay' && backgroundPhoto) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        {/* Background photo */}
        <img
          src={backgroundPhoto}
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            filter: 'brightness(0.4)',
            objectPosition: 'top center',
          }}
        />
        
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-dark-bg/40" />
        
        {/* Text overlay */}
        <div className="relative z-10 px-6 py-12 text-center">
          <div className="max-w-3xl">
            {parsedLines.map((parsedLine, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 1.2,
                  delay: index * 0.4,
                  ease: 'easeOut',
                }}
                className="mb-6 font-display text-5xl font-bold leading-tight text-cream drop-shadow-2xl md:text-7xl"
                style={{
                  textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)',
                }}
              >
                {parsedLine}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Regular text slide
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="flex min-h-screen items-center justify-center px-6 py-12"
    >
      <div className="max-w-3xl text-center">
        {parsedLines.map((parsedLine, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1,
              delay: index * 0.4, // Stagger by 400ms per line
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
            className="mb-6 font-body text-2xl leading-relaxed text-cream drop-shadow-lg md:text-4xl"
          >
            {parsedLine}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}
