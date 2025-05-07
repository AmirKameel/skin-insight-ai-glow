
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Star, ArrowRight, Calendar } from 'lucide-react';

interface TreatmentPlanProps {
  premiumData: any;
  selectedSolution: number | null;
  treatmentStarted: boolean;
  onSelectSolution: (index: number) => void;
}

const TreatmentPlan: React.FC<TreatmentPlanProps> = ({ 
  premiumData, 
  selectedSolution, 
  treatmentStarted,
  onSelectSolution
}) => {
  const [trackProgress, setTrackProgress] = useState({
    days: 0,
    totalDays: 30,
    improvements: [] as string[],
  });

  // Multiple treatment options
  const treatmentOptions = [
    {
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
    {
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
    {
      name: "Anti-Aging Restoration",
      description: "Focused on improving skin texture, firmness and addressing early signs of aging.",
      duration: "8-12 weeks",
      suitability: "Ideal for mature skin with fine lines and uneven texture",
      steps: [
        "Morning: Gentle cleanser → Antioxidant serum → Peptide moisturizer → SPF 50+",
        "Evening: Double cleanse → Retinol serum → Rich moisturizer with ceramides",
        "Weekly: AHA treatment and firming mask"
      ]
    }
  ];

  const simulateProgress = () => {
    // In a real app, this would fetch actual tracking data
    setTrackProgress({
      days: 14,
      totalDays: 30,
      improvements: [
        "Reduced redness in cheek area",
        "Improved hydration levels",
        "Fewer breakouts along jawline"
      ]
    });
  };

  const nextCheckupDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7);
    return today.toLocaleDateString('en-US', { 
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
              Personalized Treatment Plans
            </h3>
            <p className="text-gray-600 mb-4">
              Based on your skin analysis, our AI dermatologist has created these personalized treatment plans. 
              Select the one that best fits your lifestyle and skin concerns.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {treatmentOptions.map((option, index) => (
                <Card key={index} className={`p-4 hover:shadow-md transition-all ${selectedSolution === index ? 'ring-2 ring-primary' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg">{option.name}</h4>
                      <p className="text-sm text-gray-500 mb-3">Duration: {option.duration}</p>
                      <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                      <p className="text-sm text-gray-600 mb-3"><span className="font-medium">Best for:</span> {option.suitability}</p>
                    </div>
                    <Button 
                      variant={selectedSolution === index ? "default" : "outline"} 
                      size="sm"
                      onClick={() => onSelectSolution(index)}
                    >
                      {selectedSolution === index ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : null}
                      {selectedSolution === index ? "Selected" : "Select"}
                    </Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h5 className="font-medium text-sm">Key Steps:</h5>
                    <ul className="space-y-2 text-sm">
                      {option.steps.map((step, stepIndex) => (
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
              Start Treatment Plan
            </Button>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <CheckCircle className="text-green-500 mr-2 h-5 w-5" />
              Your Active Treatment Plan
            </h3>
            <Card className="p-4 bg-green-50 border-green-200">
              <h4 className="font-medium text-lg">
                {treatmentOptions[selectedSolution as number].name}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Started 14 days ago - {trackProgress.days}/{trackProgress.totalDays} days completed
              </p>
              <Progress 
                value={(trackProgress.days / trackProgress.totalDays) * 100} 
                className="h-2 mt-3 bg-green-100" 
              />
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Treatment Progress</h3>
            <Card className="p-4">
              <h4 className="font-medium mb-3">Improvements Noted</h4>
              <ul className="space-y-2">
                {trackProgress.improvements.map((improvement, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Next Steps</h4>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 shrink-0">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Next Checkup</p>
                      <p className="text-sm text-gray-600">{nextCheckupDate()}</p>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3 shrink-0">
                      <ArrowRight className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Continue Current Routine</p>
                      <p className="text-sm text-gray-600">Follow steps as outlined in your treatment plan</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button className="w-full">Track Today's Progress</Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreatmentPlan;
