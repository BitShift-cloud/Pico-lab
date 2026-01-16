import { useState, useEffect, useRef } from 'react';
import { usePicoLab } from '@/context/PicoLabContext';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Undo2, 
  Redo2, 
  AlertTriangle, 
  ChevronDown,
  Home,
  Clock,
  Send,
  LogOut
} from 'lucide-react';

export function WorkspaceToolbar() {
  const {
    isSimulating,
    setIsSimulating,
    activeFault,
    setActiveFault,
    resetWorkspace,
    undo,
    redo,
    canUndo,
    canRedo,
    setCurrentView,
    setWorkspaceMode,
    activeExam,
    setActiveExam,
    examTimeRemaining,
    setExamTimeRemaining,
    examStartTime,
    setExamStartTime,
    components,
    connections,
    addFeedback,
    userMode,
    workspaceMode,
    matchState,
    setMatchState,
    resetMatchState,
    updateScore,
    studentProfile,
    setSubmissions,
    resetAllModeState,
  } = usePicoLab();

  const [showFaultMenu, setShowFaultMenu] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const faults = [
    { id: 'loose-wire', name: 'Loose Wire', description: 'Randomly disconnect a wire' },
    { id: 'wrong-resistor', name: 'Wrong Resistor', description: 'Simulate incorrect resistor value' },
    { id: 'short-circuit', name: 'Short Circuit', description: 'Direct VCC to GND connection' },
  ];

  // FIXED: Exam timer - uses real elapsed time calculation
  useEffect(() => {
    if (workspaceMode === 'exam' && activeExam && examStartTime !== null) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
        const remaining = Math.max(0, activeExam.timeLimit - elapsed);
        setExamTimeRemaining(remaining);

        if (remaining <= 0) {
          // Time's up - auto submit
          handleExamSubmit(true);
        }
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [workspaceMode, activeExam, examStartTime]);

  // Play mode timer
  useEffect(() => {
    if (matchState.status === 'playing' && matchState.startTime) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - new Date(matchState.startTime!).getTime()) / 1000);
        const remaining = Math.max(0, (matchState.timeLimit || 300) - elapsed);
        
        if (remaining <= 0) {
          clearInterval(timer);
          // Time's up in play mode
          setMatchState(prev => ({ ...prev, status: 'finished', result: 'lose' }));
          addFeedback('warning', 'Time\'s up! Match ended.');
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [matchState.status, matchState.startTime, matchState.timeLimit]);

  const runSimulation = () => {
    if (components.length === 0) {
      addFeedback('warning', 'Add components to the canvas first');
      return;
    }

    setIsSimulating(true);
    addFeedback('info', 'Simulation started');

    // Check for short circuit
    const hasShortCircuit = connections.some(conn => {
      const [fromComp, fromPin] = conn.from.split('-');
      const [toComp, toPin] = conn.to.split('-');
      const fc = components.find(c => c.id === fromComp);
      const tc = components.find(c => c.id === toComp);
      if (!fc || !tc) return false;
      
      const fp = fc.pins.find(p => p.id === fromPin);
      const tp = tc.pins.find(p => p.id === toPin);
      
      return (fp?.type === 'power' && tp?.type === 'ground') || 
             (fp?.type === 'ground' && tp?.type === 'power');
    });

    if (hasShortCircuit || activeFault === 'short-circuit') {
      addFeedback('error', '⚠️ SHORT CIRCUIT DETECTED! Power supply overload!');
      setTimeout(() => {
        setIsSimulating(false);
        addFeedback('warning', 'Simulation stopped due to short circuit');
      }, 1000);
      return;
    }

    // Check for LED without resistor
    const leds = components.filter(c => c.type.includes('led'));
    const resistors = components.filter(c => c.type === 'resistor');
    
    if (leds.length > 0 && resistors.length === 0) {
      if (activeFault === 'wrong-resistor') {
        addFeedback('error', '💥 LED burned out! Missing current-limiting resistor');
      } else {
        addFeedback('warning', '⚠️ LED connected without resistor - risk of burnout!');
      }
    }

    // Activate LEDs that are properly connected
    leds.forEach(led => {
      const ledConnections = connections.filter(
        c => c.from.startsWith(led.id) || c.to.startsWith(led.id)
      );
      if (ledConnections.length >= 2) {
        addFeedback('success', `${led.name} is lit!`);
      }
    });

    // Loose wire fault
    if (activeFault === 'loose-wire' && connections.length > 0) {
      setTimeout(() => {
        addFeedback('warning', '⚡ Loose wire detected! Connection interrupted.');
      }, 2000);
    }
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    addFeedback('info', 'Simulation stopped');
  };

  const handleReset = () => {
    resetWorkspace();
  };

  const handleHome = () => {
    if (matchState.status === 'playing') {
      addFeedback('warning', 'Cannot leave during a match!');
      return;
    }
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    resetAllModeState();
    setWorkspaceMode(null);
    setCurrentView('dashboard');
  };

  const handleLeaveExam = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    addFeedback('warning', 'Left exam without submitting');
    resetAllModeState();
    setWorkspaceMode(null);
    setCurrentView('dashboard');
  };

  const handleExamSubmit = (autoSubmit = false) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Create submission record
    if (activeExam && studentProfile) {
      const submission = {
        id: Date.now().toString(),
        examCode: activeExam.code,
        studentCode: studentProfile.code,
        components: JSON.parse(JSON.stringify(components)),
        connections: JSON.parse(JSON.stringify(connections)),
        submittedAt: new Date(),
      };
      setSubmissions(prev => [...prev, submission]);
    }

    addFeedback('success', autoSubmit ? 'Time\'s up! Exam auto-submitted.' : 'Exam submitted successfully!');
    updateScore({ completedTasks: 1 });
    
    setTimeout(() => {
      resetAllModeState();
      setWorkspaceMode(null);
      setCurrentView('dashboard');
    }, 1500);
  };

  const handlePlayFinish = () => {
    if (matchState.status !== 'playing') return;
    
    setMatchState({ status: 'finished', result: 'win' });
    addFeedback('success', '🎉 You Win! +10 Points');
    updateScore({ 
      matchesWon: 1, 
      points: 10 
    });
    
    // Allow going back to dashboard after a short delay
    setTimeout(() => {
      resetMatchState();
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPlayTimeRemaining = () => {
    if (!matchState.startTime) return matchState.timeLimit || 300;
    const elapsed = Math.floor((Date.now() - new Date(matchState.startTime).getTime()) / 1000);
    return Math.max(0, (matchState.timeLimit || 300) - elapsed);
  };

  return (
    <div className="h-14 bg-card border-t border-border px-4 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleHome}
          className="btn-ghost flex items-center gap-2"
        >
          <Home size={16} />
          <span className="hidden sm:inline">Home</span>
        </button>

        {/* Leave Exam button */}
        {workspaceMode === 'exam' && activeExam && (
          <button
            onClick={handleLeaveExam}
            className="btn-ghost flex items-center gap-2 text-destructive"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Leave Exam</span>
          </button>
        )}

        <div className="w-px h-6 bg-border mx-2" />

        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Undo"
        >
          <Undo2 size={18} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Redo"
        >
          <Redo2 size={18} />
        </button>

        <button
          onClick={handleReset}
          className="btn-ghost flex items-center gap-2"
        >
          <RotateCcw size={16} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Center section - Timer for exam/play */}
      {(workspaceMode === 'exam' && examTimeRemaining !== null) && (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          examTimeRemaining < 60 ? 'bg-destructive/20 text-destructive' : 'bg-muted'
        }`}>
          <Clock size={16} className={examTimeRemaining < 60 ? 'text-destructive' : 'text-warning'} />
          <span className="font-mono font-bold text-lg">
            {formatTime(examTimeRemaining)}
          </span>
        </div>
      )}

      {matchState.status === 'playing' && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
            <Clock size={16} className="text-warning" />
            <span className="font-mono font-bold">
              {formatTime(getPlayTimeRemaining())}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">
            vs <span className="text-foreground font-medium">{matchState.opponentName}</span>
          </span>
        </div>
      )}

      {matchState.status === 'finished' && (
        <div className={`px-4 py-2 rounded-lg font-bold ${
          matchState.result === 'win' ? 'bg-secondary/20 text-secondary' : 'bg-destructive/20 text-destructive'
        }`}>
          {matchState.result === 'win' ? '🎉 You Won!' : 'Match Ended'}
        </div>
      )}

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Fault injection (teacher only) */}
        {userMode === 'teacher' && (
          <div className="relative">
            <button
              onClick={() => setShowFaultMenu(!showFaultMenu)}
              className={`btn-ghost flex items-center gap-2 ${activeFault ? 'text-warning' : ''}`}
            >
              <AlertTriangle size={16} />
              <span className="hidden sm:inline">
                {activeFault ? faults.find(f => f.id === activeFault)?.name : 'Fault Injection'}
              </span>
              <ChevronDown size={14} />
            </button>

            {showFaultMenu && (
              <div className="absolute bottom-full mb-2 right-0 w-56 bg-popover border border-border rounded-lg shadow-xl overflow-hidden z-50">
                <button
                  onClick={() => {
                    setActiveFault(null);
                    setShowFaultMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors ${
                    !activeFault ? 'bg-muted' : ''
                  }`}
                >
                  No Fault
                </button>
                {faults.map(fault => (
                  <button
                    key={fault.id}
                    onClick={() => {
                      setActiveFault(fault.id);
                      setShowFaultMenu(false);
                      addFeedback('warning', `Fault injection enabled: ${fault.name}`);
                    }}
                    className={`w-full px-4 py-2 text-left hover:bg-muted transition-colors ${
                      activeFault === fault.id ? 'bg-warning/10 text-warning' : ''
                    }`}
                  >
                    <p className="text-sm font-medium">{fault.name}</p>
                    <p className="text-xs text-muted-foreground">{fault.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="w-px h-6 bg-border mx-2" />

        {/* Simulation controls */}
        {!isSimulating ? (
          <button onClick={runSimulation} className="btn-primary flex items-center gap-2">
            <Play size={16} />
            Run Simulation
          </button>
        ) : (
          <button onClick={stopSimulation} className="btn-ghost flex items-center gap-2 text-destructive border-destructive">
            <Square size={16} />
            Stop
          </button>
        )}

        {/* Exam submit */}
        {workspaceMode === 'exam' && activeExam && (
          <button onClick={() => handleExamSubmit(false)} className="btn-secondary flex items-center gap-2">
            <Send size={16} />
            Submit
          </button>
        )}

        {/* Play mode finish */}
        {matchState.status === 'playing' && (
          <button onClick={handlePlayFinish} className="btn-secondary flex items-center gap-2">
            <Send size={16} />
            Finish
          </button>
        )}
      </div>
    </div>
  );
}
