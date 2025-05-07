
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, Calendar, Star, RefreshCw, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { generatePersonalizedRoutines, checkUserPremiumStatus } from '@/services/analysisService';

interface PersonalizedRoutinesProps {
  analysisId?: string;
  language?: 'en' | 'ar';
}

interface RoutineStep {
  en: string;
  ar: string;
}

interface Routines {
  morning: RoutineStep[];
  evening: RoutineStep[];
  weekly: RoutineStep[];
}

const PersonalizedRoutines: React.FC<PersonalizedRoutinesProps> = ({ 
  analysisId,
  language = 'en'
}) => {
  const [routines, setRoutines] = useState<Routines | null>(null);
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      loadData();
    }
  }, [user, analysisId]);

  const loadData = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Check premium status
      const premiumStatus = await checkUserPremiumStatus(user.id);
      setIsPremium(premiumStatus);
      
      // Get routines
      const routineData = await generatePersonalizedRoutines(user.id, analysisId);
      
      // Convert to multilingual format
      const multilingualRoutines: Routines = {
        morning: routineData.morning.map(item => ({
          en: item,
          ar: translateToArabic(item) // In a real app, this would use a translation service
        })),
        evening: routineData.evening.map(item => ({
          en: item,
          ar: translateToArabic(item)
        })),
        weekly: routineData.weekly.map(item => ({
          en: item,
          ar: translateToArabic(item)
        }))
      };
      
      setRoutines(multilingualRoutines);
    } catch (error) {
      console.error('Error loading routines:', error);
      toast({
        variant: "destructive",
        title: language === 'ar' ? "حدث خطأ" : "Error",
        description: language === 'ar' ? "فشل في تحميل الروتين المخصص" : "Failed to load personalized routines"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!user?.id) return;
    
    try {
      setIsRefreshing(true);
      
      // Get updated routines
      const routineData = await generatePersonalizedRoutines(user.id, analysisId);
      
      // Convert to multilingual format
      const multilingualRoutines: Routines = {
        morning: routineData.morning.map(item => ({
          en: item,
          ar: translateToArabic(item)
        })),
        evening: routineData.evening.map(item => ({
          en: item,
          ar: translateToArabic(item)
        })),
        weekly: routineData.weekly.map(item => ({
          en: item,
          ar: translateToArabic(item)
        }))
      };
      
      setRoutines(multilingualRoutines);
      
      toast({
        title: language === 'ar' ? "تم التحديث" : "Updated",
        description: language === 'ar' ? "تم تحديث الروتين المخصص" : "Your personalized routine has been updated"
      });
    } catch (error) {
      console.error('Error refreshing routines:', error);
      toast({
        variant: "destructive",
        title: language === 'ar' ? "حدث خطأ" : "Error",
        description: language === 'ar' ? "فشل في تحديث الروتين" : "Failed to update routines"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Simple mock translation function - in a real app you would use a proper translation service
  const translateToArabic = (text: string): string => {
    // This is just a very basic simulation of translation
    const translations: Record<string, string> = {
      'Gentle cleanser': 'منظف لطيف',
      'Hydrating toner': 'تونر مرطب',
      'Moisturizer': 'مرطب',
      'Sunscreen': 'واقي شمس',
      'Oil cleanser': 'منظف زيتي',
      'Water-based cleanser': 'منظف مائي',
      'Hydrating mask': 'قناع ترطيب',
      'Gentle exfoliation': 'تقشير لطيف',
      'Niacinamide serum': 'سيروم النياسيناميد',
      'BHA treatment': 'علاج BHA',
      'Clay mask': 'قناع طيني',
      'Hyaluronic acid serum': 'سيروم حمض الهيالورونيك',
      'Rich hydrating serum': 'سيروم ترطيب غني',
      'Occlusive': 'مرطب مغلق',
      'Overnight hydrating mask': 'قناع ترطيب ليلي',
      'Vitamin C serum': 'سيروم فيتامين سي',
      'Alpha arbutin': 'ألفا أربوتين',
      'Brightening mask': 'قناع تفتيح',
      'AHA treatment': 'علاج AHA',
      'Chemical exfoliation treatment': 'علاج تقشير كيميائي'
    };
    
    // Try to find a direct translation, otherwise return the English text
    for (const [en, ar] of Object.entries(translations)) {
      if (text.includes(en)) {
        return text.replace(en, ar);
      }
    }
    
    return text + ' (بالإنجليزية)'; // Fallback - indicate it's still in English
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>{language === 'ar' ? 'جاري تحميل الروتين المخصص...' : 'Loading your personalized routine...'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTitle = (type: 'morning' | 'evening' | 'weekly') => {
    switch (type) {
      case 'morning':
        return language === 'ar' ? 'روتين الصباح' : 'Morning Routine';
      case 'evening':
        return language === 'ar' ? 'روتين المساء' : 'Evening Routine';
      case 'weekly':
        return language === 'ar' ? 'روتين أسبوعي' : 'Weekly Routine';
    }
  };

  const getIcon = (type: 'morning' | 'evening' | 'weekly') => {
    switch (type) {
      case 'morning':
        return <Clock className="h-4 w-4" />;
      case 'evening':
        return <Clock className="h-4 w-4" />;
      case 'weekly':
        return <Calendar className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className={language === 'ar' ? 'text-right' : ''}>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {language === 'ar' ? 'الروتين المخصص' : 'Your Personalized Routine'}
            {isPremium && <Star className="h-4 w-4 text-amber-500" />}
          </CardTitle>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {language === 'ar' ? 'تحديث' : 'Update'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {routines ? (
          <Tabs defaultValue="morning" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="morning" className="flex items-center gap-2">
                {getIcon('morning')}
                {getTitle('morning')}
              </TabsTrigger>
              <TabsTrigger value="evening" className="flex items-center gap-2">
                {getIcon('evening')}
                {getTitle('evening')}
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center gap-2">
                {getIcon('weekly')}
                {getTitle('weekly')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="morning" className="space-y-4">
              <ul className="space-y-2">
                {routines.morning.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>{language === 'ar' ? step.ar : step.en}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="evening" className="space-y-4">
              <ul className="space-y-2">
                {routines.evening.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>{language === 'ar' ? step.ar : step.en}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            
            <TabsContent value="weekly" className="space-y-4">
              <ul className="space-y-2">
                {routines.weekly.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                    <span>{language === 'ar' ? step.ar : step.en}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <p>{language === 'ar' ? 'لا يوجد روتين متاح حاليًا' : 'No routine available yet'}</p>
          </div>
        )}
        
        {/* Premium upsell */}
        {!isPremium && (
          <div className="mt-6 bg-amber-50 p-4 rounded-md border border-amber-200">
            <div className="flex items-start gap-2">
              <Star className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium">{language === 'ar' ? 'ترقية إلى Premium' : 'Upgrade to Premium'}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {language === 'ar' 
                    ? 'احصل على روتين مخصص أكثر تفصيلاً مع منتجات موصى بها محددة لبشرتك'
                    : 'Get more detailed personalized routines with specific product recommendations for your skin'}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalizedRoutines;
