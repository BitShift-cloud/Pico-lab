import { useState, useEffect } from 'react';
import { usePicoLab } from '@/context/PicoLabContext';
import { ComponentLibraryPanel } from './ComponentLibraryPanel';
import { Canvas } from './Canvas';
import { FeedbackPanel } from './FeedbackPanel';
import { WorkspaceToolbar } from './WorkspaceToolbar';
import { Logo } from './Logo';
import { ExamJoinModal } from './ExamJoinModal';
import { PlayMatchModal } from './PlayMatchModal';

export function Workspace() {
  const { 
    workspaceMode, 
    activeExam, 
    matchState,
    setCurrentView,
    setWorkspaceMode,
    resetMatchState,
  } = usePicoLab();

  const [showExamModal, setShowExamModal] = useState(false);
  const [showPlayModal, setShowPlayModal] = useState(false);

  useEffect(() => {
    if (workspaceMode === 'exam' && !activeExam) {
      setShowExamModal(true);
    }
    if (workspaceMode === 'play' && matchState.status === 'idle') {
      setShowPlayModal(true);
    }
  }, [workspaceMode, activeExam, matchState.status]);

  const handleExamModalClose = () => {
    setShowExamModal(false);
    if (!activeExam) {
      setWorkspaceMode(null);
      setCurrentView('dashboard');
    }
  };

  const handlePlayModalClose = () => {
    setShowPlayModal(false);
    if (matchState.status === 'idle') {
      resetMatchState();
      setWorkspaceMode(null);
      setCurrentView('dashboard');
    }
  };

  const getModeTitle = () => {
    switch (workspaceMode) {
      case 'practice': return 'Practice Mode';
      case 'exam': return activeExam?.title || 'Exam Mode';
      case 'play': return 'Play Mode';
      default: return 'Workspace';
    }
  };

  const getModeDescription = () => {
    switch (workspaceMode) {
      case 'practice': return 'Build circuits freely with all components available';
      case 'exam': return activeExam?.description || 'Complete the assigned task';
      case 'play': return matchState.task || 'Compete to build circuits faster';
      default: return '';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <header className="h-12 bg-card border-b border-border px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Logo size="small" />
          <div className="w-px h-6 bg-border" />
          <div>
            <h1 className="text-sm font-semibold">{getModeTitle()}</h1>
            <p className="text-xs text-muted-foreground">{getModeDescription()}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            workspaceMode === 'practice' ? 'bg-primary/10 text-primary' :
            workspaceMode === 'exam' ? 'bg-secondary/10 text-secondary' :
            'bg-warning/10 text-warning'
          }`}>
            {workspaceMode?.toUpperCase()}
          </span>
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Component Library */}
        <div className="w-64 shrink-0">
          <ComponentLibraryPanel 
            allowedComponents={activeExam?.components}
          />
        </div>

        {/* Canvas */}
        <Canvas />

        {/* Feedback Panel */}
        <div className="w-72 shrink-0">
          <FeedbackPanel />
        </div>
      </div>

      {/* Bottom toolbar */}
      <WorkspaceToolbar />

      {/* Modals */}
      {showExamModal && (
        <ExamJoinModal onClose={handleExamModalClose} />
      )}

      {showPlayModal && (
        <PlayMatchModal onClose={handlePlayModalClose} />
      )}
    </div>
  );
}
