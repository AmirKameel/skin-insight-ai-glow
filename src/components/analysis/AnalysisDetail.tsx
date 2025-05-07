import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Calendar, Download, Share2, AlertTriangle, Star, LockKeyhole, CheckCircle } from 'lucide-react';
import { getAnalysisById, getPremiumRecommendations, trackTreatmentProgress } from '@/services/analysisService';
import { SkinAnalysis } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import TreatmentPlan from './TreatmentPlan';
import DermatologistFeedback from './DermatologistFeedback';

const AnalysisDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [premiumData, setPremiumData] = useState<any>(null);
  const [loadingPremium, setLoadingPremium] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<number | null>(null);
  const [treatmentStarted, setTreatmentStarted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getAnalysisById(id);
        if (data) {
          setAnalysis(data);
        } else {
          toast({
            variant: "destructive",
            title: "Not found",
            description: "The requested analysis could not be found.",
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load analysis details.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [id, navigate, toast]);

  const loadPremiumContent = async () => {
    if (!id || !user) return;
    
    // Check if user is premium - this would normally check subscription status
    const isPremiumUser = user.email?.includes('premium');
    
    if (!isPremiumUser) {
      // Show upgrade prompt
      toast({
        title: "Premium Feature",
        description: "Upgrade to Premium for advanced product recommendations, personalized treatment plans, and AI dermatologist consultations.",
        action: (
          <Button onClick={() => navigate('/upgrade')} variant="default" size="sm">
            Upgrade Now
          </Button>
        ),
      });
      return;
    }
    
    try {
      setLoadingPremium(true);
      const premium = await getPremiumRecommendations(id);
      setPremiumData(premium);
    } catch (error) {
      console.error('Error loading premium content:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load premium recommendations.",
      });
    } finally {
      setLoadingPremium(false);
    }
  };

  const startTreatment = async (solutionIndex: number) => {
    if (!id || !user) return;
    
    try {
      // This would normally send data to the backend
      setSelectedSolution(solutionIndex);
      setTreatmentStarted(true);
      
      toast({
        title: "Treatment Plan Started",
        description: "We'll help you track your progress with this treatment plan",
      });
      
      // In a real app, we'd save this to the database
      await trackTreatmentProgress(id, solutionIndex);
      
    } catch (error) {
      console.error('Error starting treatment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start treatment plan.",
      });
    }
  };

  const calculateOverallScore = () => {
    if (!analysis?.severityScores) return 0;
    
    // If there's an explicit overall health score, use it
    if ('overallHealth' in analysis.severityScores) {
      return analysis.severityScores.overallHealth * 10; // Convert to percentage
    }
    
    // Otherwise calculate an average from other scores
    // Lower severity means better health, so we invert the scores
    const scores = Object.values(analysis.severityScores).filter(score => typeof score === 'number');
    if (scores.length === 0) return 0;
    
    const average = scores.reduce((sum, score) => sum + (10 - Number(score)), 0) / scores.length;
    return Math.round(average * 10); // Convert to percentage
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6 md:ml-64">
        <div className="max-w-6xl mx-auto text-center py-12">
          <div className="inline-flex items-center justify-center p-4 bg-skin-blue/20 rounded-full mb-4">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-medium">Loading analysis details...</h3>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6 md:ml-64">
        <div className="max-w-6xl mx-auto text-center py-12">
          <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4">
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">!</div>
          </div>
          <h3 className="text-lg font-medium mb-4">Analysis not found</h3>
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 md:ml-64">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold flex-1">Analysis Results</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
        
        <div className="mb-6 text-sm text-gray-500 flex items-center">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{formatDate(analysis.createdAt)}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Image Column */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Your Skin Image</CardTitle>
              <CardDescription>Analyzed photo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square rounded-lg overflow-hidden border">
                <img 
                  src={analysis.imageUrl} 
                  alt="Analyzed skin"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Overall Skin Health</h3>
                <div className="mb-2 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Score</span>
                  <span className="font-medium">{calculateOverallScore()}%</span>
                </div>
                <Progress value={calculateOverallScore()} className="h-2" />
              </div>
              
              <div className="mt-6 space-y-3">
                {Object.entries(analysis.severityScores).map(([key, value]) => {
                  if (key === 'overallHealth') return null;
                  const formatKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  const score = 10 - Number(value); // Invert score (lower severity is better)
                  const percentage = score * 10;
                  
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">{formatKey}</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Column */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>AI Analysis Results</CardTitle>
              <CardDescription>Comprehensive skin assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="issues">Issues</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  <TabsTrigger value="treatment">
                    <Star className="w-4 h-4 mr-1" /> Treatment Plan
                  </TabsTrigger>
                  <TabsTrigger value="dermatologist">AI Doctor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Skin Analysis</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {analysis.aiAnalysisResults.analysis || 
                        "Your skin shows a combination of features. Based on our analysis, we've identified several key characteristics and concerns that can help guide your skincare routine."}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Key Characteristics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500">Skin Type</span>
                        <p className="font-medium capitalize">{analysis.aiAnalysisResults.skinType || "Combination"}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500">Skin Tone</span>
                        <p className="font-medium capitalize">{analysis.aiAnalysisResults.skinTone || "Medium"}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500">Sensitivity</span>
                        <p className="font-medium capitalize">{analysis.aiAnalysisResults.sensitivity || "Low to moderate"}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-500">Hydration</span>
                        <p className="font-medium capitalize">{analysis.aiAnalysisResults.hydration || "Adequate"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="issues" className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Detected Issues</h3>
                    <ul className="space-y-4">
                      {analysis.detectedIssues.map((issue, index) => (
                        <li key={index} className="bg-white border rounded-lg p-4 flex items-start">
                          <div className="mr-3 p-1.5 bg-amber-50 rounded-full">
                            <AlertTriangle size={16} className="text-amber-500" />
                          </div>
                          <div>
                            <h4 className="font-medium capitalize">{issue}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {(() => {
                                // Generate a description based on the issue type
                                if (issue.includes('acne')) {
                                  return 'Small inflamed areas indicating mild acne, likely due to clogged pores and excess oil production.';
                                } else if (issue.includes('dry')) {
                                  return 'Areas of dryness suggesting a damaged moisture barrier or environmental factors affecting skin hydration.';
                                } else if (issue.includes('texture')) {
                                  return 'Uneven skin texture that may benefit from gentle exfoliation and hydrating products.';
                                } else if (issue.includes('pigment')) {
                                  return 'Areas of uneven skin tone that may be from sun damage, past inflammation, or hormonal changes.';
                                } else {
                                  return 'This concern may benefit from targeted treatment as part of your skincare routine.';
                                }
                              })()}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                
                <TabsContent value="recommendations" className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Recommended Products</h3>
                      <ul className="divide-y">
                        {analysis.recommendations.products?.map((product, index) => (
                          <li key={index} className="py-3 pl-3">
                            <div className="flex items-start">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3"></div>
                              <div>
                                <p className="font-medium">{product}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Recommended Routines</h3>
                      <ul className="divide-y">
                        {analysis.recommendations.routines?.map((routine, index) => (
                          <li key={index} className="py-3 pl-3">
                            <div className="flex items-start">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3"></div>
                              <div>
                                <p className="font-medium">{routine}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Skin Care Tips</h3>
                      <ul className="divide-y">
                        {analysis.recommendations.tips?.map((tip, index) => (
                          <li key={index} className="py-3 pl-3">
                            <div className="flex items-start">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-3"></div>
                              <div>
                                <p className="font-medium">{tip}</p>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="treatment" className="space-y-6">
                  {!premiumData && !loadingPremium ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center p-4 bg-amber-50 rounded-full mb-4">
                        <LockKeyhole size={24} className="text-amber-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Premium Treatment Plans</h3>
                      <p className="text-gray-600 max-w-md mx-auto mb-6">
                        Get personalized treatment plans, progress tracking, and periodic checkups with our AI dermatologist to effectively address your specific skin concerns.
                      </p>
                      <Button onClick={loadPremiumContent}>
                        <Star className="mr-2 h-4 w-4" /> 
                        Unlock Premium Features
                      </Button>
                    </div>
                  ) : loadingPremium ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center p-4 bg-skin-blue/20 rounded-full mb-4">
                        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <h3 className="text-lg font-medium">Loading treatment plans...</h3>
                    </div>
                  ) : (
                    <TreatmentPlan 
                      premiumData={premiumData} 
                      selectedSolution={selectedSolution}
                      treatmentStarted={treatmentStarted}
                      onSelectSolution={startTreatment}
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="dermatologist" className="space-y-6">
                  {!premiumData && !loadingPremium ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center p-4 bg-amber-50 rounded-full mb-4">
                        <LockKeyhole size={24} className="text-amber-600" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">AI Dermatologist</h3>
                      <p className="text-gray-600 max-w-md mx-auto mb-6">
                        Get in-depth analysis from our AI dermatologist that provides expert-level insights about your skin condition, potential underlying causes, and personalized treatment options.
                      </p>
                      <Button onClick={loadPremiumContent}>
                        <Star className="mr-2 h-4 w-4" /> 
                        Unlock Premium Features
                      </Button>
                    </div>
                  ) : loadingPremium ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center p-4 bg-skin-blue/20 rounded-full mb-4">
                        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <h3 className="text-lg font-medium">Consulting with AI dermatologist...</h3>
                    </div>
                  ) : (
                    <DermatologistFeedback 
                      analysis={analysis}
                      premiumData={premiumData}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDetail;
