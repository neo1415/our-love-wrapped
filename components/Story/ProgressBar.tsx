'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import useStoryStore from '@/lib/state/storyStore';
import { loadContent, calculateProgress } from '@/lib/content/contentLoader';

interface Chapter {
  section: number;
  title: string;
  position: number;
}

export default function ProgressBar() {
  const { currentSection, currentSlide, goToSection, setShowChapterMenu } = useStoryStore();
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const content = loadContent();

  // Calculate current progress
  const progress = calculateProgress(currentSection, currentSlide);

  // Build chapter list
  const chapters: Chapter[] = content.sections.map((section) => ({
    section: section.id,
    title: section.title,
    position: section.startPosition,
  }));

  // Handle tap to navigate
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isLongPress) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPosition = clickX / rect.width;

    // Find the section and slide for this position
    const totalSlides = content.sections.reduce((sum, s) => sum + s.slides.length, 0);
    const targetSlideIndex = Math.floor(clickPosition * totalSlides);

    let slideCount = 0;
    for (const section of content.sections) {
      if (slideCount + section.slides.length > targetSlideIndex) {
        const slideInSection = targetSlideIndex - slideCount;
        goToSection(section.id, slideInSection);
        break;
      }
      slideCount += section.slides.length;
    }
  };

  // Handle long press to show chapter menu
  const handleLongPressStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
      setShowChapterMenu(true);
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    setTimeout(() => setIsLongPress(false), 100);
  };

  return (
    <div className="relative w-full px-4">
      {/* Progress bar container */}
      <div
        className="relative h-2 cursor-pointer overflow-hidden rounded-full bg-cream/20"
        onClick={handleProgressBarClick}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
      >
        {/* Progress fill */}
        <motion.div
          className="absolute left-0 top-0 h-full bg-rose-gold"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />

        {/* Chapter markers - REMOVED */}
        {/* {chapters.map((chapter) => (
          <div
            key={chapter.section}
            className="absolute top-0 h-full w-0.5 bg-cream/50"
            style={{ left: `${chapter.position * 100}%` }}
          />
        ))} */}

        {/* Current position indicator */}
        <motion.div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-burgundy shadow-lg"
          style={{ left: `${progress * 100}%` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Chapter labels on hover - REMOVED */}
      {/* <div className="pointer-events-none absolute -top-8 left-0 right-0 flex justify-between px-4">
        {chapters.map((chapter) => (
          <div
            key={chapter.section}
            className="text-xs font-ui text-cream/50"
            style={{ position: 'absolute', left: `${chapter.position * 100}%` }}
          >
            {chapter.title}
          </div>
        ))}
      </div> */}
    </div>
  );
}
