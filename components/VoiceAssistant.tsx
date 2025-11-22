import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { parseVoiceCommand } from '../services/geminiService';

interface VoiceAssistantProps {
  onDataParsed: (type: 'job' | 'connection', data: any) => void;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onDataParsed }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  
  // Speech Recognition Setup
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      // Continuous allows listening until stopped manually
      recognitionRef.current.continuous = true; 
      // Interim allows seeing results as you speak
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
            finalTranscript += event.results[i][0].transcript;
        }
        // Normalize spaces
        finalTranscript = finalTranscript.replace(/\s+/g, ' ');
        setTranscript(finalTranscript);
        transcriptRef.current = finalTranscript;
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech error", event);
        // Don't stop strictly on error, unless not-allowed
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
           setIsRecording(false);
           setFeedback({ type: 'error', msg: 'Microphone access denied.' });
        }
      };
      
      recognitionRef.current.onend = () => {
        // Just ensure state is consistent
        setIsRecording(false);
      };
    }
  }, []);

  const toggleRecording = () => {
    setFeedback(null);
    if (isRecording) {
      // STOPPING
      recognitionRef.current?.stop();
      setIsRecording(false);
      
      // Process the full transcript
      if (transcriptRef.current.trim()) {
        handleProcessAI(transcriptRef.current);
      } else {
        setFeedback({ type: 'error', msg: 'No speech detected.' });
      }
    } else {
      // STARTING
      if (!recognitionRef.current) {
        setFeedback({ type: 'error', msg: 'Speech recognition not supported in this browser.' });
        return;
      }
      setTranscript('');
      transcriptRef.current = '';
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleProcessAI = async (text: string) => {
    setIsProcessing(true);
    const result = await parseVoiceCommand(text);
    setIsProcessing(false);

    if (result.type === 'unknown') {
      setFeedback({ type: 'error', msg: result.message || 'Could not understand context.' });
    } else {
      setFeedback({ type: 'success', msg: result.message || 'Processed successfully!' });
      // Determine which data object to pass back
      const data = result.type === 'job' ? result.jobData : result.connectionData;
      onDataParsed(result.type, data);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg mb-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Mic className="w-5 h-5" />
            AI Voice Assistant
          </h3>
          <p className="text-indigo-100 text-sm mt-1">
            Click mic to start. Speak freely about jobs or connections. Click again to save.
          </p>
        </div>
        
        <button
          onClick={toggleRecording}
          disabled={isProcessing}
          className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
              : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isRecording ? (
            <Square className="w-5 h-5 fill-current" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </button>
      </div>

      {(isRecording || transcript) && (
        <div className="mt-4 bg-black/20 p-3 rounded-lg text-sm italic border border-white/10 min-h-[60px]">
          "{transcript}"
          {isRecording && <span className="inline-block w-1.5 h-4 ml-1 bg-white/50 animate-pulse align-middle"></span>}
        </div>
      )}

      {feedback && (
        <div className={`mt-3 flex items-center gap-2 text-sm font-medium ${
          feedback.type === 'success' ? 'text-green-200' : 'text-red-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {feedback.msg}
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;