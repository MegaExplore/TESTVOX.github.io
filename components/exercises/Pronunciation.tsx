import React, { useState } from 'react';
import { Exercise } from '../../types';
import { startListening } from '../../services/speech';

interface Props {
  data: Exercise;
  onAnswer: (answer: string) => void;
}

export const Pronunciation: React.FC<Props> = ({ data, onAnswer }) => {
  const [status, setStatus] = useState('🎤 Tap to Record');
  const [isError, setIsError] = useState(false);

  const handleRecord = async () => {
    const lang = data.voiceLang || 'en-US';
    setStatus(`Recording (${lang})...`);
    setIsError(false);
    
    try {
        const res = await startListening(lang);
        onAnswer(res);
    } catch (e: any) {
        console.error('Mic Error:', e);
        const errMap: Record<string, string> = {
            'no-speech': 'No speech detected',
            'not-allowed': 'Mic access denied',
            'audio-capture': 'No mic found',
            'network': 'Network error',
            'not-supported': 'Not supported',
            'service-not-allowed': 'Service not allowed'
        };
        const msg = errMap[e] || (typeof e === 'string' ? e : 'Try Again');
        setStatus(`🎤 ${msg}`);
        setIsError(true);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-6 w-full text-left">Voice Articulation:</h3>
      
      <p className="text-4xl font-extrabold text-center my-10 text-primary">
        {data.question}
      </p>

      <button 
        onClick={handleRecord}
        className={`
            block w-full p-4 border rounded-xl text-base font-semibold cursor-pointer transition-all duration-150 text-center
            ${isError ? 'bg-error text-white border-error' : 'bg-vox-dark text-white border-slate-200 hover:opacity-90'}
        `}
      >
        {status}
      </button>
    </div>
  );
};