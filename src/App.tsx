
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import SkinAnalysis from './components/analysis/SkinAnalysis';
import AnalysisDetail from './components/analysis/AnalysisDetail';
import Dashboard from './components/dashboard/Dashboard';
import Journal from './pages/Journal';
import Routines from './pages/Routines';
import Knowledge from './pages/Knowledge';
import NotFound from './pages/NotFound';
import Upgrade from './pages/Upgrade';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';
import { 
  PageProps, 
  SkinAnalysisProps, 
  AnalysisDetailProps, 
  JournalProps, 
  RoutinesProps, 
  KnowledgeProps,
  NotFoundProps,
  UpgradeProps
} from './types';
import './App.css';

function App() {
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>(
    (localStorage.getItem('preferredLanguage') as 'en' | 'ar') || 'en'
  );

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    if (currentLanguage === 'ar') {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
  }, [currentLanguage]);

  return (
    <AuthProvider>
      <div className={`min-h-screen bg-background ${currentLanguage === 'ar' ? 'rtl' : ''}`}>
        <Navigation language={currentLanguage} setLanguage={setCurrentLanguage} />
        
        <Routes>
          <Route path="/" element={<LandingPage language={currentLanguage} />} />
          <Route path="/dashboard" element={<Dashboard language={currentLanguage} />} />
          <Route path="/analysis" element={<SkinAnalysis language={currentLanguage} />} />
          <Route path="/analysis/:id" element={<AnalysisDetail language={currentLanguage} />} />
          <Route path="/journal" element={<Journal language={currentLanguage} />} />
          <Route path="/routines" element={<Routines language={currentLanguage} />} />
          <Route path="/knowledge" element={<Knowledge language={currentLanguage} />} />
          <Route path="/upgrade" element={<Upgrade language={currentLanguage} />} />
          <Route path="*" element={<NotFound language={currentLanguage} />} />
        </Routes>
        
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
