import React, { useState, useEffect } from 'react';
import HolographicButton from './HolographicButton';

interface SpeechRecognition {
  start(): void;
  stop(): void;
  abort(): void;
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: Array<Array<{ transcript: string; isFinal: boolean }>>;
}

interface SpeechRecognitionError {
  error: string;
}

interface VoiceCommandProps {
  onCommand?: (command: string) => void;
  className?: string;
  disabled?: boolean;
}

const VoiceCommand: React.FC<VoiceCommandProps> = ({
  onCommand,
  className = '',
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Helper function to check if speech recognition is supported
  const isSpeechRecognitionSupported = () => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  };

  // Helper function to get the speech recognition constructor
  const getSpeechRecognitionConstructor = () => {
    return (window.SpeechRecognition || window.webkitSpeechRecognition) as unknown as {
      new (): SpeechRecognition;
    };
  };

  // Helper function to safely create speech recognition instance
  const createSpeechRecognition = () => {
    if (!isSpeechRecognitionSupported()) return null;
    try {
      const SpeechRecognition = getSpeechRecognitionConstructor();
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      return recognitionInstance;
    } catch (error) {
      console.error('Error creating speech recognition:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!isSpeechRecognitionSupported()) {
      console.warn('Speech recognition is not supported in this browser');
      return;
    }

    const recognitionInstance = createSpeechRecognition();
    if (!recognitionInstance) return;

    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i][0];
        if (result.isFinal) {
          finalTranscript += result.transcript;
        }
      }
      setTranscript(finalTranscript);
    };

    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognitionInstance.onend = () => {
      if (transcript.trim()) {
        onCommand?.(transcript.trim());
        setTranscript('');
      }
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      recognitionInstance.abort();
    };
  }, [onCommand]);

  const startListening = () => {
    if (disabled || !recognition) return;

    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return (
    <div className={`cyberpunk-hologram p-6 ${className}`}>
      <div className="cyberpunk-text text-2xl mb-4">
        VOICE COMMAND
      </div>
      <div className="cyberpunk-text text-base mb-4">
        Speak commands to control the security system
      </div>

      {/* Voice Status Indicator */}
      <div className="flex items-center mb-4">
        <div
          className={`w-3 h-3 rounded-full mr-2 ${
            isListening ? 'bg-matrix-green' : 'bg-neutral'
          }`}
        ></div>
        <div className="cyberpunk-text text-sm">
          {isListening ? 'Listening...' : 'Ready'}
        </div>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="cyberpunk-terminal p-3 mb-4">
          <div className="cyberpunk-text text-xs text-matrix-green">
            {transcript}
          </div>
        </div>
      )}

      {/* Voice Command Button */}
      <HolographicButton
        onClick={isListening ? stopListening : startListening}
        disabled={disabled}
        className="w-full"
      >
        {isListening ? 'STOP LISTENING' : 'START LISTENING'}
      </HolographicButton>

      {/* Available Commands */}
      <div className="cyberpunk-text text-sm text-neutral mt-4">
        <div className="cyberpunk-text text-lg mb-2 font-bold">
          AVAILABLE COMMANDS
        </div>
        <div className="mb-1">
          <span className="cyberpunk-text text-blue-500 mr-2">🔍</span>
          "Show threat analysis"
        </div>
        <div className="mb-1">
          <span className="cyberpunk-text text-blue-500 mr-2">⚡</span>
          "Run quick scan"
        </div>
        <div className="mb-1">
          <span className="cyberpunk-text text-blue-500 mr-2">📊</span>
          "Show system status"
        </div>
        <div className="mb-1">
          <span className="cyberpunk-text text-blue-500 mr-2">🎮</span>
          "Start training"
        </div>
        <div>
          <span className="cyberpunk-text text-blue-500 mr-2">❓</span>
          "Help"
        </div>
      </div>

{/* Browser Support Warning */}
{!(('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window)) && (
  <div className="cyberpunk-text text-xs text-red-500 mt-4">
    ⚠️ Voice commands not supported in this browser
  </div>
)}
    </div>
  );
};

export default VoiceCommand;