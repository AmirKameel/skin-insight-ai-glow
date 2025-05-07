
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Star, ArrowRight, Calendar } from 'lucide-react';
import { trackTreatmentProgress, checkUserPremiumStatus } from '@/services/analysisService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import PersonalizedRoutines from '@/components/premium/PersonalizedRoutines';

interface TreatmentPlanProps {
  premiumData: any;
  selectedSolution: number | null;
  treatmentStarted: boolean;
  onSelectSolution: (index: number) => void;
  analysisId: string;
  language?: 'en' | 'ar';
}

const TreatmentPlan: React.FC<TreatmentPlanProps> = ({ 
  premiumData, 
  selectedSolution, 
  treatmentStarted,
  onSelectSolution,
  analysisId,
  language = 'en'
}) => {
  const [trackProgress, setTrackProgress] = useState({
    days: 0,
    totalDays: 30,
    improvements: [] as string[],
  });
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Check premium status on component mount
    if (user?.id) {
      checkUserPremiumStatus(user.id)
        .then(result => setIsPremium(result))
        .catch(error => {
          console.error('Error checking premium status:', error);
          setIsPremium(false);
        });
    }
  }, [user]);

  // Multiple treatment options (bilingual)
  const treatmentOptions = [
    {
      en: {
        name: "Gentle Hydration Routine",
        description: "A mild routine focused on rebuilding your skin's moisture barrier and improving overall hydration levels.",
        duration: "4-6 weeks",
        suitability: "Ideal for sensitive, dry skin with minimal active breakouts",
        steps: [
          "Morning: Gentle cleanser → Hydrating toner → Niacinamide serum → Light moisturizer → SPF 50",
          "Evening: Oil cleanser → Water-based cleanser → Hyaluronic acid serum → Ceramide moisturizer",
          "Weekly: Gentle enzyme exfoliation and hydrating mask"
        ]
      },
      ar: {
        name: "روتين الترطيب اللطيف",
        description: "روتين خفيف يركز على إعادة بناء حاجز الرطوبة في بشرتك وتحسين مستويات الترطيب العامة.",
        duration: "4-6 أسابيع",
        suitability: "مثالي للبشرة الحساسة والجافة مع حد أدنى من البثور النشطة",
        steps: [
          "الصباح: منظف لطيف → تونر مرطب → سيروم النياسيناميد → مرطب خفيف → واقٍ من الشمس 50",
          "المساء: منظف زيتي → منظف مائي → سيروم حمض الهيالورونيك → مرطب بالسيراميد",
          "أسبوعيًا: تقشير إنزيمي لطيف وقناع مرطب"
        ]
      }
    },
    {
      en: {
        name: "Active Treatment Plan",
        description: "A more intensive treatment plan targeting active breakouts, congestion and uneven skin texture.",
        duration: "6-8 weeks",
        suitability: "Best for oily or combination skin with moderate acne",
        steps: [
          "Morning: Salicylic acid cleanser → Niacinamide toner → Vitamin C serum → Oil-free moisturizer → SPF 50",
          "Evening: Double cleanse → BHA treatment (2-3x/week) → Retinol (alternate nights) → Oil-control moisturizer",
          "Weekly: Clay mask for T-zone, hydrating mask for cheeks"
        ]
      },
      ar: {
        name: "خطة العلاج النشط",
        description: "خطة علاج أكثر كثافة تستهدف البثور النشطة والاحتقان وملمس البشرة غير المتساوي.",
        duration: "6-8 أسابيع",
        suitability: "الأفضل للبشرة الدهنية أو المختلطة مع حب الشباب المعتدل",
        steps: [
          "الصباح: منظف بحمض الساليسيليك → تونر النياسيناميد → سيروم فيتامين C → مرطب خالي من الزيوت → واقٍ من الشمس 50",
          "المساء: تنظيف مزدوج → علاج BHA (2-3 مرات/أسبوع) → ريتينول (ليالي متناوبة) → مرطب للتحكم في الزيوت",
          "أسبوعيًا: قناع طيني لمنطقة T، وقناع مرطب للخدين"
        ]
      }
    },
    {
      en: {
        name: "Anti-Aging Restoration",
        description: "Focused on improving skin texture, firmness and addressing early signs of aging.",
        duration: "8-12 weeks",
        suitability: "Ideal for mature skin with fine lines and uneven texture",
        steps: [
          "Morning: Gentle cleanser → Antioxidant serum → Peptide moisturizer → SPF 50+",
          "Evening: Double cleanse → Retinol serum → Rich moisturizer with ceramides",
          "Weekly: AHA treatment and firming mask"
        ]
      },
      ar: {
        name: "استعادة مكافحة الشيخوخة",
        description: "تركز على تحسين ملمس البشرة وثباتها ومعالجة علامات الشيخوخة المبكرة.",
        duration: "8-12 أسبوع",
        suitability: "مثالية للبشرة الناضجة ذات الخطوط الدقيقة والملمس غير المتساوي",
        steps: [
          "الصباح: منظف لطيف → سيروم مضاد للأكسدة → مرطب ببتيد → واقٍ من الشمس +50",
          "المساء: تنظيف مزدوج → سيروم ريتينول → مرطب غني بالسيراميد",
          "أسبوعيًا: علاج AHA وقناع شد"
        ]
      }
    }
  ];

  const simulateProgress = async () => {
    if (!analysisId || selectedSolution === null || !user?.id) {
      toast({
        variant: "destructive",
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' 
          ? "الرجاء تحديد خطة علاج أولاً" 
          : "Please select a treatment plan first"
      });
      return;
    }
    
    try {
      // Track the treatment in the database
      await trackTreatmentProgress(analysisId, selectedSolution);
      
      // In a real app, this would fetch actual tracking data
      setTrackProgress({
        days: 14,
        totalDays: 30,
        improvements: language === 'ar' 
          ? [
              "تقليل الاحمرار في منطقة الخد",
              "تحسين مستويات الترطيب",
              "بثور أقل على طول خط الفك"
            ] 
          : [
              "Reduced redness in cheek area",
              "Improved hydration levels",
              "Fewer breakouts along jawline"
            ]
      });
      
      toast({
        title: language === 'ar' ? "تم بدء الخطة" : "Plan Started",
        description: language === 'ar' 
          ? "تم بدء خطة العلاج الخاصة بك بنجاح" 
          : "Your treatment plan has been successfully started"
      });
    } catch (error) {
      console.error('Error starting treatment plan:', error);
      toast({
        variant: "destructive",
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' 
          ? "فشل في بدء خطة العلاج" 
          : "Failed to start treatment plan"
      });
    }
  };

  const nextCheckupDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today.toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {!treatmentStarted ? (
        <>
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Star className="text-amber-500 mr-2 h-5 w-5" />
              {language === 'ar' ? "خطط علاج مخصصة" : "Personalized Treatment Plans"}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'ar' 
                ? "بناءً على تحليل بشرتك، أنشأ طبيب الجلدية الذكاء الاصطناعي لدينا خطط العلاج المخصصة هذه. حدد الخطة التي تناسب نمط حياتك واهتماماتك الجلدية بشكل أفضل."
                : "Based on your skin analysis, our AI dermatologist has created these personalized treatment plans. Select the one that best fits your lifestyle and skin concerns."
              }
            </p>
            <div className="grid grid-cols-1 gap-4">
              {treatmentOptions.map((option, index) => (
                <Card key={index} className={`p-4 hover:shadow-md transition-all ${selectedSolution === index ? 'ring-2 ring-primary' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg">
                        {language === 'ar' ? option.ar.name : option.en.name}
                      </h4>
                      <p className="text-sm text-gray-500 mb-3">
                        {language === 'ar' ? 'المدة: ' : 'Duration: '}
                        {language === 'ar' ? option.ar.duration : option.en.duration}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {language === 'ar' ? option.ar.description : option.en.description}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">
                          {language === 'ar' ? 'الأفضل لـ: ' : 'Best for: '}
                        </span>
                        {language === 'ar' ? option.ar.suitability : option.en.suitability}
                      </p>
                    </div>
                    <Button 
                      variant={selectedSolution === index ? "default" : "outline"} 
                      size="sm"
                      onClick={() => onSelectSolution(index)}
                    >
                      {selectedSolution === index ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : null}
                      {selectedSolution === index 
                        ? (language === 'ar' ? 'تم الاختيار' : 'Selected')
                        : (language === 'ar' ? 'اختيار' : 'Select')
                      }
                    </Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h5 className="font-medium text-sm">
                      {language === 'ar' ? 'الخطوات الرئيسية:' : 'Key Steps:'}
                    </h5>
                    <ul className="space-y-2 text-sm">
                      {(language === 'ar' ? option.ar.steps : option.en.steps).map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start">
                          <div className="min-w-5 h-5 flex items-center justify-center bg-primary/10 text-primary rounded-full mr-2 shrink-0">
                            <span className="text-xs font-medium">{stepIndex + 1}</span>
                          </div>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="text-center pt-4">
            <Button 
              disabled={selectedSolution === null} 
              size="lg"
              onClick={simulateProgress}
            >
              {language === 'ar' ? 'بدء خطة العلاج' : 'Start Treatment Plan'}
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
              {language === 'ar' ? 'خطة العلاج النشطة الخاصة بك' : 'Your Active Treatment Plan'}
            </h3>
            <Card className="p-4 bg-green-50 border-green-200">
              <h4 className="font-medium text-lg">
                {selectedSolution !== null && language === 'ar' 
                  ? treatmentOptions[selectedSolution].ar.name 
                  : selectedSolution !== null ? treatmentOptions[selectedSolution].en.name : ''}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'ar' 
                  ? `بدأت قبل 14 يومًا - ${trackProgress.days}/${trackProgress.totalDays} يوم مكتمل`
                  : `Started 14 days ago - ${trackProgress.days}/${trackProgress.totalDays} days completed`
                }
              </p>
              <Progress 
                value={(trackProgress.days / trackProgress.totalDays) * 100} 
                className="h-2 mt-3 bg-green-100" 
              />
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">
              {language === 'ar' ? 'تقدم العلاج' : 'Treatment Progress'}
            </h3>
            <Card className="p-4">
              <h4 className="font-medium mb-3">
                {language === 'ar' ? 'التحسينات الملاحظة' : 'Improvements Noted'}
              </h4>
              <ul className="space-y-2">
                {trackProgress.improvements.map((improvement, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">
                  {language === 'ar' ? 'الخطوات التالية' : 'Next Steps'}
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 shrink-0">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {language === 'ar' ? 'الفحص التالي' : 'Next Checkup'}
                      </p>
                      <p className="text-sm text-gray-600">{nextCheckupDate()}</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 shrink-0">
                      <ArrowRight className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {language === 'ar' ? 'مواصلة الروتين الحالي' : 'Continue Current Routine'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {language === 'ar' 
                          ? 'اتبع الخطوات كما هو موضح في خطة العلاج الخاصة بك'
                          : 'Follow steps as outlined in your treatment plan'
                        }
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button className="w-full">
                  {language === 'ar' ? 'تتبع تقدم اليوم' : 'Track Today\'s Progress'}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Personalized Routines */}
      <div className="mt-8">
        <PersonalizedRoutines analysisId={analysisId} language={language} />
      </div>
    </div>
  );
};

export default TreatmentPlan;
