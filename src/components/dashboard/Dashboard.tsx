
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Camera, Clock, ArrowRight, Bell, AlertTriangle, CheckCircle } from 'lucide-react';
import { getUserAnalyses } from '@/services/analysisService';
import { SkinAnalysis } from '@/types';
import { useToast } from '@/hooks/use-toast';
import SkinHealthOverview from './SkinHealthOverview';

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [recentAnalyses, setRecentAnalyses] = useState<SkinAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [skinConcerns, setSkinConcerns] = useState<{ name: string, score: number }[]>([
    { name: 'Hydration', score: 70 },
    { name: 'Texture', score: 65 },
    { name: 'Acne', score: 85 },
    { name: 'Redness', score: 75 },
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);
  
  useEffect(() => {
    const fetchUserAnalyses = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const analyses = await getUserAnalyses(user.id);
        
        // Update dashboard with latest analysis data if available
        if (analyses && analyses.length > 0) {
          setRecentAnalyses(analyses);
          
          // Update skin concerns with real data if available
          const latestAnalysis = analyses[0];
          if (latestAnalysis.severityScores) {
            const concernsData = Object.entries(latestAnalysis.severityScores)
              .filter(([key]) => key !== 'overallHealth')
              .map(([key, value]) => {
                // Convert severity score to a positive percentage (lower is worse, so invert)
                const score = typeof value === 'number' ? Math.max(0, Math.min(100, (10 - value) * 10)) : 70;
                // Format key from camelCase to Title Case
                const name = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                return { name, score };
              });
              
            if (concernsData.length > 0) {
              setSkinConcerns(concernsData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching analyses:', error);
        toast({
          variant: "destructive",
          title: "Error fetching analyses",
          description: "We couldn't load your recent skin analyses.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAnalyses();
  }, [user, toast]);

  // Mock data for upcoming routines - would come from backend in a real app
  const upcomingRoutines = [
    { id: '1', name: 'Morning Routine', time: '8:00 AM' },
    { id: '2', name: 'Evening Routine', time: '8:00 PM' },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Calculate overall health score based on latest analysis
  const calculateOverallScore = () => {
    if (recentAnalyses.length === 0) return 78; // Default value
    
    const latestAnalysis = recentAnalyses[0];
    if (!latestAnalysis.severityScores) return 78;
    
    if ('overallHealth' in latestAnalysis.severityScores) {
      return latestAnalysis.severityScores.overallHealth * 10; // Convert to percentage
    }
    
    // Calculate average from all scores
    const scores = Object.values(latestAnalysis.severityScores).filter(score => typeof score === 'number');
    if (scores.length === 0) return 78;
    
    const average = scores.reduce((sum, score) => sum + (10 - Number(score)), 0) / scores.length;
    return Math.round(average * 10); // Convert to percentage
  };

  // Get latest recommendations based on analysis
  const getRecommendations = () => {
    if (recentAnalyses.length === 0) {
      return [
        { 
          title: "Add a hydrating serum to your routine", 
          description: "Your skin shows signs of dehydration. A hyaluronic acid serum can help maintain moisture.",
          type: "hydration"
        },
        {
          title: "Incorporate gentle exfoliation",
          description: "To improve skin texture, try a gentle chemical exfoliant 2-3 times per week.",
          type: "texture"
        },
        {
          title: "Increase sun protection",
          description: "We've detected early signs of sun damage. Use SPF 50+ sunscreen daily.",
          type: "protection"
        }
      ];
    }
    
    const latestAnalysis = recentAnalyses[0];
    if (!latestAnalysis.recommendations || !latestAnalysis.recommendations.tips) {
      return [];
    }
    
    // Convert tips to recommendation format
    return latestAnalysis.recommendations.tips.slice(0, 3).map((tip, index) => {
      const types = ["hydration", "texture", "protection"];
      return {
        title: tip,
        description: latestAnalysis.aiAnalysisResults?.analysis?.slice(0, 80) + '...' || 
                    "Based on your skin analysis, we recommend making this change to your routine.",
        type: types[index % types.length]
      };
    });
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 md:ml-64">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">{greeting}, {user?.firstName || 'there'}!</h1>
          <p className="text-gray-500">Here's an overview of your skin health</p>
        </div>
        
        <Button asChild className="mt-4 md:mt-0">
          <Link to="/analysis" className="flex items-center gap-2">
            <Camera size={18} /> New Skin Analysis
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Skin Health Score */}
        <Card className="md:col-span-1 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Skin Health Score</CardTitle>
            <CardDescription>Overall skin condition</CardDescription>
          </CardHeader>
          <CardContent>
            <SkinHealthOverview score={calculateOverallScore()} concerns={skinConcerns} />
          </CardContent>
        </Card>

        {/* Today's Routines */}
        <Card className="md:col-span-1 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Today's Routines</CardTitle>
            <CardDescription>Your skincare schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingRoutines.map((routine) => (
                <div key={routine.id} className="flex items-start p-3 rounded-lg bg-skin-peach/20">
                  <div className="mr-3 p-2 bg-white rounded-full">
                    <Clock size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{routine.name}</h4>
                    <p className="text-sm text-gray-500">{routine.time}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    <ArrowRight size={16} />
                  </Button>
                </div>
              ))}
              <Button asChild variant="outline" className="w-full mt-2">
                <Link to="/routines">View All Routines</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-1 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Quick Actions</CardTitle>
            <CardDescription>Get things done</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild variant="outline" className="h-24 flex flex-col">
                <Link to="/analysis">
                  <Camera className="mb-2" size={24} />
                  <span>New Analysis</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col">
                <Link to="/routines">
                  <Clock className="mb-2" size={24} />
                  <span>Adjust Routine</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col">
                <Link to="/journal">
                  <Calendar className="mb-2" size={24} />
                  <span>Journal Entry</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-24 flex flex-col">
                <Link to="/knowledge">
                  <Bell className="mb-2" size={24} />
                  <span>Notifications</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <Tabs defaultValue="analyses">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="analyses">Recent Analyses</TabsTrigger>
              <TabsTrigger value="journal">Journal Entries</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/history">View All</Link>
            </Button>
          </div>

          <TabsContent value="analyses">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3">Loading analyses...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentAnalyses.map((analysis) => (
                  <Link 
                    key={analysis.id} 
                    to={`/analysis/${analysis.id}`} 
                    className="block group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow p-4">
                      <div className="aspect-square relative rounded-md overflow-hidden mb-3">
                        <img 
                          src={analysis.imageUrl} 
                          alt="Analysis" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Skin Analysis</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(analysis.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}

                <Link to="/analysis" className="block">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border-2 border-dashed border-gray-200 p-4 h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-skin-blue/20 flex items-center justify-center mx-auto mb-3">
                        <Camera size={20} className="text-primary" />
                      </div>
                      <span className="font-medium text-primary">New Analysis</span>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="journal">
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="text-gray-500">You haven't created any journal entries yet.</p>
              <Button asChild className="mt-4">
                <Link to="/journal/new">Create Your First Journal Entry</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Recommendations */}
      <Card className="hover:shadow-md transition-shadow mb-8">
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
          <CardDescription>Based on your recent skin analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getRecommendations().map((recommendation, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${
                  recommendation.type === "hydration" ? "bg-skin-blue/20" : 
                  recommendation.type === "texture" ? "bg-skin-green/20" : 
                  "bg-skin-peach/20"
                }`}
              >
                <h4 className="font-medium mb-1">{recommendation.title}</h4>
                <p className="text-sm text-gray-600">
                  {recommendation.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
