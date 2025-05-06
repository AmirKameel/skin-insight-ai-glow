import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Camera, Calendar, Activity, Shield, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white shadow-sm fixed top-0 left-0 z-20">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SkinInsight AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Button onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" /> Sign In
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden pt-16">
        <div className="absolute inset-0 skin-gradient opacity-30"></div>
        <div className="container mx-auto px-6 py-12 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SkinInsight AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-700 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Personalized skincare powered by AI. Upload a photo and receive custom recommendations for healthier, more radiant skin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link to={user ? "/dashboard" : "/register"}>Get Started</Link>
              </Button>
              <Button asChild variant="outline" className="text-lg px-8 py-6">
                <Link to="/learn-more">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-64 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-skin-blue/10">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Advanced Features for Your Skincare Journey
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-skin-peach flex items-center justify-center mb-4">
                <Camera className="text-skin-dark" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Skin Analysis</h3>
              <p className="text-gray-600">
                Upload your selfie and get detailed analysis of your skin condition with AI-powered insights.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-skin-green flex items-center justify-center mb-4">
                <Calendar className="text-skin-dark" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Custom Routines</h3>
              <p className="text-gray-600">
                Receive personalized skincare routines tailored to your unique skin needs and concerns.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-skin-purple flex items-center justify-center mb-4">
                <Activity className="text-skin-dark" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Track your skin's improvement over time with visual timelines and data-driven insights.
              </p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full bg-skin-blue flex items-center justify-center mb-4">
                <Shield className="text-skin-dark" size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Connect</h3>
              <p className="text-gray-600">
                Connect with dermatologists and skincare specialists for professional advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Upload Your Photo</h3>
              <p className="text-gray-600">
                Take a selfie or upload an existing photo of your skin in natural lighting.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Get AI Analysis</h3>
              <p className="text-gray-600">
                Our advanced AI analyzes your skin for concerns, issues, and overall health.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Follow Your Plan</h3>
              <p className="text-gray-600">
                Receive a personalized skincare routine and product recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 skin-gradient">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Your Skin Transformation Today
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have discovered the power of AI-driven skincare analysis and personalization.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link to={user ? "/dashboard" : "/register"} className="flex items-center gap-2">
              Get Started Now <ArrowRight size={20} />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-skin-dark text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4">SkinInsight AI</h3>
              <p className="text-gray-300 max-w-md">
                AI-powered skincare analysis and recommendations for healthier, happier skin.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                  <li><Link to="/careers" className="text-gray-300 hover:text-white">Careers</Link></li>
                  <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><Link to="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
                  <li><Link to="/guides" className="text-gray-300 hover:text-white">Guides</Link></li>
                  <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><Link to="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} SkinInsight AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
