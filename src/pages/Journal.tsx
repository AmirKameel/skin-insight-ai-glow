
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { CalendarIcon, Camera, Plus, Filter, Calendar } from 'lucide-react';
import { createJournalEntry, getJournalEntries } from '@/services/analysisService';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const moods = ['Happy', 'Neutral', 'Stressed', 'Tired', 'Energetic'];

const Journal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    mood: 'Neutral',
    notes: '',
    sleep_quality: 5,
    stress_level: 5,
    image_url: ''
  });

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const journalEntries = await getJournalEntries(user!.id);
      setEntries(journalEntries);
    } catch (error) {
      console.error('Failed to load journal entries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your journal entries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData(prev => ({ ...prev, [name]: value[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await createJournalEntry(user.id, formData);
      toast({
        title: 'Success',
        description: 'Journal entry created successfully',
      });
      setIsCreating(false);
      setFormData({
        mood: 'Neutral',
        notes: '',
        sleep_quality: 5,
        stress_level: 5,
        image_url: ''
      });
      loadEntries();
    } catch (error) {
      console.error('Failed to create journal entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to create your journal entry',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'Happy': return '😊';
      case 'Neutral': return '😐';
      case 'Stressed': return '😓';
      case 'Tired': return '😴';
      case 'Energetic': return '⚡';
      default: return '😐';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6 px-4 md:px-6 md:ml-64 min-h-screen">
        <div className="flex justify-center items-center py-12">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-3">Loading journal entries...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 md:ml-64">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Skin Journal</h1>
          <p className="text-gray-500">Track your skin's journey and identify patterns</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus size={18} /> New Entry
        </Button>
      </div>

      {isCreating ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Journal Entry</CardTitle>
            <CardDescription>Track how your skin feels today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mood">How are you feeling today?</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {moods.map(mood => (
                      <Button
                        key={mood}
                        type="button"
                        variant={formData.mood === mood ? 'default' : 'outline'}
                        className="flex flex-col py-3"
                        onClick={() => setFormData(prev => ({ ...prev, mood }))}
                      >
                        <span className="text-2xl mb-1">{getMoodEmoji(mood)}</span>
                        <span>{mood}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="sleep_quality">Sleep Quality (1-10)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm">Poor</span>
                    <Slider
                      id="sleep_quality"
                      defaultValue={[5]}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                      onValueChange={(value) => handleSliderChange('sleep_quality', value)}
                    />
                    <span className="text-sm">Excellent</span>
                    <span className="bg-gray-100 px-2 py-1 rounded-md w-8 text-center">
                      {formData.sleep_quality}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="stress_level">Stress Level (1-10)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm">Low</span>
                    <Slider
                      id="stress_level"
                      defaultValue={[5]}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                      onValueChange={(value) => handleSliderChange('stress_level', value)}
                    />
                    <span className="text-sm">High</span>
                    <span className="bg-gray-100 px-2 py-1 rounded-md w-8 text-center">
                      {formData.stress_level}
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes about your skin today</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any changes, reactions, or observations about your skin..."
                    className="mt-1 min-h-32"
                  />
                </div>

                <div>
                  <Label htmlFor="image">Add a photo (optional)</Label>
                  <div className="mt-1 flex items-center">
                    <Button type="button" variant="outline" className="w-full py-8 flex flex-col gap-2">
                      <Camera size={24} />
                      <span>Upload Image</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Entry</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      <Tabs defaultValue="all">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">All Entries</TabsTrigger>
            <TabsTrigger value="insights">Insights & Patterns</TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter size={16} /> Filter
          </Button>
        </div>

        <TabsContent value="all">
          {entries.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Journal Entries Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                Start tracking your skin's journey by creating your first journal entry.
              </p>
              <Button onClick={() => setIsCreating(true)}>Create Your First Entry</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium">{formatDate(entry.date)}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-2xl mr-2">{getMoodEmoji(entry.mood)}</span>
                          <span className="text-gray-600">{entry.mood}</span>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">Sleep</div>
                          <div className="bg-blue-50 px-2 py-1 rounded-md text-blue-700 font-medium">
                            {entry.sleep_quality}/10
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-500 mb-1">Stress</div>
                          <div className="bg-amber-50 px-2 py-1 rounded-md text-amber-700 font-medium">
                            {entry.stress_level}/10
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {entry.notes && (
                      <div className="mb-4 bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-700">{entry.notes}</p>
                      </div>
                    )}
                    
                    {entry.image_url && (
                      <div className="mt-4">
                        <img 
                          src={entry.image_url} 
                          alt="Skin journal" 
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Skin Patterns & Insights</CardTitle>
              <CardDescription>AI-powered analysis of your skin journal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <Button variant="outline" className="mb-4">
                    <Star className="mr-2 h-4 w-4" />
                    Unlock Premium Insights
                  </Button>
                  <p className="text-gray-500">
                    Upgrade to premium for AI-powered analysis of your skin patterns over time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Journal;
