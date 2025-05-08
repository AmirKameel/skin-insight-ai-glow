
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
import './App.css';

// Create interfaces to ensure all pages accept language prop
interface PageProps {
  language: 'en' | 'ar';
}

// Wrap non-compliant components to accept language prop
const LandingPageWrapper = ({ language }: PageProps) => <LandingPage language={language} />;
const SkinAnalysisWrapper = ({ language }: PageProps) => <SkinAnalysis language={language} />;
const AnalysisDetailWrapper = ({ language }: PageProps) => <AnalysisDetail language={language} />;
const DashboardWrapper = ({ language }: PageProps) => <Dashboard language={language} />;
const JournalWrapper = ({ language }: PageProps) => <Journal language={language} />;
const RoutinesWrapper = ({ language }: PageProps) => <Routines language={language} />;
const KnowledgeWrapper = ({ language }: PageProps) => <Knowledge language={language} />;
const UpgradeWrapper = ({ language }: PageProps) => <Upgrade language={language} />;
const NotFoundWrapper = ({ language }: PageProps) => <NotFound language={language} />;

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
          <Route path="/" element={<LandingPageWrapper language={currentLanguage} />} />
          <Route path="/dashboard" element={<DashboardWrapper language={currentLanguage} />} />
          <Route path="/analysis" element={<SkinAnalysisWrapper language={currentLanguage} />} />
          <Route path="/analysis/:id" element={<AnalysisDetailWrapper language={currentLanguage} />} />
          <Route path="/journal" element={<JournalWrapper language={currentLanguage} />} />
          <Route path="/routines" element={<RoutinesWrapper language={currentLanguage} />} />
          <Route path="/knowledge" element={<KnowledgeWrapper language={currentLanguage} />} />
          <Route path="/upgrade" element={<UpgradeWrapper language={currentLanguage} />} />
          <Route path="*" element={<NotFoundWrapper language={currentLanguage} />} />
        </Routes>
        
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;
