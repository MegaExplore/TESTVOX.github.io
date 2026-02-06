import React, { useState } from 'react';
import { Exercise } from '../../types';

interface Props {
  data: Exercise;
  onAnswer: (answer: string) => void;
}

export const Flashcards: React.FC<Props> = ({ data, onAnswer }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div 
        onClick={() => setFlipped(!flipped)}
        className={`
            h-[200px] w-full bg-vox-dark text-white rounded-[20px] flex items-center justify-center text-4xl cursor-pointer 
            transition-all duration-500 perspective-1000 transform-style-3d
            ${flipped ? 'bg-primary rotate-y-180' : ''}
        `}
      >
         <span className={flipped ? 'rotate-y-180' : ''}>
             {flipped ? data.back : data.front}
         </span>
      </div>

      <button 
        onClick={() => onAnswer(data.answer || data.back || '')}
        className="block w-full p-4 mt-8 border border-slate-200 rounded-xl bg-white text-base font-semibold cursor-pointer transition-all duration-150 text-left text-slate-900 hover:border-primary hover:bg-cyan-50 hover:text-primary-hover"
      >
        I've memorized this
      </button>
    </div>
  );
};