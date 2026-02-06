import React, { useState } from 'react';
import { Exercise } from '../../types';

interface Props {
  data: Exercise;
  onAnswer: (answer: string) => void;
}

export const TapFill: React.FC<Props> = ({ data, onAnswer }) => {
  const [selection, setSelection] = useState<string | null>(null);

  const parts = data.question.split('___');

  const handleSelect = (opt: string) => {
    setSelection(opt);
    setTimeout(() => onAnswer(opt), 400);
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-6 w-full text-left">Complete the sequence:</h3>
      
      <p className="text-2xl my-8 p-6 bg-slate-50 rounded-xl text-center w-full">
         {parts.map((part, i) => (
            <React.Fragment key={i}>
                <span>{part}</span>
                {i < parts.length - 1 && (
                    <span className="text-primary border-b-[3px] border-current px-3">
                        {selection || '...'}
                    </span>
                )}
            </React.Fragment>
        ))}
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        {data.options?.map((opt, idx) => (
            <button
                key={idx}
                onClick={() => handleSelect(opt)}
                className="block py-4 px-6 w-auto border border-slate-200 rounded-xl bg-white text-base font-semibold cursor-pointer transition-all duration-150 hover:border-primary hover:bg-cyan-50 hover:text-primary-hover"
            >
                {opt}
            </button>
        ))}
      </div>
    </div>
  );
};