import React from 'react';
import { Exercise } from '../../types';

interface Props {
  data: Exercise;
  onAnswer: (answer: string) => void;
}

export const MultipleChoice: React.FC<Props> = ({ data, onAnswer }) => {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-6">{data.question}</h3>
      <div className="w-full">
        {data.options?.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onAnswer(opt)}
            className="block w-full p-4 my-3 border border-slate-200 rounded-xl bg-white text-base font-semibold cursor-pointer transition-all duration-150 text-left text-slate-900 hover:border-primary hover:bg-cyan-50 hover:text-primary-hover"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};