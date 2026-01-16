import { useState } from 'react';
import { usePicoLab } from '@/context/PicoLabContext';
import { Logo } from './Logo';
import { 
  LogOut, 
  Plus, 
  ClipboardList, 
  Search, 
  Users,
  Clock,
  Hash,
  CheckCircle2,
  Copy,
  User,
  FileText,
  MessageSquare,
  X,
  Send
} from 'lucide-react';
import { componentLibrary } from '@/data/componentLibrary';
import { Exam, ExamSubmission } from '@/types/picolab';

export function TeacherDashboard() {
  const { 
    setUserMode, 
    setCurrentView, 
    exams, 
    setExams,
    submissions,
    setSubmissions,
    scoreboard 
  } = usePicoLab();

  const [showCreateExam, setShowCreateExam] = useState(false);
  const [studentCodeSearch, setStudentCodeSearch] = useState('');
  const [searchedStudent, setSearchedStudent] = useState<typeof scoreboard[0] | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<ExamSubmission | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const [examForm, setExamForm] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    validUntil: '',
    components: [] as string[],
  });

  const handleLogout = () => {
    setUserMode(null);
    setCurrentView('auth');
  };

  const generateExamCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateExam = (e: React.FormEvent) => {
    e.preventDefault();
    const newExam: Exam = {
      id: Date.now().toString(),
      code: generateExamCode(),
      title: examForm.title,
      description: examForm.description,
      timeLimit: examForm.timeLimit * 60,
      validUntil: new Date(examForm.validUntil),
      components: examForm.components as any[],
      createdBy: 'teacher',
      active: true,
    };
    setExams(prev => [...prev, newExam]);
    setShowCreateExam(false);
    setExamForm({ title: '', description: '', timeLimit: 30, validUntil: '', components: [] });
  };

  const handleSearchStudent = () => {
    const student = scoreboard.find(s => s.studentCode === studentCodeSearch);
    setSearchedStudent(student || null);
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleComponent = (type: string) => {
    setExamForm(prev => ({
      ...prev,
      components: prev.components.includes(type)
        ? prev.components.filter(c => c !== type)
        : [...prev.components, type]
    }));
  };

  const handleEndExam = (examId: string) => {
    setExams(prev => prev.map(e => 
      e.id === examId ? { ...e, active: false } : e
    ));
  };

  const handleAddFeedback = () => {
    if (!viewingSubmission || !feedbackText.trim()) return;
    
    setSubmissions(prev => prev.map(s => 
      s.id === viewingSubmission.id 
        ? { ...s, feedback: feedbackText, score: 85 } // Mock score
        : s
    ));
    
    setFeedbackText('');
    setViewingSubmission(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="small" />
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground px-3 py-1 rounded-full bg-secondary/10 text-secondary">
              Teacher Mode
            </span>
            <button 
              onClick={() => {
                setUserMode('student');
                setCurrentView('dashboard');
              }}
              className="btn-ghost text-sm"
            >
              <User size={16} className="mr-2" />
              Switch to Student
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exam Management */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Exam Management</h2>
              <button 
                onClick={() => setShowCreateExam(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                Create Exam
              </button>
            </div>

            {/* Create Exam Form */}
            {showCreateExam && (
              <div className="bg-card rounded-xl p-6 border border-border scale-in">
                <h3 className="text-lg font-semibold mb-4">Create New Exam</h3>
                <form onSubmit={handleCreateExam} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Exam Title
                    </label>
                    <input
                      type="text"
                      value={examForm.title}
                      onChange={(e) => setExamForm(prev => ({ ...prev, title: e.target.value }))}
                      className="input-field"
                      placeholder="e.g., LED Circuit Basics"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Task Description
                    </label>
                    <textarea
                      value={examForm.description}
                      onChange={(e) => setExamForm(prev => ({ ...prev, description: e.target.value }))}
                      className="input-field min-h-[100px]"
                      placeholder="Describe what students need to build..."
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Time Limit (minutes)
                      </label>
                      <input
                        type="number"
                        value={examForm.timeLimit}
                        onChange={(e) => setExamForm(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                        className="input-field"
                        min={5}
                        max={120}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Valid Until
                      </label>
                      <input
                        type="datetime-local"
                        value={examForm.validUntil}
                        onChange={(e) => setExamForm(prev => ({ ...prev, validUntil: e.target.value }))}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Allowed Components
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {componentLibrary.map(comp => (
                        <button
                          key={comp.type}
                          type="button"
                          onClick={() => toggleComponent(comp.type)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            examForm.components.includes(comp.type)
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80'
                          }`}
                        >
                          {comp.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateExam(false)}
                      className="btn-ghost flex-1"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary flex-1">
                      Generate Exam Code
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Existing Exams */}
            <div className="space-y-4">
              {exams.length === 0 ? (
                <div className="bg-card rounded-xl p-8 border border-border text-center">
                  <ClipboardList size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Exams Yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Create your first exam to get started
                  </p>
                </div>
              ) : (
                exams.map(exam => {
                  const examSubmissions = submissions.filter(s => s.examCode === exam.code);
                  const isExpired = new Date(exam.validUntil) < new Date();
                  
                  return (
                    <div 
                      key={exam.id}
                      className={`bg-card rounded-xl p-5 border ${isExpired || !exam.active ? 'border-destructive/30 opacity-60' : 'border-border'}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{exam.title}</h4>
                          <p className="text-sm text-muted-foreground">{exam.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(exam.code)}
                            className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                          >
                            <Hash size={16} className="text-primary" />
                            <span className="font-mono font-bold">{exam.code}</span>
                            {copiedCode === exam.code ? (
                              <CheckCircle2 size={16} className="text-secondary" />
                            ) : (
                              <Copy size={16} className="text-muted-foreground" />
                            )}
                          </button>
                          {exam.active && !isExpired && (
                            <button
                              onClick={() => handleEndExam(exam.id)}
                              className="px-3 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 text-sm"
                            >
                              End Exam
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {exam.timeLimit / 60} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {examSubmissions.length} submissions
                        </span>
                        {(isExpired || !exam.active) && (
                          <span className="text-destructive">{isExpired ? 'Expired' : 'Ended'}</span>
                        )}
                      </div>

                      {/* Submissions list */}
                      {examSubmissions.length > 0 && (
                        <div className="border-t border-border pt-3 mt-3">
                          <p className="text-sm font-medium mb-2">Submissions:</p>
                          <div className="space-y-2">
                            {examSubmissions.map(sub => (
                              <div 
                                key={sub.id}
                                className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs">{sub.studentCode}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(sub.submittedAt).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {sub.feedback && (
                                    <span className="text-xs text-secondary">✓ Graded</span>
                                  )}
                                  <button
                                    onClick={() => {
                                      setViewingSubmission(sub);
                                      setFeedbackText(sub.feedback || '');
                                    }}
                                    className="text-xs text-primary hover:underline flex items-center gap-1"
                                  >
                                    <FileText size={12} />
                                    View
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Student Progress Lookup */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Student Progress</h2>
            
            <div className="bg-card rounded-xl p-6 border border-border">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Enter Student Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={studentCodeSearch}
                  onChange={(e) => setStudentCodeSearch(e.target.value)}
                  className="input-field flex-1"
                  placeholder="BS-PL-ST-XXXX-XXXXXX"
                />
                <button 
                  onClick={handleSearchStudent}
                  className="btn-primary px-4"
                >
                  <Search size={18} />
                </button>
              </div>
            </div>

            {searchedStudent && (
              <div className="bg-card rounded-xl p-6 border border-border scale-in">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={24} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{searchedStudent.name}</h4>
                    <p className="text-xs text-muted-foreground font-mono">{searchedStudent.studentCode}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Total Points</span>
                    <span className="font-bold text-primary font-mono">{searchedStudent.points}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Circuits Built</span>
                    <span className="font-bold font-mono">{searchedStudent.practiceCircuits}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Matches Won</span>
                    <span className="font-bold font-mono">{searchedStudent.matchesWon}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Accuracy</span>
                    <span className="font-bold text-secondary font-mono">{searchedStudent.accuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Time Spent</span>
                    <span className="font-bold font-mono">{searchedStudent.timeSpent} min</span>
                  </div>
                </div>

                {/* Simple progress visualization */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Exam Scores</p>
                  {searchedStudent.examScores.length > 0 ? (
                    <div className="space-y-2">
                      {searchedStudent.examScores.map((score, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${score.score}%` }}
                            />
                          </div>
                          <span className="text-xs font-mono w-12">{score.score}%</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No exam scores yet</p>
                  )}
                </div>
              </div>
            )}

            {studentCodeSearch && !searchedStudent && (
              <div className="text-center text-muted-foreground text-sm py-4">
                No student found with that code
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submission View Modal */}
      {viewingSubmission && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">Submission Details</h3>
              <button 
                onClick={() => setViewingSubmission(null)}
                className="p-1 hover:bg-muted rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Student:</span>
                  <p className="font-mono">{viewingSubmission.studentCode}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Submitted:</span>
                  <p>{new Date(viewingSubmission.submittedAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Components Used:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {viewingSubmission.components.map(comp => (
                    <span key={comp.id} className="px-2 py-1 bg-muted rounded text-xs">
                      {comp.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Connections:</span>
                <p className="text-sm mt-1">{viewingSubmission.connections.length} wire connections made</p>
              </div>

              <div className="border-t border-border pt-4">
                <label className="block text-sm font-medium mb-2">
                  <MessageSquare size={16} className="inline mr-1" />
                  Teacher Feedback
                </label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="input-field min-h-[100px]"
                  placeholder="Add feedback for the student..."
                />
                <button 
                  onClick={handleAddFeedback}
                  className="btn-primary mt-2 flex items-center gap-2"
                  disabled={!feedbackText.trim()}
                >
                  <Send size={16} />
                  Save Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
