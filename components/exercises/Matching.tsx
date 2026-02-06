import React, { useState, useEffect, useCallback } from 'react';
import { Exercise } from '../../types';

interface Props {
  data: Exercise;
  onAnswer: (answer: string) => void;
  onFeedback: (ok: boolean) => void;
}

export const Matching: React.FC<Props> = ({ data, onAnswer, onFeedback }) => {
  const [pairs] = useState(() => data.pairs || []);
  const [leftSide, setLeftSide] = useState<string[]>([]);
  const [rightSide, setRightSide] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // stores matched keys
  const [incorrect, setIncorrect] = useState<string | null>(null);

  useEffect(() => {
    if (data.pairs) {
        setLeftSide(data.pairs.map(p => p.left).sort(() => Math.random() - 0.5));
        setRightSide(data.pairs.map(p => p.right).sort(() => Math.random() - 0.5));
    }
  }, [data.pairs]);

  const handleLeftClick = (text: string) => {
    if (matchedPairs.includes(text)) return;
    setSelectedLeft(text);
    setIncorrect(null);
  };

  const handleRightClick = (text: string) => {
    if (!selectedLeft) return;
    if (matchedPairs.includes(selectedLeft)) return;

    const correctPair = pairs.find(p => p.left === selectedLeft);
    const isMatch = correctPair && correctPair.right === text;

    if (isMatch) {
      const newMatched = [...matchedPairs, selectedLeft];
      setMatchedPairs(newMatched);
      setSelectedLeft(null);
      if (newMatched.length === pairs.length) {
         setTimeout(() => onAnswer(text), 600);
      }
    } else {
      setIncorrect(text);
      onFeedback(false);
      setTimeout(() => {
        setIncorrect(null);
        setSelectedLeft(null);
      }, 400);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold mb-6">Match the Pairs:</h3>
      <div className="grid grid-cols-2 gap-3 w-full">
        {leftSide.map((text, idx) => {
           const isMatched = matchedPairs.includes(text);
           const isSelected = selectedLeft === text;
           return (
             <button
                key={idx}
                onClick={() => handleLeftClick(text)}
                disabled={isMatched}
                className={`
                    block w-full p-4 border rounded-xl font-semibold transition-all duration-150 text-left
                    ${isMatched ? 'bg-success text-white border-success' : 'bg-white text-slate-900 border-slate-200'}
                    ${!isMatched && isSelected ? 'border-primary ring-1 ring-primary' : ''}
                    ${!isMatched && !isSelected ? 'hover:border-primary hover:bg-cyan-50' : ''}
                `}
             >
                {text}
             </button>
           );
        })}
        
        {rightSide.map((text, idx) => {
           // Find which left side corresponds to this right side to check if it's matched
           const pair = pairs.find(p => p.right === text);
           const isMatched = pair && matchedPairs.includes(pair.left);
           const isError = incorrect === text;

           return (
             <button
                key={idx}
                onClick={() => handleRightClick(text)}
                disabled={!!isMatched}
                className={`
                    block w-full p-4 border rounded-xl font-semibold transition-all duration-150 text-left
                    ${isMatched ? 'bg-success text-white border-success' : ''}
                    ${isError ? 'bg-error text-white border-error' : ''}
                    ${!isMatched && !isError ? 'bg-white text-slate-900 border-slate-200 hover:border-primary hover:bg-cyan-50' : ''}
                `}
             >
                {text}
             </button>
           );
        })}
      </div>
    </div>
  );
};