import { usePicoLab } from '@/context/PicoLabContext';
import { Logo } from './Logo';
import { ArrowLeft, Trophy, Medal, Crown, Zap, Target, Clock } from 'lucide-react';

export function ScoreboardPage() {
  const { setCurrentView, scoreboard, studentProfile } = usePicoLab();

  const sortedScoreboard = [...scoreboard].sort((a, b) => b.points - a.points);
  const currentUserRank = sortedScoreboard.findIndex(s => s.studentCode === studentProfile?.code) + 1;
  const currentUser = scoreboard.find(s => s.studentCode === studentProfile?.code);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown size={20} className="text-yellow-400" />;
      case 2: return <Medal size={20} className="text-gray-400" />;
      case 3: return <Medal size={20} className="text-amber-600" />;
      default: return <span className="text-muted-foreground font-mono">{rank}</span>;
    }
  };

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

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Trophy size={32} className="text-warning" />
          <div>
            <h1 className="text-3xl font-bold">Scoreboard</h1>
            <p className="text-muted-foreground">See how you rank against other students</p>
          </div>
        </div>

        {/* Current User Stats */}
        {currentUser && (
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 mb-8 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                  🧑‍💻
                </div>
                <div>
                  <h3 className="text-xl font-bold">{currentUser.name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">{currentUser.studentCode}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Your Rank</p>
                <p className="text-4xl font-bold text-primary">#{currentUserRank || '-'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <Zap size={20} className="mx-auto text-warning mb-1" />
                <p className="text-2xl font-bold font-mono">{currentUser.points}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <Trophy size={20} className="mx-auto text-secondary mb-1" />
                <p className="text-2xl font-bold font-mono">{currentUser.matchesWon}</p>
                <p className="text-xs text-muted-foreground">Wins</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <Target size={20} className="mx-auto text-primary mb-1" />
                <p className="text-2xl font-bold font-mono">{currentUser.accuracy}%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <span className="text-xl block mb-1">🔌</span>
                <p className="text-2xl font-bold font-mono">{currentUser.practiceCircuits}</p>
                <p className="text-xs text-muted-foreground">Circuits</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3 text-center">
                <Clock size={20} className="mx-auto text-muted-foreground mb-1" />
                <p className="text-2xl font-bold font-mono">{currentUser.timeSpent}</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Leaderboard</h2>
          </div>

          {sortedScoreboard.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Trophy size={48} className="mx-auto mb-4 opacity-50" />
              <p>No scores yet. Start playing to appear on the leaderboard!</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sortedScoreboard.map((entry, index) => {
                const isCurrentUser = entry.studentCode === studentProfile?.code;
                
                return (
                  <div
                    key={entry.studentCode}
                    className={`flex items-center gap-4 p-4 ${
                      isCurrentUser ? 'bg-primary/5' : 'hover:bg-muted/50'
                    } transition-colors`}
                  >
                    <div className="w-8 flex justify-center">
                      {getRankIcon(index + 1)}
                    </div>
                    
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                      {index < 3 ? (
                        <span className="text-lg">
                          {index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        <span className="text-sm">🧑‍💻</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isCurrentUser ? 'text-primary' : ''}`}>
                        {entry.name}
                        {isCurrentUser && <span className="ml-2 text-xs">(You)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.matchesWon} wins • {entry.practiceCircuits} circuits
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold font-mono text-primary">{entry.points}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
