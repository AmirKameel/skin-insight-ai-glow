
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import LandingPage from "@/components/LandingPage";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import Dashboard from "@/components/dashboard/Dashboard";
import SkinAnalysis from "@/components/analysis/SkinAnalysis";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={
                <div className="min-h-screen flex items-center justify-center bg-skin-blue/10 p-4">
                  <LoginForm />
                </div>
              } />
              <Route path="/register" element={
                <div className="min-h-screen flex items-center justify-center bg-skin-blue/10 p-4">
                  <RegisterForm />
                </div>
              } />
              <Route path="/dashboard" element={
                <>
                  <Navigation />
                  <Dashboard />
                </>
              } />
              <Route path="/analysis" element={
                <>
                  <Navigation />
                  <SkinAnalysis />
                </>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
