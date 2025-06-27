import { useState, useRef, useCallback, useEffect } from 'react';

// Add these type declarations at the top of the file
declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionAlternative {
  0: SpeechRecognitionResult;
  length: number;
  isFinal?: boolean;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

abstract class SpeechRecognition {
  continuous!: boolean;
  interimResults!: boolean;
  onresult!: ((event: SpeechRecognitionEvent) => void) | null;
  onerror!: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend!: (() => void) | null;
  abstract start(): void;
  abstract stop(): void;
}

interface UseVoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  onTranscriptionUpdate?: (text: string) => void;
  onWakeWordDetected?: () => void;
  silenceTimeout?: number; // in milliseconds
  wakeWords?: string[]; // array of wake words to listen for
}

export const useVoiceRecorder = ({
  onTranscriptionComplete,
  onTranscriptionUpdate,
  onWakeWordDetected,
  silenceTimeout = 2000, // 2 seconds default
  wakeWords = ['hey bonvoy', 'hey marriott', 'hey concierge'], // default wake words
}: UseVoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isListeningForWakeWord, setIsListeningForWakeWord] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const isCleaningUp = useRef(false);
  const wakeWordRecognition = useRef<SpeechRecognition | null>(null);

  const cleanupResources = useCallback(() => {
    if (isCleaningUp.current) {
      console.log('[Voice Recorder] Already cleaning up, skipping');
      return;
    }
    isCleaningUp.current = true;

    console.log('[Voice Recorder] Cleaning up resources');

    // Clear silence timer
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }

    // Stop wake word recognition
    if (wakeWordRecognition.current) {
      wakeWordRecognition.current.stop();
      wakeWordRecognition.current = null;
    }

    // Stop media recorder
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      try {
        mediaRecorder.current.stop();
      } catch (error) {
        console.error('[Voice Recorder] Error stopping media recorder:', error);
      }
    }
    mediaRecorder.current = null;

    // Stop and cleanup media stream
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => {
        track.stop();
        console.log('[Voice Recorder] Stopped media track:', track.kind);
      });
      mediaStream.current = null;
    }

    // Close audio context
    if (audioContext.current) {
      audioContext.current.close().catch(error => {
        console.error('[Voice Recorder] Error closing audio context:', error);
      });
      audioContext.current = null;
    }

    analyser.current = null;
    audioChunks.current = [];
    setIsRecording(false);
    setIsTranscribing(false);
    setIsListeningForWakeWord(false);
    isCleaningUp.current = false;
  }, []);

  const resetRecording = useCallback(() => {
    console.log('[Voice Recorder] Resetting recording state');
    cleanupResources();
  }, [cleanupResources]);

  const checkForSilence = useCallback(() => {
    if (!analyser.current || !isRecording) return;

    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b) / bufferLength;

    // If volume is below threshold (silence)
    if (average < 5) { // Adjust threshold as needed
      if (!silenceTimer.current) {
        console.log('[Voice Recorder] Silence detected, starting timer');
        silenceTimer.current = setTimeout(() => {
          console.log('[Voice Recorder] Silence timeout reached, stopping recording');
          stopRecording();
        }, silenceTimeout);
      }
    } else if (silenceTimer.current) {
      console.log('[Voice Recorder] Sound detected, clearing silence timer');
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }

    if (isRecording) {
      requestAnimationFrame(checkForSilence);
    }
  }, [isRecording, silenceTimeout]);

  const startWakeWordDetection = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('[Voice Recorder] Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    wakeWordRecognition.current = new SpeechRecognition();
    
    if (wakeWordRecognition.current) {
      wakeWordRecognition.current.continuous = true;
      wakeWordRecognition.current.interimResults = true;

      wakeWordRecognition.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript.toLowerCase() + ' ';
        }

        // Check for wake words
        const wakeWordDetected = wakeWords.some(word => 
          transcript.includes(word.toLowerCase())
        );

        if (wakeWordDetected) {
          console.log('[Voice Recorder] Wake word detected:', transcript);
          wakeWordRecognition.current?.stop();
          onWakeWordDetected?.();
          startRecording();
        }
      };

      wakeWordRecognition.current.onerror = (event) => {
        console.error('[Voice Recorder] Wake word recognition error:', event.error);
        if (event.error === 'no-speech') {
          // Restart wake word detection
          wakeWordRecognition.current?.start();
        }
      };

      wakeWordRecognition.current.onend = () => {
        // Restart if we're still supposed to be listening for wake words
        if (isListeningForWakeWord && !isRecording) {
          wakeWordRecognition.current?.start();
        }
      };

      wakeWordRecognition.current.start();
      setIsListeningForWakeWord(true);
    }
  }, [wakeWords, onWakeWordDetected, isListeningForWakeWord, isRecording]);

  const startRecording = useCallback(async () => {
    try {
      console.log('[Voice Recorder] Starting recording...');
      resetRecording();

      // Check if the browser supports the required APIs
      if (!navigator.mediaDevices || !window.MediaRecorder) {
        throw new Error('Browser does not support audio recording');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 44100
        } 
      });
      console.log('[Voice Recorder] Got media stream:', stream.getAudioTracks()[0].label);
      mediaStream.current = stream;

      // Set up audio analysis
      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);
      analyser.current.fftSize = 2048;

      // Check for supported MIME types
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      console.log('[Voice Recorder] Using MIME type:', mimeType);

      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000
      });
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onerror = (event) => {
        console.error('[Voice Recorder] MediaRecorder error:', event);
        resetRecording();
      };

      mediaRecorder.current.onstop = async () => {
        console.log('[Voice Recorder] MediaRecorder stopped');
        if (audioChunks.current.length > 0) {
          setIsTranscribing(true);
          try {
            const audioBlob = new Blob(audioChunks.current, { type: mimeType });
            console.log('[Voice Recorder] Audio blob created:', { size: audioBlob.size, type: audioBlob.type });

            // Create form data
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');

            // Send to transcription endpoint
            const response = await fetch('http://localhost:3000/api/transcribe', {
              method: 'POST',
              body: formData
            });

            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.details || error.error || 'Transcription failed');
            }

            const { text } = await response.json();
            console.log('[Voice Recorder] Transcription received:', text);
            
            if (onTranscriptionUpdate) {
              onTranscriptionUpdate(text);
            }
            onTranscriptionComplete(text);
          } catch (error) {
            console.error('[Voice Recorder] Transcription error:', error);
          } finally {
            setIsTranscribing(false);
            audioChunks.current = [];
          }
        }
        cleanupResources();
        
        // After transcription is complete, restart wake word detection
        if (isListeningForWakeWord) {
          startWakeWordDetection();
        }
      };

      mediaRecorder.current.start(250); // Collect chunks every 250ms
      console.log('[Voice Recorder] MediaRecorder started');
      setIsRecording(true);
      checkForSilence();
    } catch (error) {
      console.error('[Voice Recorder] Failed to start recording:', error);
      resetRecording();
      // Re-throw the error if it's a permission error
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw error;
      }
    }
  }, [resetRecording, checkForSilence, onTranscriptionComplete, onTranscriptionUpdate, isListeningForWakeWord]);

  const stopRecording = useCallback(() => {
    console.log('[Voice Recorder] Stopping recording...');
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    } else {
      console.log('[Voice Recorder] No active recording to stop');
      resetRecording();
    }
  }, [resetRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetRecording();
    };
  }, [resetRecording]);

  return {
    isRecording,
    isTranscribing,
    isListeningForWakeWord,
    startRecording,
    stopRecording,
    startWakeWordDetection,
  };
};