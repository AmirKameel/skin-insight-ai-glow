
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { checkUserPremiumStatus, generatePersonalizedRoutines } from '@/services/analysisService';
import { useAuth } from '@/contexts/AuthContext';
import { Star, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PersonalizedRoutinesProps {
  analysisId?: string;
  language?: 'en' | 'ar';
}

const PersonalizedRoutines: React.FC<PersonalizedRoutinesProps> = ({ 
  analysisId, 
  language = 'en' 
}) => {
  const [isPremium, setIsPremium] = useState(false);
  const [routines, setRoutines] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Text content based on selected language
  const texts = {
    title: language === 'ar' ? 'روتين العناية المخصص' : 'Personalized Skincare Routine',
    subtitle: language === 'ar' 
      ? 'روتين عناية بالبشرة مصمم خصيصًا لحالة بشرتك الفريدة'
      : 'Skincare routine tailored specifically to your unique skin condition',
    morning: language === 'ar' ? 'روتين الصباح' : 'Morning Routine',
    night: language === 'ar' ? 'روتين المساء' : 'Evening Routine',
    premiumRequired: language === 'ar'
      ? 'روتين العناية المخصص متاح فقط للمستخدمين المميزين.'
      : 'Personalized routines are available only for premium users.',
    upgradeButton: language === 'ar' ? 'ترقية' : 'Upgrade',
    loading: language === 'ar' ? 'جاري تحميل الروتين المخصص...' : 'Loading your personalized routine...',
  };

  useEffect(() => {
    if (user?.id) {
      checkUserPremiumStatus(user.id)
        .then(status => {
          setIsPremium(status);
          if (status) {
            loadRoutines();
          }
        })
        .catch(err => console.error('Error checking premium status:', err));
    }
  }, [user]);

  const loadRoutines = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const result = await generatePersonalizedRoutines(user.id, analysisId);
      setRoutines(result);
    } catch (error) {
      console.error('Error loading routines:', error);
    } finally {
      setLoading(false);
    }
  };

  // If user is not premium, show upgrade prompt
  if (!isPremium) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="bg-muted/50 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Calendar className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{texts.title}</h3>
            <p className="text-muted-foreground mb-6">{texts.premiumRequired}</p>
            <a href="/upgrade" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              {texts.upgradeButton}
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If loading
  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center p-3 bg-muted rounded-full mb-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{texts.title}</h3>
            <p className="text-muted-foreground">{texts.loading}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If routines are loaded
  if (routines) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold">{texts.title}</h3>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            </div>
            <p className="text-muted-foreground">{texts.subtitle}</p>
          </div>

          <Tabs defaultValue="morning">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="morning" className="flex-1">
                {texts.morning}
              </TabsTrigger>
              <TabsTrigger value="night" className="flex-1">
                {texts.night}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="morning" className="mt-0">
              <ul className="space-y-4">
                {routines.morning.map((step: any, i: number) => (
                  <li key={i} className="relative pl-8 border-l-2 border-l-primary/20 pb-4">
                    <div className="absolute top-0 left-[-9px] w-4 h-4 bg-background rounded-full border-2 border-primary"></div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{i + 1}. {step.step}</span>
                        <Badge variant="outline">{step.product}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="night" className="mt-0">
              <ul className="space-y-4">
                {routines.evening.map((step: any, i: number) => (
                  <li key={i} className="relative pl-8 border-l-2 border-l-primary/20 pb-4">
                    <div className="absolute top-0 left-[-9px] w-4 h-4 bg-background rounded-full border-2 border-primary"></div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{i + 1}. {step.step}</span>
                        <Badge variant="outline">{step.product}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default PersonalizedRoutines;
