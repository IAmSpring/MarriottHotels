import { useState, useRef, useCallback } from 'react';

interface UseVoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  silenceTimeout?: number; // in milliseconds
}

export const useVoiceRecorder = ({
  onTranscriptionComplete,
  silenceTimeout = 4000, // 4 seconds default
}: UseVoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const silenceTimer = useRef<NodeJS.Timeout | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);

  const resetRecording = useCallback(() => {
    audioChunks.current = [];
    if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }
    analyser.current = null;
    mediaRecorder.current = null;
    setIsRecording(false);
    setIsTranscribing(false);
  }, []);

  const checkForSilence = useCallback(() => {
    if (!analyser.current) return;

    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average = dataArray.reduce((a, b) => a + b) / bufferLength;

    // If volume is below threshold (silence)
    if (average < 5) { // Adjust threshold as needed
      if (!silenceTimer.current) {
        silenceTimer.current = setTimeout(() => {
          stopRecording();
        }, silenceTimeout);
      }
    } else if (silenceTimer.current) {
      clearTimeout(silenceTimer.current);
      silenceTimer.current = null;
    }

    if (isRecording) {
      requestAnimationFrame(checkForSilence);
    }
  }, [isRecording, silenceTimeout]);

  const startRecording = useCallback(async () => {
    try {
      resetRecording();

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;

      // Set up audio analysis
      audioContext.current = new AudioContext();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);
      analyser.current.fftSize = 2048;

      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        
        try {
          // Create form data for the API request
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');

          // Send to our server endpoint (fixed path)
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Transcription error: ${response.status}`);
          }

          const data = await response.json();
          onTranscriptionComplete(data.text);
        } catch (error) {
          console.error('Transcription error:', error);
          onTranscriptionComplete(''); // Call with empty string on error
        } finally {
          resetRecording();
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      checkForSilence();
    } catch (error) {
      console.error('Failed to start recording:', error);
      resetRecording();
    }
  }, [checkForSilence, resetRecording, onTranscriptionComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      setIsTranscribing(true);
      mediaRecorder.current.stop();
    }
  }, []);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording,
  };
};