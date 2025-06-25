// Global audio manager to prevent multiple audio playback
class AudioManager {
  private static instance: AudioManager;
  private currentAudio: HTMLAudioElement | null = null;
  private onPlayCallbacks: Set<(source: string) => void> = new Set();

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  setAudio(audio: HTMLAudioElement | null, source: string = 'unknown') {
    // Stop current audio if it exists
    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    this.currentAudio = audio;
    if (audio) {
      this.notifyPlaying(source);
    }
  }

  stopAll() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  addPlayCallback(callback: (source: string) => void) {
    this.onPlayCallbacks.add(callback);
  }

  removePlayCallback(callback: (source: string) => void) {
    this.onPlayCallbacks.delete(callback);
  }

  private notifyPlaying(source: string) {
    this.onPlayCallbacks.forEach(callback => callback(source));
  }
}

export const audioManager = AudioManager.getInstance(); 