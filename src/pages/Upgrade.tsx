
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Upgrade = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUpgrade = async (plan: string) => {
    setLoading(true);
    
    // In a real app, this would integrate with Stripe or another payment processor
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Subscription Activated",
      description: `Thank you for subscribing to our ${plan} plan!`,
    });
    
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 md:ml-64">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Upgrade Your Skin Journey</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Get access to premium features, personalized recommendations, and expert consultations to achieve your best skin.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Basic Plan */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle>Basic</CardTitle>
              <CardDescription>Essential skin analysis tools</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">Free</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Skin type analysis</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Basic product recommendations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>3 analysis scans per month</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Community support forum access</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="outline" disabled>
                Current Plan
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Plan */}
          <Card className="relative overflow-hidden border-primary shadow-lg">
            <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium">
              MOST POPULAR
            </div>
            <CardHeader>
              <CardTitle className="flex items-center">
                Premium <Star className="ml-2 h-5 w-5 text-amber-400" />
              </CardTitle>
              <CardDescription>Advanced skin analysis & recommendations</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">$19.99</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Everything in Basic</span>
                </li>
                <li className="flex items-start font-medium">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Unlimited skin analyses</span>
                </li>
                <li className="flex items-start font-medium">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Personalized skincare routines</span>
                </li>
                <li className="flex items-start font-medium">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Premium product recommendations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Skin progress tracking</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Email consultation with specialist</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => handleUpgrade('Premium')}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Upgrade to Premium'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Professional Plan */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center">
                Professional <Star className="ml-2 h-5 w-5 text-amber-400" />
                <Star className="h-5 w-5 text-amber-400" />
              </CardTitle>
              <CardDescription>Professional-grade analysis & consultation</CardDescription>
              <div className="mt-2">
                <span className="text-3xl font-bold">$49.99</span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Everything in Premium</span>
                </li>
                <li className="flex items-start font-medium">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Monthly video consultation with dermatologist</span>
                </li>
                <li className="flex items-start font-medium">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Custom formulation recommendations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Early access to new AI features</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Product discounts from partner brands</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleUpgrade('Professional')}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Upgrade to Professional'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">More Premium Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-lg border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Ingredient Analysis</h3>
              <p className="text-gray-600">
                Get detailed breakdown of product ingredients and how they affect your specific skin.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Skin Journal</h3>
              <p className="text-gray-600">
                Track your skin's progress over time with our advanced tracking tools.
              </p>
            </div>
            
            <div className="p-6 bg-white rounded-lg border">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-lg mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Get personalized advice from certified dermatologists and skincare experts.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 bg-gray-50 rounded-lg p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="bg-white p-4 rounded-md border">
              <h3 className="font-medium">Can I cancel my subscription at any time?</h3>
              <p className="text-gray-600 mt-2">Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period.</p>
            </div>
            
            <div className="bg-white p-4 rounded-md border">
              <h3 className="font-medium">How accurate are the AI skin analyses?</h3>
              <p className="text-gray-600 mt-2">Our AI technology has been trained on thousands of skin images and validated by dermatologists, achieving 95% accuracy in identifying common skin concerns.</p>
            </div>
            
            <div className="bg-white p-4 rounded-md border">
              <h3 className="font-medium">Can I switch between subscription plans?</h3>
              <p className="text-gray-600 mt-2">Yes, you can upgrade or downgrade your subscription at any time. Changes will take effect at the beginning of your next billing cycle.</p>
            </div>
            
            <div className="bg-white p-4 rounded-md border">
              <h3 className="font-medium">Is my data secure?</h3>
              <p className="text-gray-600 mt-2">Yes, we take data security very seriously. All your images and personal information are encrypted and securely stored. We never share your data with third parties without your explicit consent.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;
