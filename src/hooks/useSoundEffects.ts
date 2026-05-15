import { useEffect } from 'react';
import {
  initAudioContext,
  playSound,
  playSuccessChord,
  playFeedback,
  toggleSound,
  getSoundState,
} from '@/utils/soundEffects';

/**
 * Hook for managing sound effects throughout the app
 */
export const useSoundEffects = () => {
  useEffect(() => {
    // Initialize audio context on first interaction
    const handleFirstInteraction = () => {
      initAudioContext();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  return {
    playSound,
    playSuccessChord,
    playFeedback,
    toggleSound,
    getSoundState,
  };
};
