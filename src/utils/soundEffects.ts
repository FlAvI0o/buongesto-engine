/**
 * Sound Effects Manager for Fundraising Canvas
 * Adds audio feedback to make donations feel more rewarding
 */

type SoundEffect = 'click' | 'place' | 'purchase' | 'success' | 'hover';

const SOUND_CONFIG: Record<SoundEffect, { frequency: number; duration: number; volume: number }> = {
  hover: { frequency: 400, duration: 0.05, volume: 0.1 },
  click: { frequency: 600, duration: 0.1, volume: 0.15 },
  place: { frequency: 800, duration: 0.15, volume: 0.2 },
  purchase: { frequency: 1200, duration: 0.3, volume: 0.25 },
  success: { frequency: 1000, duration: 0.5, volume: 0.3 },
};

let audioContext: AudioContext | null = null;
let isMuted = false;

/**
 * Initialize audio context (required for web audio API)
 */
export const initAudioContext = (): void => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
};

/**
 * Play a sound effect
 */
export const playSound = (effect: SoundEffect): void => {
  if (isMuted || !audioContext) return;

  try {
    const config = SOUND_CONFIG[effect];
    const now = audioContext.currentTime;

    // Create oscillator
    const osc = audioContext.createOscillator();
    osc.frequency.value = config.frequency;
    osc.type = 'sine';

    // Create gain node for volume control
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(config.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + config.duration);

    // Connect and play
    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(now);
    osc.stop(now + config.duration);
  } catch (error) {
    console.debug('Sound effect failed:', error);
  }
};

/**
 * Play a success chord (3 notes)
 */
export const playSuccessChord = (): void => {
  if (isMuted || !audioContext) return;

  try {
    const now = audioContext.currentTime;
    const notes = [523, 659, 784]; // C, E, G
    const duration = 0.3;

    notes.forEach((frequency, index) => {
      const osc = audioContext!.createOscillator();
      osc.frequency.value = frequency;
      osc.type = 'sine';

      const gain = audioContext!.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      osc.connect(gain);
      gain.connect(audioContext!.destination);

      osc.start(now);
      osc.stop(now + duration);
    });
  } catch (error) {
    console.debug('Chord playback failed:', error);
  }
};

/**
 * Toggle sound on/off
 */
export const toggleSound = (): boolean => {
  isMuted = !isMuted;
  return !isMuted;
};

/**
 * Get current mute state
 */
export const getSoundState = (): boolean => !isMuted;

/**
 * Trigger haptic feedback (vibration)
 * Falls back gracefully on unsupported devices
 */
export const triggerHaptic = (pattern: 'tap' | 'light' | 'strong' = 'tap'): void => {
  if (!navigator.vibrate) return;

  const patterns: Record<string, number | number[]> = {
    tap: 10,
    light: [20, 10, 20],
    strong: [50, 30, 50],
  };

  try {
    navigator.vibrate(patterns[pattern]);
  } catch (error) {
    console.debug('Haptic feedback not available:', error);
  }
};

/**
 * Play a sound with optional haptics for maximum feedback
 */
export const playFeedback = (
  effect: SoundEffect,
  hapticPattern?: 'tap' | 'light' | 'strong'
): void => {
  playSound(effect);
  if (hapticPattern) {
    triggerHaptic(hapticPattern);
  }
};
