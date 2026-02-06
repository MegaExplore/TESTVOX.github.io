export interface AppState {
  siteLanguage: string;
  targetLanguage: string;
  level: string;
  unlockedStages: {
    [lang: string]: {
      [level: string]: {
        [section: string]: number[];
      };
    };
  };
}

export interface ManifestStage {
  id: number;
  name: string;
  cid: string;
  icon?: string;
  isFree?: boolean;
}

export interface ManifestSection {
  title: string;
  stages: ManifestStage[];
}

export interface ManifestLevel {
  sections: ManifestSection[];
}

export interface Manifest {
  languages: {
    [key: string]: {
      levels: {
        [key: string]: ManifestLevel;
      };
    };
  };
}

export interface Exercise {
  id: string;
  type: 'multiple_choice' | 'matching' | 'sentence_ordering' | 'flashcards' | 'fill_blank_typing' | 'tap_fill' | 'pronunciation';
  question: string;
  answer?: string;
  options?: string[];
  pairs?: { left: string; right: string }[];
  words?: string[];
  front?: string;
  back?: string;
  voiceLang?: string;
}

export interface StageData {
  exercises: Exercise[];
}