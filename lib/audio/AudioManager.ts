import { Howl } from 'howler';

/**
 * Audio Manager
 * Manages audio playback with Howler.js, including crossfades and cue point detection
 */

type TimeUpdateCallback = (time: number) => void;

export class AudioManager {
  private tracks: Howl[] = [];
  private currentTrackIndex: number = -1;
  private fadeOutDuration: number = 2000;
  private fadeInDuration: number = 2000;
  private timeUpdateCallback: TimeUpdateCallback | null = null;
  private timeUpdateInterval: NodeJS.Timeout | null = null;
  private isMuted: boolean = false;

  /**
   * Initialize the AudioManager with track URLs
   */
  constructor(trackUrls: string[]) {
    this.tracks = trackUrls.map((url) => {
      try {
        return new Howl({
          src: [url],
          html5: true, // Use HTML5 Audio for better mobile support
          preload: true,
          loop: true, // Loop tracks so they don't stop if section is long
          onloaderror: (id, error) => {
            console.error(`Audio load failed for ${url}:`, error);
          },
          onplayerror: (id, error) => {
            console.error(`Audio play failed for ${url}:`, error);
          },
        });
      } catch (error) {
        console.error(`Failed to create Howl for ${url}:`, error);
        // Return a dummy Howl that does nothing
        return new Howl({ src: [''] });
      }
    });
  }

  /**
   * Play a track at the specified index
   * If a different track is playing, crossfade to the new track
   */
  play(trackIndex: number, startTime: number = 0): void {
    if (trackIndex < 0 || trackIndex >= this.tracks.length) {
      console.error(`Invalid track index: ${trackIndex}`);
      return;
    }

    try {
      // If same track is already playing, just ensure it's playing
      if (trackIndex === this.currentTrackIndex) {
        const currentTrack = this.tracks[this.currentTrackIndex];
        if (!currentTrack.playing()) {
          currentTrack.play();
        }
        // Ensure loop is enabled
        currentTrack.loop(true);
        this.startTimeUpdateLoop();
        return;
      }

      // If a different track is playing, crossfade
      if (this.currentTrackIndex >= 0 && this.currentTrackIndex !== trackIndex) {
        this.crossfade(this.currentTrackIndex, trackIndex, startTime);
      } else {
        // No track playing, just start the new one
        const track = this.tracks[trackIndex];
        track.loop(true); // Enable looping
        track.seek(startTime);
        track.volume(this.isMuted ? 0 : 1);
        track.play();
        this.currentTrackIndex = trackIndex;
        this.startTimeUpdateLoop();
      }
    } catch (error) {
      console.error(`Error playing track ${trackIndex}:`, error);
    }
  }

  /**
   * Pause the current track
   */
  pause(): void {
    if (this.currentTrackIndex >= 0) {
      try {
        this.tracks[this.currentTrackIndex].pause();
        this.stopTimeUpdateLoop();
      } catch (error) {
        console.error('Error pausing track:', error);
      }
    }
  }

  /**
   * Resume the current track
   */
  resume(): void {
    if (this.currentTrackIndex >= 0) {
      try {
        this.tracks[this.currentTrackIndex].play();
        this.startTimeUpdateLoop();
      } catch (error) {
        console.error('Error resuming track:', error);
      }
    }
  }

  /**
   * Set mute state for all tracks
   */
  setMute(muted: boolean): void {
    this.isMuted = muted;
    this.tracks.forEach((track) => {
      try {
        track.mute(muted);
      } catch (error) {
        console.error('Error setting mute:', error);
      }
    });
  }

  /**
   * Get current playback time in seconds
   */
  getCurrentTime(): number {
    if (this.currentTrackIndex >= 0) {
      try {
        const seek = this.tracks[this.currentTrackIndex].seek();
        return typeof seek === 'number' ? seek : 0;
      } catch (error) {
        console.error('Error getting current time:', error);
        return 0;
      }
    }
    return 0;
  }

  /**
   * Set callback for time updates (for cue point detection)
   */
  onTimeUpdate(callback: TimeUpdateCallback): void {
    this.timeUpdateCallback = callback;
  }

  /**
   * Start the time update loop
   */
  private startTimeUpdateLoop(): void {
    // Clear any existing interval
    this.stopTimeUpdateLoop();

    // Check time every 100ms
    this.timeUpdateInterval = setInterval(() => {
      if (this.timeUpdateCallback && this.currentTrackIndex >= 0) {
        const currentTime = this.getCurrentTime();
        this.timeUpdateCallback(currentTime);
      }
    }, 100);
  }

  /**
   * Stop the time update loop
   */
  private stopTimeUpdateLoop(): void {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
  }

  /**
   * Crossfade from one track to another
   */
  private crossfade(fromIndex: number, toIndex: number, startTime: number = 0): void {
    const fromTrack = this.tracks[fromIndex];
    const toTrack = this.tracks[toIndex];

    try {
      // Enable looping on new track
      toTrack.loop(true);
      
      // Start new track at volume 0
      toTrack.volume(0);
      toTrack.seek(startTime);
      toTrack.play();

      // Crossfade over 2 seconds
      const steps = 20; // 100ms per step
      const volumeStep = 1 / steps;
      let currentStep = 0;

      const crossfadeInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;

        try {
          // Fade out old track
          fromTrack.volume(Math.max(0, (1 - progress) * (this.isMuted ? 0 : 1)));
          
          // Fade in new track
          toTrack.volume(Math.min(1, progress * (this.isMuted ? 0 : 1)));

          if (currentStep >= steps) {
            clearInterval(crossfadeInterval);
            fromTrack.stop();
            this.currentTrackIndex = toIndex;
          }
        } catch (error) {
          console.error('Error during crossfade:', error);
          clearInterval(crossfadeInterval);
        }
      }, 100);
    } catch (error) {
      console.error('Error starting crossfade:', error);
      // Fallback: just switch tracks
      fromTrack.stop();
      toTrack.loop(true);
      toTrack.volume(this.isMuted ? 0 : 1);
      toTrack.seek(startTime);
      toTrack.play();
      this.currentTrackIndex = toIndex;
    }
  }

  /**
   * Stop all tracks and clean up
   */
  stop(): void {
    this.stopTimeUpdateLoop();
    this.tracks.forEach((track) => {
      try {
        track.stop();
      } catch (error) {
        console.error('Error stopping track:', error);
      }
    });
    this.currentTrackIndex = -1;
  }

  /**
   * Unload all tracks and clean up resources
   */
  destroy(): void {
    this.stop();
    this.tracks.forEach((track) => {
      try {
        track.unload();
      } catch (error) {
        console.error('Error unloading track:', error);
      }
    });
    this.tracks = [];
  }
}
