
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import LandingPage from "@/components/LandingPage";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import Dashboard from "@/components/dashboard/Dashboard";
import SkinAnalysis from "@/components/analysis/SkinAnalysis";
import AnalysisDetail from "@/components/analysis/AnalysisDetail";
import Journal from "./pages/Journal";
import Knowledge from "./pages/Knowledge";
import Routines from "./pages/Routines";
import NotFound from "./pages/NotFound";
import Upgrade from "./pages/Upgrade";
import { useAuth } from "@/contexts/AuthContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // Show nothing while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-skin-blue/10 p-4">
        <div className="animate-pulse text-center">
          <div className="h-10 w-10 bg-primary/30 rounded-full mx-auto mb-4"></div>
          <div className="h-4 w-32 bg-primary/20 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auth wrapper component
const AuthenticatedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  // Redirect authenticated users away from auth pages
  const RedirectIfAuthenticated = ({ children }: { children: React.ReactNode }) => {
    if (loading) return null;
    if (user) return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={
        <RedirectIfAuthenticated>
          <div className="min-h-screen flex items-center justify-center bg-skin-blue/10 p-4">
            <LoginForm />
          </div>
        </RedirectIfAuthenticated>
      } />
      <Route path="/register" element={
        <RedirectIfAuthenticated>
          <div className="min-h-screen flex items-center justify-center bg-skin-blue/10 p-4">
            <RegisterForm />
          </div>
        </RedirectIfAuthenticated>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Dashboard />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/analysis" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <SkinAnalysis />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/analysis/:id" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <AnalysisDetail />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/journal" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Journal />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/knowledge" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Knowledge />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/routines" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Routines />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="/upgrade" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Upgrade />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
