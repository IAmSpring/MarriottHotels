import { navigationLogger } from './navigationLogger';

interface AudioChunk {
  text: string;
  audio: ArrayBuffer;
}

export class StreamingAudioService {
  private audioContext: AudioContext;
  private gainNode: GainNode;
  private currentSource: AudioBufferSourceNode | null = null;
  private volume: number = 1;
  private audioQueue: AudioChunk[] = [];
  private isPlaying: boolean = false;
  private onTextCallback: ((text: string) => void) | null = null;

  constructor() {
    this.audioContext = new AudioContext();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    navigationLogger.info('Audio context initialized');
  }

  public setVolume(value: number) {
    this.volume = value;
    this.gainNode.gain.setValueAtTime(value, this.audioContext.currentTime);
    navigationLogger.info('Audio volume updated');
  }

  public handleUserSpeakingStarted() {
    this.fadeOut(500);
  }

  public handleUserSpeakingEnded() {
    this.fadeIn(200);
  }

  public setOnTextCallback(callback: (text: string) => void) {
    this.onTextCallback = callback;
  }

  private async playAudioChunk(chunk: AudioChunk) {
    if (!this.audioContext) return;

    try {
      const audioBuffer = await this.audioContext.decodeAudioData(chunk.audio);
      const source = this.audioContext.createBufferSource();
      
      source.buffer = audioBuffer;
      source.connect(this.gainNode);

      if (this.onTextCallback) {
        this.onTextCallback(chunk.text);
      }

      return new Promise<void>((resolve) => {
        source.onended = () => {
          resolve();
        };
        source.start();
      });
    } catch (error) {
      navigationLogger.error('Failed to play audio chunk', error);
    }
  }

  public async streamResponse(stream: ReadableStream<Uint8Array>) {
    try {
      const reader = stream.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      const audioData = await this.audioContext.decodeAudioData(
        await new Blob(chunks).arrayBuffer()
      );

      this.playAudioBuffer(audioData);
    } catch (error) {
      navigationLogger.error('Stream playback error', error);
      throw error;
    }
  }

  private playAudioBuffer(buffer: AudioBuffer) {
    if (this.currentSource) {
      this.currentSource.stop();
    }

    this.currentSource = this.audioContext.createBufferSource();
    this.currentSource.buffer = buffer;
    this.currentSource.connect(this.gainNode);
    this.currentSource.start();
  }

  async playText(text: string) {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) throw new Error('TTS request failed');

      const audioData = await this.audioContext.decodeAudioData(
        await response.arrayBuffer()
      );

      this.playAudioBuffer(audioData);
    } catch (error) {
      navigationLogger.error('Text playback error', error);
      throw error;
    }
  }

  private fadeOut(duration: number) {
    const startVolume = this.volume;
    const startTime = this.audioContext.currentTime;
    this.gainNode.gain.setValueAtTime(startVolume, startTime);
    this.gainNode.gain.linearRampToValueAtTime(0, startTime + duration / 1000);
  }

  private fadeIn(duration: number) {
    const startTime = this.audioContext.currentTime;
    this.gainNode.gain.setValueAtTime(0, startTime);
    this.gainNode.gain.linearRampToValueAtTime(this.volume, startTime + duration / 1000);
  }

  private async playQueuedAudio() {
    if (this.isPlaying || this.audioQueue.length === 0) return;

    this.isPlaying = true;
    navigationLogger.info('Starting audio queue playback');

    try {
      while (this.audioQueue.length > 0) {
        const chunk = this.audioQueue.shift();
        if (chunk) {
          await this.playAudioChunk(chunk);
        }
      }
    } catch (error) {
      navigationLogger.error('Queue playback error', error);
    } finally {
      this.isPlaying = false;
    }
  }

  public stop() {
    this.pause();
    navigationLogger.info('Audio streaming stopped');
  }

  public pause() {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = null;
    }
  }

  public stopCurrentResponse() {
    if (this.currentSource) {
      const fadeOutDuration = 200;
      const startTime = this.audioContext.currentTime;
      this.gainNode.gain.setValueAtTime(this.volume, startTime);
      this.gainNode.gain.linearRampToValueAtTime(0, startTime + fadeOutDuration / 1000);
      
      setTimeout(() => {
        if (this.currentSource) {
          this.currentSource.stop();
          this.currentSource = null;
        }
        this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
      }, fadeOutDuration);
    }
  }
} 