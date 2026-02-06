import { AppState } from '../types';

const STORAGE_KEY = 'vox_user_progress';

const defaultState: AppState = {
  siteLanguage: 'en',
  targetLanguage: 'all',
  level: 'A1',
  unlockedStages: {}
};

export function initSession(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? { ...defaultState, ...JSON.parse(stored) } : { ...defaultState };
  } catch (e) {
    return { ...defaultState };
  }
}

export function saveProgress(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function unlockStage(state: AppState, lang: string, level: string, section: string, stage: number) {
  if (!state.unlockedStages[lang]) state.unlockedStages[lang] = {};
  if (!state.unlockedStages[lang][level]) state.unlockedStages[lang][level] = {};
  if (!state.unlockedStages[lang][level][section]) state.unlockedStages[lang][level][section] = [];
  
  if (!state.unlockedStages[lang][level][section].includes(stage)) {
    state.unlockedStages[lang][level][section].push(stage);
  }
  saveProgress(state);
}

export function isStageAccessible(state: AppState, lang: string, level: string, section: string, stageId: number, isFree?: boolean) {
  if (isFree) return true;
  if (stageId === 1) return true;
  const unlocked = state.unlockedStages[lang]?.[level]?.[section] || [];
  return unlocked.includes(stageId - 1);
}