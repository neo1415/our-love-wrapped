'use client';

import StoryContainer from '@/components/Story/StoryContainer';
import ProgressBar from '@/components/Story/ProgressBar';
import PlayPauseButton from '@/components/Controls/PlayPauseButton';
import MuteButton from '@/components/Controls/MuteButton';
import NavigationButtons from '@/components/Controls/NavigationButtons';
import ChapterMenu from '@/components/Controls/ChapterMenu';
import FullScreenPhoto from '@/components/Effects/FullScreenPhoto';
import OrientationPrompt from '@/components/Effects/OrientationPrompt';
import BackgroundOverlay from '@/components/Effects/BackgroundOverlay';
import BackToHomeButton from '@/components/Controls/BackToHomeButton';
import { useEffect } from 'react';
import useStoryStore from '@/lib/state/storyStore';

export default function StoryPage() {
  const { reset, togglePlayPause, isPlaying } = useStoryStore();

  // Initialize story on mount
  useEffect(() => {
    console.log('=== STORY PAGE INITIALIZING ===');
    console.log('Is Playing before reset:', isPlaying);
    
    // Reset to beginning
    reset();
    
    console.log('Is Playing after reset:', isPlaying);
    
    // Start auto-play after a short delay to ensure reset completes
    setTimeout(() => {
      const currentState = useStoryStore.getState().isPlaying;
      console.log('Is Playing after timeout:', currentState);
      if (!currentState) {
        console.log('Starting autoplay...');
        togglePlayPause();
      }
    }, 100);
    
    console.log('==============================');
  }, []);

  return (
    <main className="relative min-h-screen bg-dark-bg">
      {/* Background overlay */}
      <BackgroundOverlay />
      
      {/* Back to home button */}
      <BackToHomeButton />
      
      {/* Story content */}
      <StoryContainer />
      
      {/* Navigation buttons (swipe and tap zones) */}
      <NavigationButtons />
      
      {/* Controls overlay */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 p-6">
        {/* Progress bar */}
        <div className="mb-4">
          <ProgressBar />
        </div>
        
        {/* Control buttons */}
        <div className="pointer-events-auto flex items-center justify-center gap-4">
          <PlayPauseButton />
          <MuteButton />
        </div>
      </div>
      
      {/* Chapter menu overlay */}
      <ChapterMenu />
      
      {/* Full-screen photo overlay */}
      <FullScreenPhoto />
      
      {/* Orientation prompt */}
      <OrientationPrompt />
    </main>
  );
}
