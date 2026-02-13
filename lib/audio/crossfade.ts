/**
 * Crossfade Utilities
 * Helper functions for audio crossfading
 */

/**
 * Calculate volume for fade out
 * @param progress - Progress from 0 to 1
 * @returns Volume from 1 to 0
 */
export function calculateFadeOutVolume(progress: number): number {
  return Math.max(0, 1 - progress);
}

/**
 * Calculate volume for fade in
 * @param progress - Progress from 0 to 1
 * @returns Volume from 0 to 1
 */
export function calculateFadeInVolume(progress: number): number {
  return Math.min(1, progress);
}

/**
 * Calculate crossfade progress based on elapsed time
 * @param elapsedMs - Elapsed time in milliseconds
 * @param durationMs - Total duration in milliseconds
 * @returns Progress from 0 to 1
 */
export function calculateCrossfadeProgress(elapsedMs: number, durationMs: number): number {
  return Math.min(1, Math.max(0, elapsedMs / durationMs));
}

/**
 * Apply easing to crossfade progress for smoother transitions
 * Uses ease-in-out cubic easing
 * @param progress - Linear progress from 0 to 1
 * @returns Eased progress from 0 to 1
 */
export function easeCrossfade(progress: number): number {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

/**
 * Crossfade configuration
 */
export const CROSSFADE_CONFIG = {
  DURATION_MS: 2000,
  STEP_INTERVAL_MS: 100,
  STEPS: 20,
} as const;
