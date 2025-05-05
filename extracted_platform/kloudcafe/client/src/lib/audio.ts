import { Howl } from 'howler';

// Audio file paths
const AUDIO_PATHS = {
  welcomeMessage: '/audio/welcome-message.mp3',
};

// Cache for loaded audio files
const audioCache: Record<string, Howl> = {};

/**
 * Load an audio file and add it to the cache
 * @param key The key to store the audio under
 * @param path The path to the audio file
 * @returns A promise that resolves when the audio is loaded
 */
function loadAudio(key: string, path: string): Promise<Howl> {
  return new Promise((resolve, reject) => {
    const howl = new Howl({
      src: [path],
      preload: true,
      onload: () => {
        audioCache[key] = howl;
        resolve(howl);
      },
      onloaderror: (id, error) => {
        console.error(`Error loading audio ${path}:`, error);
        reject(error);
      },
    });
  });
}

/**
 * Load all audio files
 */
export async function loadAllAudio(): Promise<void> {
  try {
    await Promise.all([
      loadAudio('welcomeMessage', AUDIO_PATHS.welcomeMessage),
    ]);
    console.log('Audio loaded. Press \'M\' to toggle sound.');
  } catch (error) {
    console.error('Failed to load audio:', error);
  }
}

/**
 * Play an audio file by key
 * @param key The key of the audio to play
 * @param onEnd Callback to run when the audio ends
 * @returns The ID of the sound being played
 */
export function playAudio(key: string, onEnd?: () => void): number | undefined {
  const howl = audioCache[key];
  if (!howl) {
    console.warn(`Audio ${key} not found in cache`);
    return undefined;
  }

  const id = howl.play();
  
  if (onEnd) {
    howl.once('end', onEnd, id);
  }
  
  return id;
}

/**
 * Stop an audio file by key
 * @param key The key of the audio to stop
 */
export function stopAudio(key: string): void {
  const howl = audioCache[key];
  if (howl) {
    howl.stop();
  }
}

/**
 * Check if an audio file is playing
 * @param key The key of the audio to check
 */
export function isAudioPlaying(key: string): boolean {
  const howl = audioCache[key];
  return !!howl && howl.playing();
}

/**
 * Global mute state
 */
let muted = false;

/**
 * Toggle mute state for all audio
 */
export function toggleMute(): boolean {
  muted = !muted;
  Howler.mute(muted);
  return muted;
}

/**
 * Get the current mute state
 */
export function isMuted(): boolean {
  return muted;
}

/**
 * Play welcome message
 * @param onEnd Callback to run when the welcome message ends
 */
export function playWelcomeMessage(onEnd?: () => void): void {
  playAudio('welcomeMessage', onEnd);
}