import React, { useState } from 'react';
import { Exercise } from '../../types';

interface Props {
  data: Exercise;
  onAnswer: (answer: string) => void;
}

export const FillBlankTyping: React.FC<Props> = ({ data, onAnswer }) => {
  const [val, setVal] = useState('');

  // Replace ___ with a visual marker for display, but input is separate in this component design for simplicity in React?
  // Or stick to the original design where input is inline?
  // React way: Split string by ___ and insert input.
  
  const parts = data.question.split('___');

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-6 w-full text-left">Type the missing word:</h3>
      
      <p className="text-xl leading-relaxed mb-6 flex flex-wrap items-baseline gap-2">
        {parts.map((part, i) => (
            <React.Fragment key={i}>
                <span>{part}</span>
                {i < parts.length - 1 && (
                    <input 
                        type="text" 
                        value={val}
                        onChange={(e) => setVal(e.target.value)}
                        className="border-none border-b-2 border-primary outline-none w-[120px] text-center text-xl font-inherit bg-transparent"
                    />
                )}
            </React.Fragment>
        ))}
      </p>

      <button 
        onClick={() => onAnswer(val)}
        className="block w-full p-4 border border-slate-200 rounded-xl bg-vox-dark text-white text-base font-semibold cursor-pointer transition-all duration-150 hover:opacity-90"
      >
        Check Answer
      </button>
    </div>
  );
};