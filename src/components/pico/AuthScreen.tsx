import { useState } from 'react';
import { usePicoLab } from '@/context/PicoLabContext';
import { Logo } from './Logo';
import { GraduationCap, Presentation, Zap, Cpu, CircuitBoard, Activity } from 'lucide-react';

export function AuthScreen() {
  const { setUserMode, setCurrentView, studentProfile, setStudentProfile, generateStudentCode } = usePicoLab();
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    division: '',
    school: '',
  });

  const handleStudentLogin = () => {
    if (studentProfile) {
      setUserMode('student');
      setCurrentView('dashboard');
    } else {
      setShowStudentForm(true);
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile = {
      code: generateStudentCode(),
      name: formData.name,
      class: formData.class,
      division: formData.division,
      school: formData.school,
      createdAt: new Date(),
    };
    setStudentProfile(newProfile);
    setUserMode('student');
    setCurrentView('dashboard');
  };

  const handleTeacherLogin = () => {
    setUserMode('teacher');
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-background circuit-pattern flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 opacity-10">
          <CircuitBoard size={200} className="text-primary animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-10">
          <Cpu size={150} className="text-secondary float" />
        </div>
        <div className="absolute top-1/2 left-10 opacity-5">
          <Activity size={100} className="text-primary" />
        </div>
      </div>

      <div className="w-full max-w-lg fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="large" />
          </div>
          <p className="text-muted-foreground text-lg">
            Virtual Electronics Lab for the Next Generation
          </p>
        </div>

        {!showStudentForm ? (
          <div className="space-y-4">
            <button
              onClick={handleStudentLogin}
              className="w-full mode-card group"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <GraduationCap size={32} className="text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    Enter as Student
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Practice circuits, take exams, and compete with peers
                  </p>
                </div>
                <Zap className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>

            <button
              onClick={handleTeacherLogin}
              className="w-full mode-card group"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-xl bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                  <Presentation size={32} className="text-secondary" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    Enter as Teacher
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Create exams, track progress, and manage students
                  </p>
                </div>
                <Zap className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          </div>
        ) : (
          <div className="bg-card rounded-xl p-6 border border-border scale-in">
            <h3 className="text-xl font-semibold mb-4">Create Student Profile</h3>
            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Class
                  </label>
                  <input
                    type="text"
                    value={formData.class}
                    onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., 10th"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Division
                  </label>
                  <input
                    type="text"
                    value={formData.division}
                    onChange={(e) => setFormData(prev => ({ ...prev, division: e.target.value }))}
                    className="input-field"
                    placeholder="e.g., A"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  School
                </label>
                <input
                  type="text"
                  value={formData.school}
                  onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                  className="input-field"
                  placeholder="Enter school name"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStudentForm(false)}
                  className="btn-ghost flex-1"
                >
                  Back
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        )}

        <p className="text-center text-muted-foreground text-xs mt-8">
          © {new Date().getFullYear()} BitShift Technologies. Empowering the next generation of engineers.
        </p>
      </div>
    </div>
  );
}
