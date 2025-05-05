import React, { useEffect, useRef } from 'react';

/**
 * Component to generate and download a spoken audio file using Web Speech API
 * with a British accent
 */
interface VoiceGeneratorProps {
  text: string;
  outputFileName: string;
  onGenerated?: (audioUrl: string) => void;
  autoGenerate?: boolean;
}

const VoiceGenerator: React.FC<VoiceGeneratorProps> = ({
  text,
  outputFileName,
  onGenerated,
  autoGenerate = false,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const [audioUrl, setAudioUrl] = React.useState<string | null>(null);
  const [generating, setGenerating] = React.useState(false);

  const generateSpeech = () => {
    if (generating) return;
    setGenerating(true);

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice to British English
    const voices = window.speechSynthesis.getVoices();
    const britishVoice = voices.find(voice => 
      voice.lang.includes('en-GB') || 
      voice.name.includes('British') || 
      voice.name.includes('UK')
    );
    
    if (britishVoice) {
      utterance.voice = britishVoice;
    } else {
      console.warn('British voice not found, using default voice');
    }

    // Set voice parameters for a posh British accent
    utterance.pitch = 1.0;
    utterance.rate = 0.9;  // Slightly slower for clarity
    utterance.volume = 1.0;

    // Create a MediaRecorder to capture the audio
    const audioChunks: Blob[] = [];
    const audioContext = new AudioContext();
    const mediaStreamDestination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      if (audioRef.current) {
        audioRef.current.src = url;
      }
      if (downloadLinkRef.current) {
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = outputFileName;
      }
      setGenerating(false);
      
      if (onGenerated) {
        onGenerated(url);
      }
    };

    mediaRecorder.start();

    // Play the utterance
    window.speechSynthesis.speak(utterance);

    // Wait for speech to complete
    utterance.onend = () => {
      mediaRecorder.stop();
    };
  };

  useEffect(() => {
    // Load available voices
    const voicesLoaded = () => {
      window.speechSynthesis.removeEventListener('voiceschanged', voicesLoaded);
      if (autoGenerate) {
        generateSpeech();
      }
    };

    // Check if voices are already loaded
    if (window.speechSynthesis.getVoices().length > 0) {
      if (autoGenerate) {
        generateSpeech();
      }
    } else {
      window.speechSynthesis.addEventListener('voiceschanged', voicesLoaded);
    }

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', voicesLoaded);
    };
  }, [autoGenerate]);

  return (
    <div style={{ display: 'none' }}>
      <button onClick={generateSpeech} disabled={generating}>
        {generating ? 'Generating...' : 'Generate Speech'}
      </button>
      {audioUrl && (
        <>
          <audio ref={audioRef} controls />
          <a ref={downloadLinkRef}>Download Audio</a>
        </>
      )}
    </div>
  );
};

export default VoiceGenerator;