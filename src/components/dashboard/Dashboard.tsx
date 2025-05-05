
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Camera, Clock, ArrowRight } from 'lucide-react';
import { getUserAnalyses } from '@/services/analysisService';
import { SkinAnalysis } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [recentAnalyses, setRecentAnalyses] = useState<SkinAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

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
        setRecentAnalyses(analyses);
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

  // Mock data - would come from backend in a real app
  const upcomingRoutines = [
    { id: '1', name: 'Morning Routine', time: '8:00 AM' },
    { id: '2', name: 'Evening Routine', time: '8:00 PM' },
  ];

  const skinConcerns = [
    { name: 'Hydration', score: 70 },
    { name: 'Texture', score: 65 },
    { name: 'Acne', score: 85 },
    { name: 'Redness', score: 75 },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
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
            <div className="flex items-center justify-center py-4">
              <div className="relative w-36 h-36">
                <div className="w-full h-full rounded-full bg-skin-blue/20 flex items-center justify-center">
                  <span className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">78%</span>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-r-transparent rotate-45"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {skinConcerns.map((concern) => (
                <div key={concern.name} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>{concern.name}</span>
                    <span className="font-medium">{concern.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-primary" 
                      style={{ width: `${concern.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
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
              <Button variant="outline" className="w-full mt-2">View All Routines</Button>
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
                  <Calendar className="mb-2" size={24} />
                  <span>Knowledge</span>
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
            <div className="p-4 rounded-lg bg-skin-green/20">
              <h4 className="font-medium mb-1">Add a hydrating serum to your routine</h4>
              <p className="text-sm text-gray-600">
                Your skin shows signs of dehydration. A hyaluronic acid serum can help maintain moisture.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-skin-blue/20">
              <h4 className="font-medium mb-1">Incorporate gentle exfoliation</h4>
              <p className="text-sm text-gray-600">
                To improve skin texture, try a gentle chemical exfoliant 2-3 times per week.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-skin-peach/20">
              <h4 className="font-medium mb-1">Increase sun protection</h4>
              <p className="text-sm text-gray-600">
                We've detected early signs of sun damage. Use SPF 50+ sunscreen daily.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
