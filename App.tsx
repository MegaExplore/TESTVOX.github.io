import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { StageMenu } from './components/StageMenu';
import { GameArea } from './components/GameArea';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { TranslationModal } from './components/TranslationModal';
import { initSession, saveProgress, unlockStage } from './services/storage';
import { fetchData } from './services/api';
import { AppState, Manifest, StageData } from './types';

export default function App() {
  const [state, setState] = useState<AppState>(initSession());
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [currentStageData, setCurrentStageData] = useState<StageData | null>(null);
  const [activeStageId, setActiveStageId] = useState<number | null>(null);
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ ok: boolean; title: string; show: boolean }>({ ok: false, title: '', show: false });
  const [translationModalOpen, setTranslationModalOpen] = useState(false);
  const [translationContent, setTranslationContent] = useState<string | null>(null);

  useEffect(() => {
    const loadManifest = async () => {
      try {
        const data = await fetchData('manifest.json');
        setManifest(data);
      } catch (error) {
        console.error("Failed to load manifest", error);
      } finally {
        setLoading(false);
      }
    };
    loadManifest();
  }, []);

  const handleStateChange = (updates: Partial<AppState>) => {
    const newState = { ...state, ...updates };
    setState(newState);
    saveProgress(newState);
  };

  const handleStageSelect = async (cid: string, level: string, sectionKey: string, stageId: number) => {
    setLoading(true);
    try {
      const data = await fetchData(cid);
      setCurrentStageData(data);
      setActiveStageId(stageId);
      setActiveLevel(level);
      setActiveSection(sectionKey);
    } catch (error) {
      console.error("Failed to load stage", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStageComplete = () => {
    if (activeLevel && activeSection && activeStageId !== null) {
      const newState = { ...state };
      unlockStage(newState, 'all', activeLevel, activeSection, activeStageId + 1);
      setState(newState);
      // saveProgress is handled inside unlockStage helper if we passed the reference, 
      // but here we are managing react state, so we should sync it.
      // However, the unlockStage service mutates and saves. 
      // Better to re-read or update properly. 
      // Let's rely on the service to update localStorage and we just update local state.
    }
  };

  const handleExitStage = () => {
    setCurrentStageData(null);
    setActiveStageId(null);
    setActiveLevel(null);
    setActiveSection(null);
  };

  const showFeedback = (ok: boolean) => {
    setFeedback({
      ok,
      title: ok ? 'Precision' : 'Try Again',
      show: true
    });
    setTimeout(() => {
      setFeedback(prev => ({ ...prev, show: false }));
    }, 1000);
  };

  const openTranslation = async (exId: string) => {
    setTranslationModalOpen(true);
    setTranslationContent(null); // Loading state inside modal
    try {
        const data = await fetchData('secondary.json');
        const entry = data[exId];
        const val = entry ? (entry[state.siteLanguage] || entry['en'] || entry) : "No context available.";
        setTranslationContent(val);
    } catch (e) {
        setTranslationContent("Analysis unavailable.");
    }
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-bg">
      <Header 
        state={state} 
        onStateChange={handleStateChange} 
        onLogoClick={() => window.location.reload()}
      />

      <div id="app-container" className="w-[95%] max-w-[1100px] mx-auto my-10 p-6 md:p-10 bg-white rounded-3xl shadow-card border border-slate-200 min-h-[500px] transition-all duration-300">
        {loading ? (
          <div className="text-center py-24">
            <div className="spinner mx-auto mb-6"></div>
            <h2 className="text-slate-500 font-brand text-2xl font-bold">Initializing VOX...</h2>
          </div>
        ) : currentStageData ? (
          <GameArea 
            data={currentStageData}
            onComplete={handleStageComplete}
            onExit={handleExitStage}
            onFeedback={showFeedback}
            onOpenTranslation={openTranslation}
            siteLanguage={state.siteLanguage}
          />
        ) : manifest ? (
          <StageMenu 
            manifest={manifest}
            state={state}
            onSelectStage={handleStageSelect}
          />
        ) : (
          <div className="text-center py-10">
            <h3 className="text-xl font-bold text-error">Connection Error</h3>
            <p className="text-slate-500">Ensure repository is public and schemas are correct.</p>
          </div>
        )}
      </div>

      <FeedbackOverlay 
        show={feedback.show} 
        ok={feedback.ok} 
        title={feedback.title} 
      />

      <TranslationModal 
        isOpen={translationModalOpen}
        onClose={() => setTranslationModalOpen(false)}
        content={translationContent}
      />
    </div>
  );
}