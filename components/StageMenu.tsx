import React from 'react';
import { Manifest, AppState } from '../types';
import { isStageAccessible } from '../services/storage';

interface StageMenuProps {
  manifest: Manifest;
  state: AppState;
  onSelectStage: (cid: string, level: string, sectionKey: string, stageId: number) => void;
}

export const StageMenu: React.FC<StageMenuProps> = ({ manifest, state, onSelectStage }) => {
  const langData = manifest.languages['all'];
  const levelData = langData?.levels[state.level];

  if (!levelData || !levelData.sections || levelData.sections.length === 0) {
    return (
        <div className="text-center py-16 text-slate-500">
            <div className="text-[3rem] mb-4">⏳</div>
            <p>Level {state.level} content is currently being prepared.</p>
        </div>
    );
  }

  return (
    <div>
        {levelData.sections.map((sec, idx) => {
            const secKey = sec.title.replace(/\s+/g, '_');
            
            return (
                <div key={idx}>
                    <h3 className="mt-8 mb-5 text-primary font-extrabold text-2xl">
                        {sec.title}
                    </h3>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 mt-6">
                        {sec.stages.map((stg) => {
                            const ok = isStageAccessible(state, 'all', state.level, secKey, stg.id, stg.isFree);
                            
                            return (
                                <button
                                    key={stg.id}
                                    disabled={!ok}
                                    onClick={() => ok && onSelectStage(stg.cid, state.level, secKey, stg.id)}
                                    className={`
                                        flex flex-col items-center p-8 bg-white border-2 rounded-xl transition-all duration-200 text-center
                                        ${ok 
                                          ? 'cursor-pointer border-slate-200 hover:border-primary hover:-translate-y-1 hover:shadow-md' 
                                          : 'opacity-50 bg-slate-50 cursor-not-allowed grayscale border-slate-200'
                                        }
                                    `}
                                >
                                    <div className="text-[2.5rem] mb-3">
                                        {ok ? (stg.icon || '📖') : '🔒'}
                                    </div>
                                    <div className="font-bold text-slate-900">
                                        {stg.name}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        })}
    </div>
  );
};