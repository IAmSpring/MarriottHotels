import { useState, useRef, useCallback } from 'react';

interface UseVoiceRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  silenceTimeout?: number;
}

export const useVoiceRecorder = ({
  onTranscriptionComplete,
  silenceTimeout = 4000 // 4 seconds default
}: UseVoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const silenceTimer = useRef<NodeJS.Timeout>();
  const audioContext = useRef<AudioContext>();
  const analyser = useRef<AnalyserNode>();
  const mediaStream = useRef<MediaStream>();

  const detectSilence = useCallback((stream: MediaStream) => {
    if (!audioContext.current) {
      audioContext.current = new AudioContext();
    }
    
    analyser.current = audioContext.current.createAnalyser();
    const source = audioContext.current.createMediaStreamSource(stream);
    source.connect(analyser.current);
    
    analyser.current.fftSize = 2048;
    const bufferLength = analyser.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const checkVolume = () => {
      if (!isRecording || !analyser.current) return;
      
      analyser.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / bufferLength;
      
      // If volume is below threshold (silence)
      if (average < 5) {
        if (!silenceTimer.current) {
          silenceTimer.current = setTimeout(() => {
            stopRecording();
          }, silenceTimeout);
        }
      } else {
        // Reset silence timer if sound is detected
        if (silenceTimer.current) {
          clearTimeout(silenceTimer.current);
          silenceTimer.current = undefined;
        }
      }
      
      // Continue checking if still recording
      if (isRecording) {
        requestAnimationFrame(checkVolume);
      }
    };
    
    checkVolume();
  }, [isRecording, silenceTimeout]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      
      mediaRecorder.current.start();
      setIsRecording(true);
      detectSilence(stream);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorder.current || mediaRecorder.current.state === 'inactive') return;

    return new Promise<void>((resolve) => {
      if (!mediaRecorder.current) return resolve();

      mediaRecorder.current.onstop = async () => {
        try {
          // Clean up
          if (silenceTimer.current) {
            clearTimeout(silenceTimer.current);
            silenceTimer.current = undefined;
          }
          
          if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
          }
          
          if (audioContext.current) {
            await audioContext.current.close();
            audioContext.current = undefined;
          }

          // Create audio blob and transcribe
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          
          // Create form data for OpenAI API
          const formData = new FormData();
          formData.append('file', audioBlob, 'audio.webm');
          formData.append('model', 'whisper-1');

          // Send to OpenAI for transcription
          const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${process.env.VITE_OPENAI_API_KEY}`
            },
            body: formData
          });

          const data = await response.json();
          onTranscriptionComplete(data.text);
          
          setIsRecording(false);
          resolve();
        } catch (error) {
          console.error('Error processing recording:', error);
          setIsRecording(false);
          resolve();
        }
      };

      mediaRecorder.current.stop();
    });
  };

  return {
    isRecording,
    startRecording,
    stopRecording
  };
}; 