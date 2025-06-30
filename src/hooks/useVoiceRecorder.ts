import { useState, useRef, useCallback, useEffect } from 'react';
import { navigationLogger } from '../utils/navigationLogger';

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
  onStartSpeaking?: () => void;
  onStopSpeaking?: () => void;
  onRecordingComplete: (blob: Blob) => Promise<void>;
  silenceThreshold?: number;
  minDecibels?: number;
}

export const useVoiceRecorder = ({
  onStartSpeaking,
  onStopSpeaking,
  onRecordingComplete,
  silenceThreshold = 1500,
  minDecibels = -45
}: UseVoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const chunks = useRef<Blob[]>([]);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const stream = useRef<MediaStream | null>(null);

  const handleSilence = useCallback(() => {
    if (isSpeaking) {
      setIsSpeaking(false);
      onStopSpeaking?.();
      navigationLogger.info('User stopped speaking');
    }
  }, [isSpeaking, onStopSpeaking]);

  const checkAudioLevel = useCallback(() => {
    if (!analyser.current) return;

    const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
    analyser.current.getByteFrequencyData(dataArray);

    // Calculate average volume level
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    const decibels = 20 * Math.log10(average / 255);

    if (decibels > minDecibels) {
      if (!isSpeaking) {
        setIsSpeaking(true);
        onStartSpeaking?.();
        navigationLogger.info('User started speaking');
      }
      if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      }
      silenceTimer.current = setTimeout(handleSilence, silenceThreshold);
    }
  }, [isSpeaking, minDecibels, silenceThreshold, handleSilence, onStartSpeaking]);

  const startRecording = useCallback(async () => {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up audio analysis
      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream.current);
      source.connect(analyser.current);
      analyser.current.fftSize = 2048;

      mediaRecorder.current = new MediaRecorder(stream.current);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        await onRecordingComplete(blob);
        chunks.current = [];
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      navigationLogger.info('Voice recording started');

      // Start monitoring audio levels
      const checkLevels = () => {
        if (isRecording) {
          checkAudioLevel();
          requestAnimationFrame(checkLevels);
        }
      };
      checkLevels();
    } catch (error) {
      navigationLogger.error('Failed to start recording', error);
    }
  }, [checkAudioLevel, isRecording, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      stream.current?.getTracks().forEach(track => track.stop());
      if (audioContext.current) {
        audioContext.current.close();
      }
      setIsRecording(false);
      setIsSpeaking(false);
      if (silenceTimer.current) {
        clearTimeout(silenceTimer.current);
      }
      navigationLogger.info('Voice recording stopped');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (mediaRecorder.current) {
        stopRecording();
      }
    };
  }, [stopRecording]);

  return {
    isRecording,
    isSpeaking,
    startRecording,
    stopRecording
  };
};