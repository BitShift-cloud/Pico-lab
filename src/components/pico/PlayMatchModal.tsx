import { useState, useEffect } from 'react';
import { usePicoLab } from '@/context/PicoLabContext';
import { X, Users, UserPlus, Loader2, Swords, Trophy } from 'lucide-react';

interface PlayMatchModalProps {
  onClose: () => void;
}

const OPPONENT_NAMES = [
  'CircuitMaster_42',
  'VoltageViking',
  'LED_Legend',
  'ResistorRex',
  'CapacitorKing',
  'ArduinoAce',
  'WireWizard',
  'OhmObserver',
];

const MATCH_TASKS = [
  'Build a circuit to blink two LEDs alternately',
  'Create a working push-button controlled LED circuit',
  'Build a traffic light sequence with 3 LEDs',
  'Connect a potentiometer to control LED brightness',
];

export function PlayMatchModal({ onClose }: PlayMatchModalProps) {
  const { matchState, setMatchState, addFeedback, resetMatchState } = usePicoLab();
  const [mode, setMode] = useState<'select' | 'searching' | 'found' | 'friend'>('select');
  const [friendCode, setFriendCode] = useState('');
  const [countdown, setCountdown] = useState(5);

  // FIXED: Reset modal state when opening
  useEffect(() => {
    setMode('select');
    setFriendCode('');
    setCountdown(5);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (mode === 'searching') {
      timer = setTimeout(() => {
        const opponent = OPPONENT_NAMES[Math.floor(Math.random() * OPPONENT_NAMES.length)];
        const task = MATCH_TASKS[Math.floor(Math.random() * MATCH_TASKS.length)];
        
        setMatchState({
          status: 'matched',
          opponentName: opponent,
          task,
          timeLimit: 300,
        });
        setMode('found');
        setCountdown(5);
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [mode, setMatchState]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (mode === 'found' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }

    if (mode === 'found' && countdown === 0) {
      setMatchState(prev => ({
        ...prev,
        status: 'playing',
        startTime: new Date(),
      }));
      addFeedback('info', `Match started! Task: ${matchState.task}`);
      onClose();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [mode, countdown, setMatchState, matchState.task, addFeedback, onClose]);

  const handleAnonymousMatch = () => {
    setMode('searching');
    setMatchState({ status: 'searching' });
  };

  const handleFriendMatch = () => {
    if (friendCode.trim()) {
      const task = MATCH_TASKS[Math.floor(Math.random() * MATCH_TASKS.length)];
      setMatchState({
        status: 'matched',
        opponentName: `Friend_${friendCode.slice(-4)}`,
        task,
        timeLimit: 300,
      });
      setMode('found');
      setCountdown(5);
    }
  };

  const handleCancel = () => {
    // FIXED: Properly reset match state when cancelling
    resetMatchState();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-md scale-in shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Swords size={20} className="text-warning" />
            Play Mode
          </h2>
          <button 
            onClick={handleCancel}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {mode === 'select' && (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground mb-6">
                Compete against other students in real-time circuit building challenges!
              </p>

              <button
                onClick={handleAnonymousMatch}
                className="w-full mode-card group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-warning/10 group-hover:bg-warning/20 transition-colors">
                    <Users size={24} className="text-warning" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold">Anonymous Match</h3>
                    <p className="text-sm text-muted-foreground">
                      Get matched with a random opponent
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setMode('friend')}
                className="w-full mode-card group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <UserPlus size={24} className="text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-semibold">Play with Friend</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter a friend's student code
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {mode === 'friend' && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <UserPlus size={48} className="mx-auto text-primary mb-2" />
                <p className="text-muted-foreground">Enter your friend's student code</p>
              </div>
              
              <input
                type="text"
                value={friendCode}
                onChange={(e) => setFriendCode(e.target.value)}
                placeholder="BS-PL-ST-XXXX-XXXXXX"
                className="input-field text-center font-mono"
              />

              <div className="flex gap-3">
                <button onClick={() => setMode('select')} className="btn-ghost flex-1">
                  Back
                </button>
                <button 
                  onClick={handleFriendMatch} 
                  className="btn-primary flex-1"
                  disabled={!friendCode.trim()}
                >
                  Challenge
                </button>
              </div>
            </div>
          )}

          {mode === 'searching' && (
            <div className="text-center py-8">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <Loader2 size={96} className="animate-spin text-warning" />
                <Users size={32} className="absolute inset-0 m-auto text-warning" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Finding Match...</h3>
              <p className="text-muted-foreground">
                Searching for an opponent at your skill level
              </p>
              <button 
                onClick={handleCancel}
                className="btn-ghost mt-4"
              >
                Cancel
              </button>
            </div>
          )}

          {mode === 'found' && (
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🧑‍💻</span>
                  </div>
                  <p className="text-sm font-medium">You</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <Swords size={32} className="text-warning mb-1" />
                  <span className="text-xs text-muted-foreground">VS</span>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <p className="text-sm font-medium">{matchState.opponentName}</p>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-4 mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Task</p>
                <p className="font-medium">{matchState.task}</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Match starts in</p>
                <div className="text-6xl font-bold text-warning font-mono">
                  {countdown}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tips section */}
        {mode === 'select' && (
          <div className="px-6 pb-6">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Trophy size={20} className="inline-block text-warning mb-1" />
              <p className="text-sm text-muted-foreground">
                Win matches to earn points and climb the leaderboard!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
