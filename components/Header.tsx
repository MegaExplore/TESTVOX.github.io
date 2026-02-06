import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  state: AppState;
  onStateChange: (updates: Partial<AppState>) => void;
  onLogoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ state, onStateChange, onLogoClick }) => {
  return (
    <header className="sticky top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 py-2">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-wrap justify-between items-center gap-5">
        <div 
          className="h-12 flex items-center cursor-pointer transition-transform hover:scale-[1.02]" 
          onClick={onLogoClick}
        >
          <svg className="h-full w-auto max-w-[320px]" viewBox="0 0 750 150" xmlns="http://www.w3.org/2000/svg">
            <text x="20" y="100" fill="#0D1117" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "80px" }}>Vox</text>
            <text x="210" y="100" fill="#29D1F1" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800, fontSize: "80px" }}>MegaLiberta</text>
          </svg>
        </div>

        <div className="flex gap-3 items-center w-full sm:w-auto justify-center flex-wrap">
          <div className="flex flex-col">
            <label className="text-[0.65rem] uppercase font-bold text-slate-500 mb-[2px] ml-[2px]">Site</label>
            <select 
              className="py-2 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-900 cursor-pointer outline-none hover:border-primary transition-colors"
              value={state.siteLanguage}
              onChange={(e) => onStateChange({ siteLanguage: e.target.value })}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[0.65rem] uppercase font-bold text-slate-500 mb-[2px] ml-[2px]">Learning</label>
            <select 
              className="py-2 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-900 cursor-pointer outline-none hover:border-primary transition-colors"
              value={state.targetLanguage}
              onChange={(e) => onStateChange({ targetLanguage: e.target.value })}
            >
              <option value="all">All Modules</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[0.65rem] uppercase font-bold text-slate-500 mb-[2px] ml-[2px]">Your Level</label>
            <select 
              className="py-2 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-900 cursor-pointer outline-none hover:border-primary transition-colors"
              value={state.level}
              onChange={(e) => onStateChange({ level: e.target.value })}
            >
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
              <option value="C1">C1</option>
              <option value="C2">C2</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};