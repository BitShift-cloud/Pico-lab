import { usePicoLab } from '@/context/PicoLabContext';
import { Logo } from './Logo';
import { 
  Beaker, 
  Trophy, 
  Gamepad2, 
  BookOpen, 
  Settings, 
  LogOut,
  ClipboardCheck,
  User,
  ChevronRight,
  Zap,
  Target,
  Swords
} from 'lucide-react';

export function StudentDashboard() {
  const { 
    setCurrentView, 
    setWorkspaceMode, 
    studentProfile, 
    setUserMode,
    scoreboard 
  } = usePicoLab();

  const studentScore = scoreboard.find(s => s.studentCode === studentProfile?.code);

  const handleModeSelect = (mode: 'practice' | 'exam' | 'play') => {
    setWorkspaceMode(mode);
    setCurrentView('workspace');
  };

  const handleLogout = () => {
    setUserMode(null);
    setCurrentView('auth');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="small" />
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('scoreboard')}
              className="p-2 rounded-lg hover:bg-muted transition-colors relative"
            >
              <Trophy size={20} className="text-primary" />
              {studentScore && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-mono">
                  {studentScore.points}
                </span>
              )}
            </button>
            <button 
              onClick={() => setCurrentView('profile')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Settings size={20} className="text-muted-foreground" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <LogOut size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="text-primary">{studentProfile?.name || 'Student'}</span>
          </h1>
          <p className="text-muted-foreground">
            Ready to build some circuits? Choose a mode to get started.
          </p>
        </div>

        {/* Quick Stats */}
        {studentScore && (
          <div className="grid grid-cols-4 gap-4 mb-8 fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="text-2xl font-bold text-primary font-mono">{studentScore.points}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="text-2xl font-bold text-secondary font-mono">{studentScore.practiceCircuits}</div>
              <div className="text-sm text-muted-foreground">Circuits Built</div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="text-2xl font-bold text-foreground font-mono">{studentScore.matchesWon}</div>
              <div className="text-sm text-muted-foreground">Matches Won</div>
            </div>
            <div className="bg-card rounded-xl p-4 border border-border">
              <div className="text-2xl font-bold text-foreground font-mono">{studentScore.accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
          </div>
        )}

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Practice Mode */}
          <button 
            onClick={() => handleModeSelect('practice')}
            className="mode-card text-left group fade-in"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Beaker size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                Practice Mode
                <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-muted-foreground text-sm">
                Build circuits freely with unlimited components. Get real-time feedback and hints.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-primary">
                <Zap size={14} />
                <span>All components unlocked</span>
              </div>
            </div>
          </button>

          {/* Exam Mode */}
          <button 
            onClick={() => handleModeSelect('exam')}
            className="mode-card text-left group fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ClipboardCheck size={28} className="text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                Exam Mode
                <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-muted-foreground text-sm">
                Join exams with a code. Complete tasks within the time limit to score points.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-secondary">
                <Target size={14} />
                <span>Enter exam code to start</span>
              </div>
            </div>
          </button>

          {/* Play Mode */}
          <button 
            onClick={() => handleModeSelect('play')}
            className="mode-card text-left group fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-warning/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Gamepad2 size={28} className="text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                Play Mode
                <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-muted-foreground text-sm">
                Compete against other students in real-time circuit building challenges!
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-warning">
                <Swords size={14} />
                <span>Match with opponents</span>
              </div>
            </div>
          </button>
        </div>

        {/* Secondary Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-in" style={{ animationDelay: '0.5s' }}>
          <button 
            onClick={() => setCurrentView('flashcards')}
            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <BookOpen size={24} className="text-muted-foreground" />
            </div>
            <div className="text-left">
              <h4 className="font-medium">Custom Flashcards</h4>
              <p className="text-sm text-muted-foreground">Create and review study cards</p>
            </div>
          </button>

          <button 
            onClick={() => {
              setUserMode('teacher');
              setCurrentView('dashboard');
            }}
            className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-secondary/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <User size={24} className="text-muted-foreground" />
            </div>
            <div className="text-left">
              <h4 className="font-medium">Switch to Teacher Mode</h4>
              <p className="text-sm text-muted-foreground">Create exams and view progress</p>
            </div>
          </button>
        </div>

        {/* Student Code Display */}
        {studentProfile && (
          <div className="mt-8 p-4 bg-muted/50 rounded-xl border border-border fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Student Code</p>
                <p className="font-mono text-lg text-primary">{studentProfile.code}</p>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs text-right">
                Share this code with your teacher to track your progress
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
