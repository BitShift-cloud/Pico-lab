import { usePicoLab } from '@/context/PicoLabContext';
import { Logo } from './Logo';
import { 
  ArrowLeft, 
  User, 
  Copy, 
  CheckCircle2, 
  School, 
  BookOpen,
  LogOut,
  Trash2
} from 'lucide-react';
import { useState } from 'react';

export function ProfilePage() {
  const { 
    setCurrentView, 
    studentProfile, 
    setStudentProfile,
    setUserMode,
    scoreboard
  } = usePicoLab();

  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    if (studentProfile?.code) {
      navigator.clipboard.writeText(studentProfile.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogout = () => {
    setUserMode(null);
    setCurrentView('auth');
  };

  const handleDeleteProfile = () => {
    if (confirm('Are you sure you want to delete your profile? This cannot be undone.')) {
      setStudentProfile(null);
      setUserMode(null);
      setCurrentView('auth');
    }
  };

  const studentScore = scoreboard.find(s => s.studentCode === studentProfile?.code);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="p-2 rounded-lg hover:bg-muted transition-colors mr-4"
          >
            <ArrowLeft size={20} />
          </button>
          <Logo size="small" />
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        {studentProfile ? (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <User size={40} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{studentProfile.name}</h2>
                  <p className="text-muted-foreground">
                    {studentProfile.class} • {studentProfile.division}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <School size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">School</p>
                    <p className="font-medium">{studentProfile.school}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <BookOpen size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Class & Division</p>
                    <p className="font-medium">{studentProfile.class} - {studentProfile.division}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Code */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="font-semibold mb-4">Your Student Code</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Share this code with your teacher to track your progress
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-muted rounded-lg font-mono text-primary">
                  {studentProfile.code}
                </code>
                <button
                  onClick={copyCode}
                  className="p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            {studentScore && (
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold mb-4">Your Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-primary font-mono">{studentScore.points}</p>
                    <p className="text-sm text-muted-foreground">Total Points</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold font-mono">{studentScore.practiceCircuits}</p>
                    <p className="text-sm text-muted-foreground">Circuits Built</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold text-secondary font-mono">{studentScore.matchesWon}</p>
                    <p className="text-sm text-muted-foreground">Matches Won</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold font-mono">{studentScore.accuracy}%</p>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-4 bg-muted rounded-xl hover:bg-muted/80 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>

              <button
                onClick={handleDeleteProfile}
                className="w-full flex items-center justify-center gap-2 p-4 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors"
              >
                <Trash2 size={18} />
                <span>Delete Profile</span>
              </button>
            </div>

            {/* Member since */}
            <p className="text-center text-sm text-muted-foreground">
              Member since {new Date(studentProfile.createdAt).toLocaleDateString()}
            </p>
          </div>
        ) : (
          <div className="text-center py-16">
            <User size={64} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Profile Found</h3>
            <p className="text-muted-foreground mb-6">
              Please log in to view your profile
            </p>
            <button
              onClick={() => setCurrentView('auth')}
              className="btn-primary"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
