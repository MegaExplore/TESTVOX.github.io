import React from 'react';

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string | null;
}

export const TranslationModal: React.FC<TranslationModalProps> = ({ isOpen, onClose, content }) => {
  return (
    <div className={`fixed left-1/2 -translate-x-1/2 w-[95%] max-w-[550px] bg-white p-8 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.15)] transition-[bottom] duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] z-[3000] ${isOpen ? 'bottom-0' : '-bottom-full'}`}>
      <div className="flex justify-between items-center mb-5">
        <h3 className="m-0 text-[1.1rem] text-slate-500 uppercase font-semibold">Linguistic Insight</h3>
        <button 
          onClick={onClose}
          className="bg-none border-none text-2xl cursor-pointer text-slate-500 hover:text-slate-700"
        >
          ✕
        </button>
      </div>
      <div id="translation-content">
        {content === null ? (
          <div className="spinner my-5 mx-auto"></div>
        ) : (
          <p className="text-xl leading-relaxed font-medium text-slate-900">
            "{content}"
          </p>
        )}
      </div>
    </div>
  );
};