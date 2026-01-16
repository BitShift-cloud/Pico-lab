import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { 
  UserMode, 
  AppView, 
  WorkspaceMode, 
  Component, 
  Wire, 
  Connection, 
  FeedbackMessage,
  Exam,
  ExamSubmission,
  StudentProfile,
  ScoreboardEntry,
  Flashcard,
  HistoryAction,
  MatchState
} from '@/types/picolab';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface WorkspaceSnapshot {
  components: Component[];
  wires: Wire[];
  connections: Connection[];
}

interface PicoLabContextType {
  // Auth & Mode
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  workspaceMode: WorkspaceMode | null;
  setWorkspaceMode: (mode: WorkspaceMode | null) => void;
  
  // Student profile
  studentProfile: StudentProfile | null;
  setStudentProfile: (profile: StudentProfile | null) => void;
  
  // Workspace state
  components: Component[];
  setComponents: React.Dispatch<React.SetStateAction<Component[]>>;
  wires: Wire[];
  setWires: React.Dispatch<React.SetStateAction<Wire[]>>;
  connections: Connection[];
  setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
  
  // Simulation
  isSimulating: boolean;
  setIsSimulating: (value: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  
  // Fault injection
  activeFault: string | null;
  setActiveFault: (fault: string | null) => void;
  
  // Feedback
  feedbackMessages: FeedbackMessage[];
  addFeedback: (type: FeedbackMessage['type'], message: string) => void;
  clearFeedback: () => void;
  
  // Exams
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  activeExam: Exam | null;
  setActiveExam: (exam: Exam | null) => void;
  examTimeRemaining: number | null;
  setExamTimeRemaining: (time: number | null) => void;
  examStartTime: number | null;
  setExamStartTime: (time: number | null) => void;
  submissions: ExamSubmission[];
  setSubmissions: React.Dispatch<React.SetStateAction<ExamSubmission[]>>;
  
  // Scoreboard
  scoreboard: ScoreboardEntry[];
  updateScore: (updates: Partial<ScoreboardEntry>) => void;
  
  // Flashcards
  flashcards: Flashcard[];
  addFlashcard: (front: string, back: string) => void;
  removeFlashcard: (id: string) => void;
  
  // History (undo/redo) - FIXED
  history: WorkspaceSnapshot[];
  historyIndex: number;
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  
  // Play mode
  matchState: MatchState;
  setMatchState: React.Dispatch<React.SetStateAction<MatchState>>;
  resetMatchState: () => void;
  
  // Canvas interaction
  selectedPin: { componentId: string; pinId: string } | null;
  setSelectedPin: (pin: { componentId: string; pinId: string } | null) => void;
  selectedComponent: string | null;
  setSelectedComponent: (id: string | null) => void;
  
  // Utility
  resetWorkspace: () => void;
  resetAllModeState: () => void;
  generateStudentCode: () => string;
}

const PicoLabContext = createContext<PicoLabContextType | undefined>(undefined);

export function PicoLabProvider({ children }: { children: ReactNode }) {
  // Auth & Mode
  const [userMode, setUserMode] = useState<UserMode>(null);
  const [currentView, setCurrentView] = useState<AppView>('auth');
  const [workspaceMode, setWorkspaceModeInternal] = useState<WorkspaceMode | null>(null);
  
  // Persisted data
  const [studentProfile, setStudentProfile] = useLocalStorage<StudentProfile | null>('picolab-student', null);
  const [exams, setExams] = useLocalStorage<Exam[]>('picolab-exams', []);
  const [submissions, setSubmissions] = useLocalStorage<ExamSubmission[]>('picolab-submissions', []);
  const [scoreboard, setScoreboard] = useLocalStorage<ScoreboardEntry[]>('picolab-scoreboard', []);
  const [flashcards, setFlashcards] = useLocalStorage<Flashcard[]>('picolab-flashcards', []);
  
  // Workspace state
  const [components, setComponents] = useState<Component[]>([]);
  const [wires, setWires] = useState<Wire[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  
  // Simulation
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [activeFault, setActiveFault] = useState<string | null>(null);
  
  // Feedback
  const [feedbackMessages, setFeedbackMessages] = useState<FeedbackMessage[]>([]);
  
  // Exam state
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [examTimeRemaining, setExamTimeRemaining] = useState<number | null>(null);
  const [examStartTime, setExamStartTime] = useState<number | null>(null);
  
  // History - FIXED: Now stores complete snapshots
  const [history, setHistory] = useState<WorkspaceSnapshot[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Play mode
  const [matchState, setMatchState] = useState<MatchState>({ status: 'idle' });
  
  // Canvas interaction
  const [selectedPin, setSelectedPin] = useState<{ componentId: string; pinId: string } | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  
  const addFeedback = useCallback((type: FeedbackMessage['type'], message: string) => {
    const newMessage: FeedbackMessage = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
    };
    setFeedbackMessages(prev => [newMessage, ...prev].slice(0, 50));
  }, []);
  
  const clearFeedback = useCallback(() => {
    setFeedbackMessages([]);
  }, []);
  
  const updateScore = useCallback((updates: Partial<ScoreboardEntry>) => {
    if (!studentProfile) return;
    
    setScoreboard(prev => {
      const existingIndex = prev.findIndex(e => e.studentCode === studentProfile.code);
      if (existingIndex >= 0) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        updated[existingIndex] = { 
          ...existing, 
          ...updates,
          matchesWon: (existing.matchesWon || 0) + (updates.matchesWon || 0),
          matchesLost: (existing.matchesLost || 0) + (updates.matchesLost || 0),
          points: (existing.points || 0) + (updates.points || 0),
          practiceCircuits: (existing.practiceCircuits || 0) + (updates.practiceCircuits || 0),
        };
        return updated;
      } else {
        return [...prev, {
          studentCode: studentProfile.code,
          name: studentProfile.name,
          totalTasks: 0,
          completedTasks: 0,
          practiceCircuits: 0,
          matchesWon: 0,
          matchesLost: 0,
          examScores: [],
          accuracy: 0,
          timeSpent: 0,
          points: 0,
          ...updates,
        }];
      }
    });
  }, [studentProfile, setScoreboard]);
  
  const addFlashcard = useCallback((front: string, back: string) => {
    const newCard: Flashcard = {
      id: Date.now().toString(),
      front,
      back,
      createdAt: new Date(),
    };
    setFlashcards(prev => [...prev, newCard]);
  }, [setFlashcards]);
  
  const removeFlashcard = useCallback((id: string) => {
    setFlashcards(prev => prev.filter(f => f.id !== id));
  }, [setFlashcards]);
  
  // FIXED: Push current state as a snapshot
  const pushHistory = useCallback(() => {
    const snapshot: WorkspaceSnapshot = {
      components: JSON.parse(JSON.stringify(components)),
      wires: JSON.parse(JSON.stringify(wires)),
      connections: JSON.parse(JSON.stringify(connections)),
    };
    
    setHistory(prev => {
      // Remove any "future" snapshots if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);
      // Keep max 50 snapshots
      const limited = [...newHistory, snapshot].slice(-50);
      return limited;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [components, wires, connections, historyIndex]);
  
  // FIXED: Undo restores previous snapshot
  const undo = useCallback(() => {
    if (historyIndex <= 0) return;
    
    const prevSnapshot = history[historyIndex - 1];
    if (prevSnapshot) {
      setComponents(prevSnapshot.components);
      setWires(prevSnapshot.wires);
      setConnections(prevSnapshot.connections);
      setHistoryIndex(prev => prev - 1);
      addFeedback('info', 'Undo performed');
    }
  }, [historyIndex, history, addFeedback]);
  
  // FIXED: Redo restores next snapshot
  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    
    const nextSnapshot = history[historyIndex + 1];
    if (nextSnapshot) {
      setComponents(nextSnapshot.components);
      setWires(nextSnapshot.wires);
      setConnections(nextSnapshot.connections);
      setHistoryIndex(prev => prev + 1);
      addFeedback('info', 'Redo performed');
    }
  }, [historyIndex, history, addFeedback]);
  
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  
  // Reset match state completely
  const resetMatchState = useCallback(() => {
    setMatchState({ status: 'idle' });
  }, []);
  
  const resetWorkspace = useCallback(() => {
    setComponents([]);
    setWires([]);
    setConnections([]);
    setIsSimulating(false);
    setActiveFault(null);
    setSelectedPin(null);
    setSelectedComponent(null);
    setHistory([]);
    setHistoryIndex(-1);
    clearFeedback();
    addFeedback('info', 'Workspace reset');
  }, [clearFeedback, addFeedback]);
  
  // FIXED: Reset ALL mode-related state when switching modes
  const resetAllModeState = useCallback(() => {
    // Clear exam state
    setActiveExam(null);
    setExamTimeRemaining(null);
    setExamStartTime(null);
    
    // Clear play/match state
    setMatchState({ status: 'idle' });
    
    // Reset workspace
    setComponents([]);
    setWires([]);
    setConnections([]);
    setIsSimulating(false);
    setActiveFault(null);
    setSelectedPin(null);
    setSelectedComponent(null);
    setHistory([]);
    setHistoryIndex(-1);
    clearFeedback();
  }, [clearFeedback]);
  
  // Wrap setWorkspaceMode to reset state when changing modes
  const setWorkspaceMode = useCallback((mode: WorkspaceMode | null) => {
    // If switching away from a mode, reset all state
    if (workspaceMode !== null && mode !== workspaceMode) {
      resetAllModeState();
    }
    setWorkspaceModeInternal(mode);
  }, [workspaceMode, resetAllModeState]);
  
  const generateStudentCode = useCallback(() => {
    const prefix = 'BS-PL-ST';
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}-${year}-${random}`;
  }, []);
  
  return (
    <PicoLabContext.Provider value={{
      userMode,
      setUserMode,
      currentView,
      setCurrentView,
      workspaceMode,
      setWorkspaceMode,
      studentProfile,
      setStudentProfile,
      components,
      setComponents,
      wires,
      setWires,
      connections,
      setConnections,
      isSimulating,
      setIsSimulating,
      simulationSpeed,
      setSimulationSpeed,
      activeFault,
      setActiveFault,
      feedbackMessages,
      addFeedback,
      clearFeedback,
      exams,
      setExams,
      activeExam,
      setActiveExam,
      examTimeRemaining,
      setExamTimeRemaining,
      examStartTime,
      setExamStartTime,
      submissions,
      setSubmissions,
      scoreboard,
      updateScore,
      flashcards,
      addFlashcard,
      removeFlashcard,
      history,
      historyIndex,
      pushHistory,
      undo,
      redo,
      canUndo,
      canRedo,
      matchState,
      setMatchState,
      resetMatchState,
      selectedPin,
      setSelectedPin,
      selectedComponent,
      setSelectedComponent,
      resetWorkspace,
      resetAllModeState,
      generateStudentCode,
    }}>
      {children}
    </PicoLabContext.Provider>
  );
}

export function usePicoLab() {
  const context = useContext(PicoLabContext);
  if (context === undefined) {
    throw new Error('usePicoLab must be used within a PicoLabProvider');
  }
  return context;
}
