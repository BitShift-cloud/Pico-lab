import { useState } from 'react';
import { usePicoLab } from '@/context/PicoLabContext';
import { X, Hash, Clock, AlertCircle } from 'lucide-react';

interface ExamJoinModalProps {
  onClose: () => void;
}

export function ExamJoinModal({ onClose }: ExamJoinModalProps) {
  const { exams, setActiveExam, setExamTimeRemaining, setExamStartTime, addFeedback, submissions, studentProfile } = usePicoLab();
  const [examCode, setExamCode] = useState('');
  const [error, setError] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const code = examCode.toUpperCase().trim();
    
    const exam = exams.find(e => e.code === code);
    
    if (!exam) {
      setError('Invalid exam code. Please check and try again.');
      return;
    }

    // FIXED: Proper date comparison
    const validUntil = new Date(exam.validUntil);
    const now = new Date();
    
    if (validUntil.getTime() < now.getTime()) {
      setError('This exam has expired and is no longer available.');
      return;
    }

    if (!exam.active) {
      setError('This exam is no longer active.');
      return;
    }

    // Check if student already submitted this exam
    if (studentProfile) {
      const alreadySubmitted = submissions.some(
        s => s.examCode === code && s.studentCode === studentProfile.code
      );
      if (alreadySubmitted) {
        setError('You have already submitted this exam.');
        return;
      }
    }

    // FIXED: Set start time immediately for accurate timer
    const startTime = Date.now();
    setActiveExam(exam);
    setExamStartTime(startTime);
    setExamTimeRemaining(exam.timeLimit);
    
    addFeedback('success', `Joined exam: ${exam.title}`);
    addFeedback('info', `You have ${Math.floor(exam.timeLimit / 60)} minutes to complete the task`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-md scale-in shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Join Exam</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleJoin} className="p-6 space-y-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <Hash size={32} className="text-secondary" />
            </div>
            <p className="text-muted-foreground">
              Enter the 6-digit code provided by your teacher
            </p>
          </div>

          <div>
            <input
              type="text"
              value={examCode}
              onChange={(e) => {
                setExamCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="Enter exam code"
              className="input-field text-center text-2xl tracking-widest font-mono"
              maxLength={6}
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-secondary flex-1"
              disabled={examCode.length !== 6}
            >
              Join Exam
            </button>
          </div>

          <div className="flex items-center gap-2 justify-center text-xs text-muted-foreground">
            <Clock size={12} />
            <span>Timer starts immediately when you join</span>
          </div>
        </form>
      </div>
    </div>
  );
}
