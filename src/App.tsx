
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
import { PageProps } from './types';
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

  // Wrapper components to pass language prop to pages that don't accept it yet
  const JournalWithLanguage = () => <Journal language={currentLanguage} />;
  const RoutinesWithLanguage = () => <Routines language={currentLanguage} />;
  const KnowledgeWithLanguage = () => <Knowledge language={currentLanguage} />;
  const NotFoundWithLanguage = () => <NotFound language={currentLanguage} />;
  const UpgradeWithLanguage = () => <Upgrade language={currentLanguage} />;
  const SkinAnalysisWithLanguage = () => <SkinAnalysis language={currentLanguage} />;
  const AnalysisDetailWithLanguage = () => <AnalysisDetail language={currentLanguage} />;

  return (
    <AuthProvider>
      <div className={`min-h-screen bg-background ${currentLanguage === 'ar' ? 'rtl' : ''}`}>
        <Navigation language={currentLanguage} setLanguage={setCurrentLanguage} />
        
        <Routes>
          <Route path="/" element={<LandingPage language={currentLanguage} />} />
          <Route path="/dashboard" element={<Dashboard language={currentLanguage} />} />
          <Route path="/analysis" element={<SkinAnalysisWithLanguage />} />
          <Route path="/analysis/:id" element={<AnalysisDetailWithLanguage />} />
          <Route path="/journal" element={<JournalWithLanguage />} />
          <Route path="/routines" element={<RoutinesWithLanguage />} />
          <Route path="/knowledge" element={<KnowledgeWithLanguage />} />
          <Route path="/upgrade" element={<UpgradeWithLanguage />} />
          <Route path="*" element={<NotFoundWithLanguage />} />
        </Routes>
        
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
