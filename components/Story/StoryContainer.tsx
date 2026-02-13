'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStoryStore from '@/lib/state/storyStore';
import { loadContent } from '@/lib/content/contentLoader';
import { AudioManager } from '@/lib/audio/AudioManager';
import TextSlide from './TextSlide';
import PhotoSlide from './PhotoSlide';
import PhotoCollage from './PhotoCollage';
import VideoTransition from './VideoTransition';
import FinalScreen from './FinalScreen';
import FastSlideshow from './FastSlideshow';
import { useRouter } from 'next/navigation';

export default function StoryContainer() {
  const {
    currentSection,
    currentSlide,
    isPlaying,
    isMuted,
    currentTrack,
    nextSlide,
    previousSlide,
    togglePlayPause,
    goToSection,
    reset,
  } = useStoryStore();

  const router = useRouter();
  const content = useMemo(() => loadContent(), []);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioManagerRef = useRef<AudioManager | null>(null);
  const [showVideoTransition, setShowVideoTransition] = useState(false);
  const [hasTriggeredVideo, setHasTriggeredVideo] = useState(false);
  const [showFastSlideshow, setShowFastSlideshow] = useState(false);
  const [showILoveYou, setShowILoveYou] = useState(false);
  const [currentAudioTime, setCurrentAudioTime] = useState(0);

  // Collect all photos from all sections for the fast slideshow
  const allPhotos = useRef<string[]>([]);
  useEffect(() => {
    const photos: string[] = [];
    content.sections.forEach(section => {
      section.slides.forEach(slide => {
        if (slide.type === 'photo') {
          photos.push(slide.content);
        } else if (slide.type === 'collage' && slide.photos) {
          slide.photos.forEach(photo => photos.push(photo.src));
        }
      });
    });
    allPhotos.current = photos;
    console.log(`Collected ${photos.length} photos for fast slideshow`);
  }, []);

  // DEBUG: Track showILoveYou state changes
  useEffect(() => {
    console.log('🔄 showILoveYou STATE CHANGED TO:', showILoveYou);
    if (showILoveYou) {
      console.log('✅ I LOVE YOU IS NOW VISIBLE');
    } else {
      console.log('❌ I LOVE YOU IS NOW HIDDEN');
    }
  }, [showILoveYou]);

  // Initialize audio manager
  useEffect(() => {
    console.log('=== INITIALIZING AUDIO MANAGER ===');
    const trackUrls = content.audioTracks.map(track => track.path);
    console.log('Track URLs:', trackUrls);
    audioManagerRef.current = new AudioManager(trackUrls);

    // Set up cue point detection
    audioManagerRef.current.onTimeUpdate((time) => {
      setCurrentAudioTime(time);

      // DISABLED: Fast slideshow feature
      // Check if we're on song 3 (track index 2) and reached 1:53 (113 seconds)
      // if (currentTrack === 2 && !showFastSlideshow && !showILoveYou) {
      //   // Trigger fast slideshow at 1:53 (113 seconds)
      //   if (time >= 113 && time < 113.5) {
      //     console.log('Triggering fast slideshow at 1:53');
      //     setShowFastSlideshow(true);
      //   }
      // }

      // Show "I Love You" at 2:20 (140 seconds) - ONLY trigger once
      // UPDATED: Trigger directly without fast slideshow
      if (currentTrack === 2 && !showILoveYou) {
        if (time >= 140 && time < 140.5) {
          console.log('🎵 TIME 2:20 REACHED - TRIGGERING I LOVE YOU');
          console.log('Current state before trigger:', { showFastSlideshow, showILoveYou, currentTrack, time });
          setShowILoveYou(true);
          console.log('✅ I LOVE YOU STATE SET TO TRUE');
        }
      }
      
      // Keep I Love You visible - don't let anything hide it
      if (showILoveYou) {
        console.log('💖 I Love You is ACTIVE at time:', time);
      }
    });

    console.log('Audio manager initialized');
    console.log('==================================');

    return () => {
      audioManagerRef.current?.destroy();
    };
  }, []); // Only run once on mount

  // Handle audio track changes
  useEffect(() => {
    console.log('=== AUDIO TRACK CHANGE ===');
    console.log('Current Track:', currentTrack);
    if (audioManagerRef.current && currentTrack >= 0) {
      console.log('Playing track:', currentTrack);
      audioManagerRef.current.play(currentTrack);
    } else {
      console.log('NOT playing - audioManager:', !!audioManagerRef.current, 'currentTrack:', currentTrack);
    }
    console.log('=========================');
  }, [currentTrack]);

  // Handle mute state
  useEffect(() => {
    if (audioManagerRef.current) {
      audioManagerRef.current.setMute(isMuted);
    }
  }, [isMuted]);

  // Handle play/pause
  useEffect(() => {
    if (audioManagerRef.current) {
      if (isPlaying) {
        audioManagerRef.current.resume();
      } else {
        audioManagerRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Get current section and slide data
  const sectionData = content.sections[currentSection];
  const slideData = sectionData?.slides[currentSlide];

  // Touch/Swipe navigation handlers
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;

    // Only trigger if horizontal swipe is dominant (not vertical scroll)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      // Don't allow forward navigation when on valentine slide
      if (slideData?.special === 'valentine' && deltaX < 0) {
        console.log('🚫 Forward swipe blocked - valentine slide');
        return;
      }
      
      // Don't allow navigation when I Love You is showing
      if (showILoveYou) {
        console.log('🚫 Navigation blocked - I Love You is showing');
        return;
      }
      
      if (deltaX > 0) {
        // Swipe right - go to previous slide
        previousSlide();
      } else {
        // Swipe left - go to next slide
        nextSlide();
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't allow forward navigation when on valentine slide
      if (slideData?.special === 'valentine' && e.code === 'ArrowRight') {
        console.log('🚫 Forward navigation blocked - valentine slide');
        e.preventDefault();
        return;
      }
      
      // Don't allow navigation when I Love You is showing
      if (showILoveYou) {
        console.log('🚫 Keyboard navigation blocked - I Love You is showing');
        return;
      }
      
      // Spacebar for play/pause
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      }
      // Arrow keys for navigation
      else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      }
      else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        previousSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, nextSlide, previousSlide, showILoveYou, slideData]);

  // VERBOSE LOGGING
  console.log('=== STORY CONTAINER STATE ===');
  console.log('Current Section:', currentSection, sectionData?.title);
  console.log('Current Slide:', currentSlide);
  console.log('Slide Data:', slideData);
  console.log('Slide Type:', slideData?.type);
  console.log('Is Playing:', isPlaying);
  console.log('Current Track:', currentTrack);
  if (slideData?.type === 'collage') {
    console.log('COLLAGE PHOTOS:', slideData.photos);
    console.log('COLLAGE LAYOUT:', slideData.layout);
  }
  console.log('=============================');

  // Auto-play logic - DON'T auto-advance when showing I Love You or Fast Slideshow or on valentine slide
  useEffect(() => {
    console.log('=== AUTO-PLAY LOGIC ===');
    console.log('Is Playing:', isPlaying);
    console.log('Slide Data:', slideData);
    console.log('Slide Duration:', slideData?.duration);
    console.log('Slide Special:', slideData?.special);
    console.log('Show I Love You:', showILoveYou);
    console.log('Show Fast Slideshow:', showFastSlideshow);
    
    // Clear any existing timer
    if (autoPlayTimerRef.current) {
      console.log('Clearing existing timer');
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    // DON'T auto-advance if showing I Love You or Fast Slideshow
    if (showILoveYou || showFastSlideshow) {
      console.log('NOT setting timer - special screen active');
      return;
    }

    // DON'T auto-advance if we're on the valentine slide (special: 'valentine')
    if (slideData?.special === 'valentine') {
      console.log('NOT setting timer - valentine slide should stay visible');
      return;
    }

    // If playing and we have a slide, set timer to advance
    if (isPlaying && slideData) {
      console.log(`Setting timer for ${slideData.duration}ms`);
      autoPlayTimerRef.current = setTimeout(() => {
        console.log('Timer fired! Advancing to next slide...');
        nextSlide();
      }, slideData.duration);
    } else {
      console.log('NOT setting timer - isPlaying:', isPlaying, 'slideData:', !!slideData);
    }

    console.log('======================');

    // Cleanup on unmount or when dependencies change
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    };
  }, [isPlaying, currentSection, currentSlide, slideData, nextSlide, showILoveYou, showFastSlideshow]);

  // Handle slide completion (for manual triggering)
  const handleSlideComplete = () => {
    if (isPlaying) {
      nextSlide();
    }
  };

  // Handle fast slideshow completion
  const handleFastSlideshowComplete = () => {
    console.log('Fast slideshow completed');
    // Slideshow will automatically transition to "I Love You" at 2:20
  };

  // Handle "I Love You" message completion - DON'T hide it, just let music continue
  const handleILoveYouComplete = () => {
    console.log('I Love You message stays visible, music continues');
    // Message stays visible, music keeps playing
    // User can navigate using controls
  };

  // Handle video completion
  const handleVideoComplete = () => {
    setShowVideoTransition(false);
    audioManagerRef.current?.stop();
    goToSection(8); // Go to final screen
  };

  // Handle replay
  const handleReplay = () => {
    reset();
    setHasTriggeredVideo(false);
    setShowVideoTransition(false);
    setShowFastSlideshow(false);
    setShowILoveYou(false);
    audioManagerRef.current?.stop();
    router.push('/');
  };

  // Show final screen (section 8)
  // COMMENTED OUT - Valentine slide is the final slide now
  /*
  if (currentSection === 8) {
    return <FinalScreen onReplay={handleReplay} />;
  }
  */

  // Show "I Love You" message at 2:20
  console.log('=== CHECKING I LOVE YOU RENDER ===');
  console.log('showILoveYou:', showILoveYou);
  console.log('showFastSlideshow:', showFastSlideshow);
  console.log('currentSection:', currentSection);
  console.log('currentTrack:', currentTrack);
  console.log('isPlaying:', isPlaying);
  console.log('===================================');
  
  if (showILoveYou) {
    console.log('🎉 RENDERING I LOVE YOU MESSAGE - SHOULD STAY VISIBLE');
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark-bg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Falling hearts animation */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: -100, 
              x: Math.random() * window.innerWidth,
              opacity: 0,
              rotate: Math.random() * 360,
            }}
            animate={{ 
              y: window.innerHeight + 100,
              opacity: [0, 1, 1, 0],
              rotate: Math.random() * 360 + 180,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="pointer-events-none absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
            }}
          >
            ❤️
          </motion.div>
        ))}

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center gap-8">
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-heading text-7xl text-rose-gold md:text-8xl"
            style={{
              textShadow: '0 0 40px rgba(183, 110, 121, 0.6)',
            }}
          >
            I Love You
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
            className="text-6xl md:text-7xl"
          >
            ❤️
          </motion.div>

          {/* Valentine message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="font-body text-2xl text-cream md:text-3xl"
          >
            Happy Valentine, My Girlfriend
          </motion.p>
        </div>
      </motion.div>
    );
  }

  // DISABLED: Fast slideshow feature
  // Show fast slideshow at 1:53
  // if (showFastSlideshow) {
  //   return (
  //     <FastSlideshow
  //       photos={allPhotos.current}
  //       onComplete={handleFastSlideshowComplete}
  //       startTime={113}
  //       currentTime={currentAudioTime}
  //     />
  //   );
  // }

  // Show video transition
  if (showVideoTransition) {
    return (
      <VideoTransition
        videoSrc={content.video.path}
        audioSrc={content.video.audioPath}
        onComplete={handleVideoComplete}
        trigger={showVideoTransition}
      />
    );
  }

  if (!sectionData || !slideData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-bg">
        <p className="font-body text-xl text-cream">Loading...</p>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen bg-dark-bg"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Render current slide with proper keying for transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`section-${currentSection}-slide-${currentSlide}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="flex min-h-screen items-center justify-center"
        >
          {slideData.type === 'text' && (
            <TextSlide
              lines={slideData.parsedLines || []}
              onComplete={handleSlideComplete}
              isPlaying={isPlaying}
              special={slideData.special}
              backgroundPhoto={slideData.backgroundPhoto}
              iceCreamCode={content.config.iceCreamCode}
            />
          )}

          {slideData.type === 'photo' && (
            <PhotoSlide
              src={slideData.content}
              alt={slideData.altText || 'Love story photo'}
              onComplete={handleSlideComplete}
              onDoubleTap={(x, y) => {
                // Heart animation handled in PhotoSlide
              }}
              onLongPress={() => {
                // Full-screen handled in PhotoSlide
              }}
              isPlaying={isPlaying}
            />
          )}

          {slideData.type === 'collage' && slideData.photos && (
            <PhotoCollage
              photos={slideData.photos}
              layout={slideData.layout}
              onComplete={handleSlideComplete}
              isPlaying={isPlaying}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ARIA live region for slide changes */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        Section {currentSection + 1} of {content.sections.length}, 
        Slide {currentSlide + 1} of {sectionData.slides.length}
      </div>
    </div>
  );
}
