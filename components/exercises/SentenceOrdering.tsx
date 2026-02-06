import React, { useState, useEffect } from 'react';
import { Exercise } from '../../types';
import { speakText } from '../../services/speech';

interface Props {
  data: Exercise;
  onAnswer: (answer: string) => void;
}

export const SentenceOrdering: React.FC<Props> = ({ data, onAnswer }) => {
  const [pool, setPool] = useState<string[]>([]);
  const [currentSentence, setCurrentSentence] = useState<string[]>([]);
  
  useEffect(() => {
    if (data.words) {
      setPool([...data.words].sort(() => Math.random() - 0.5));
      setCurrentSentence([]);
    }
  }, [data.words]);

  const handlePoolClick = (word: string, indexInPool: number) => {
    const newPool = [...pool];
    // Remove from visibility in pool (we keep structure to maintain layout or just filter)
    // To match original logic: original just hides visibility.
    // Let's use an array of objects to track visibility.
    // Actually, simpler: toggle items between two arrays?
    // The original logic hid the button in the pool.
    
    // Let's stick to moving items.
    setCurrentSentence([...currentSentence, word]);
    
    // We need to know WHICH instance of the word in pool was clicked if duplicate words exist.
    // But for simplicity, let's remove the first matching word or use index.
    const newPoolList = [...pool];
    newPoolList.splice(indexInPool, 1);
    setPool(newPoolList);
  };

  const handleDropZoneClick = (word: string, indexInSentence: number) => {
    const newSentence = [...currentSentence];
    newSentence.splice(indexInSentence, 1);
    setCurrentSentence(newSentence);
    setPool([...pool, word]);
  };

  useEffect(() => {
     if (data.words && currentSentence.length === data.words.length && currentSentence.length > 0) {
         setTimeout(() => onAnswer(currentSentence.join(' ')), 600);
     }
  }, [currentSentence, data.words, onAnswer]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="m-0 text-xl font-semibold">Arrange in order:</h3>
        <button 
            className="bg-vox-dark text-white border-none rounded-full w-11 h-11 flex items-center justify-center cursor-pointer shadow-md hover:scale-110 hover:bg-primary transition-all duration-200 ml-3"
            title="Listen to sentence"
            onClick={() => speakText(data.answer || '', data.voiceLang || 'en-US')}
        >
             <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        </button>
      </div>

      <div className="min-h-[80px] border-b-2 border-primary mb-5 flex gap-2 flex-wrap p-3 items-center">
        {currentSentence.map((word, idx) => (
            <div 
                key={`${word}-${idx}`}
                onClick={() => handleDropZoneClick(word, idx)}
                className="bg-primary text-white py-2 px-4 rounded-lg font-semibold cursor-pointer transition-transform hover:scale-105 select-none"
            >
                {word}
            </div>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        {pool.map((word, idx) => (
             <button
                key={`${word}-${idx}`}
                onClick={() => handlePoolClick(word, idx)}
                className="block py-4 px-5 border border-slate-200 rounded-xl bg-white text-base font-semibold cursor-pointer transition-all duration-150 text-slate-900 hover:border-primary hover:bg-cyan-50 hover:text-primary-hover"
             >
                {word}
             </button>
        ))}
      </div>
    </div>
  );
};