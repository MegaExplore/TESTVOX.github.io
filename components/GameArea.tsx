import React, { useState } from 'react';
import { StageData, Exercise } from '../types';
import { MultipleChoice } from './exercises/MultipleChoice';
import { Matching } from './exercises/Matching';
import { SentenceOrdering } from './exercises/SentenceOrdering';
import { Flashcards } from './exercises/Flashcards';
import { FillBlankTyping } from './exercises/FillBlankTyping';
import { TapFill } from './exercises/TapFill';
import { Pronunciation } from './exercises/Pronunciation';

interface GameAreaProps {
  data: StageData;
  onComplete: () => void;
  onExit: () => void;
  onFeedback: (ok: boolean) => void;
  onOpenTranslation: (id: string) => void;
  siteLanguage: string;
}

export const GameArea: React.FC<GameAreaProps> = ({ 
    data, 
    onComplete, 
    onExit, 
    onFeedback, 
    onOpenTranslation 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleExerciseComplete = () => {
    if (currentIndex >= data.exercises.length - 1) {
      setIsCompleted(true);
      onComplete();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleAnswer = (input: string) => {
    const ex = data.exercises[currentIndex];
    const solution = ex.type === 'matching' ? input : ex.answer;
    const correct = checkAnswer(input, solution);
    
    onFeedback(correct);
    if (correct) {
      setTimeout(handleExerciseComplete, 1000); // Wait for feedback animation
    }
  };

  const checkAnswer = (input: string, solution?: string) => {
    if (!solution) return true;
    const norm = (s: string) => s.toString().toLowerCase().trim().replace(/[.,!?;]/g, '');
    return norm(input) === norm(solution);
  };

  if (isCompleted) {
    return (
        <div className="text-center py-10">
            <div className="text-[4rem] mb-6">🏆</div>
            <h2 className="text-vox-dark font-brand text-3xl font-extrabold mb-0">Mastery Achieved!</h2>
            <p className="text-slate-500 mb-8 mt-4">You have successfully completed this module.</p>
            <button 
                className="block w-full max-w-[250px] mx-auto p-4 border border-slate-200 rounded-xl bg-vox-dark text-white text-base font-semibold cursor-pointer transition-all duration-150 hover:opacity-90"
                onClick={onExit}
            >
                Next Module
            </button>
        </div>
    );
  }

  const ex = data.exercises[currentIndex];
  const progress = (currentIndex / data.exercises.length) * 100;

  const renderExercise = () => {
    switch(ex.type) {
        case 'multiple_choice': return <MultipleChoice data={ex} onAnswer={handleAnswer} />;
        case 'matching': return <Matching data={ex} onAnswer={handleAnswer} onFeedback={onFeedback} />;
        case 'sentence_ordering': return <SentenceOrdering data={ex} onAnswer={handleAnswer} />;
        case 'flashcards': return <Flashcards data={ex} onAnswer={handleAnswer} />;
        case 'fill_blank_typing': return <FillBlankTyping data={ex} onAnswer={handleAnswer} />;
        case 'tap_fill': return <TapFill data={ex} onAnswer={handleAnswer} />;
        case 'pronunciation': return <Pronunciation data={ex} onAnswer={handleAnswer} />;
        default: return <div>Unknown exercise type</div>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-bold text-slate-500 uppercase">
             Exercise {currentIndex + 1} / {data.exercises.length}
        </span>
        <div className="flex gap-2">
            {currentIndex > 0 && (
                <button 
                    onClick={() => setCurrentIndex(prev => prev - 1)}
                    className="bg-slate-100 text-slate-500 border border-slate-200 py-1 px-3 rounded-md text-xs font-bold uppercase cursor-pointer hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                    back
                </button>
            )}
            <button 
                onClick={() => handleExerciseComplete()}
                className="bg-slate-100 text-slate-500 border border-slate-200 py-1 px-3 rounded-md text-xs font-bold uppercase cursor-pointer hover:bg-slate-200 hover:text-slate-900 transition-colors"
            >
                skip
            </button>
        </div>
      </div>
      
      <div className="w-full h-2 bg-slate-200 rounded mb-6 overflow-hidden">
        <div 
            className="h-full bg-primary transition-all duration-400 ease-out" 
            style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div>
        {renderExercise()}
      </div>

      <button 
        onClick={() => onOpenTranslation(ex.id)}
        className="fixed bottom-8 right-8 py-3 px-6 bg-vox-dark text-white border-none rounded-full font-semibold cursor-pointer shadow-lg z-[1500] hover:scale-105 transition-transform"
      >
        🌐 Deep Analysis
      </button>
    </div>
  );
};