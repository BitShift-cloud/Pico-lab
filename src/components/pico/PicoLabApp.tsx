import { usePicoLab } from '@/context/PicoLabContext';
import { AuthScreen } from './AuthScreen';
import { StudentDashboard } from './StudentDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { Workspace } from './Workspace';
import { FlashcardsPage } from './FlashcardsPage';
import { ScoreboardPage } from './ScoreboardPage';
import { ProfilePage } from './ProfilePage';

export function PicoLabApp() {
  const { currentView, userMode } = usePicoLab();

  // Render based on current view
  switch (currentView) {
    case 'auth':
      return <AuthScreen />;
    
    case 'dashboard':
      return userMode === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />;
    
    case 'workspace':
      return <Workspace />;
    
    case 'flashcards':
      return <FlashcardsPage />;
    
    case 'scoreboard':
      return <ScoreboardPage />;
    
    case 'profile':
      return <ProfilePage />;
    
    default:
      return <AuthScreen />;
  }
}
