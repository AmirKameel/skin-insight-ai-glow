
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { CheckCircle, Plus, Clock, Sun, Moon, Calendar, AlertCircle, Star } from 'lucide-react';

const Routines = () => {
  const [activeRoutine, setActiveRoutine] = useState('morning');

  // Mock routine data
  const routines = {
    morning: {
      title: "Morning Routine",
      lastUpdated: "October 10, 2023",
      steps: [
        { 
          id: 1, 
          name: "Gentle Cleanser", 
          description: "Cleanse with lukewarm water to remove overnight buildup", 
          time: "30 seconds",
          product: "CeraVe Hydrating Cleanser"
        },
        { 
          id: 2, 
          name: "Hydrating Toner", 
          description: "Apply with hands, pat gently into skin", 
          time: "30 seconds",
          product: "Laneige Cream Skin Toner"
        },
        { 
          id: 3, 
          name: "Vitamin C Serum", 
          description: "Apply 3-4 drops focusing on areas with hyperpigmentation", 
          time: "1 minute",
          product: "Timeless 20% Vitamin C + E + Ferulic Acid"
        },
        { 
          id: 4, 
          name: "Moisturizer", 
          description: "Apply to slightly damp skin to lock in hydration", 
          time: "30 seconds",
          product: "Neutrogena Hydro Boost Gel Cream"
        },
        { 
          id: 5, 
          name: "Sunscreen", 
          description: "Apply generously to face, neck and exposed areas", 
          time: "1 minute",
          product: "La Roche-Posay Anthelios SPF 50"
        }
      ]
    },
    evening: {
      title: "Evening Routine",
      lastUpdated: "October 12, 2023",
      steps: [
        { 
          id: 1, 
          name: "Oil Cleanser", 
          description: "Massage onto dry skin to dissolve makeup and sunscreen", 
          time: "1 minute",
          product: "DHC Deep Cleansing Oil"
        },
        { 
          id: 2, 
          name: "Water-based Cleanser", 
          description: "Second cleanse to remove remaining impurities", 
          time: "1 minute",
          product: "La Roche-Posay Toleriane Hydrating Gentle Cleanser"
        },
        { 
          id: 3, 
          name: "Exfoliating Toner (2-3x weekly)", 
          description: "Apply with cotton pad, avoid eye area", 
          time: "30 seconds",
          product: "Paula's Choice 2% BHA Liquid Exfoliant"
        },
        { 
          id: 4, 
          name: "Hydrating Serum", 
          description: "Apply to damp skin, focusing on dry areas", 
          time: "30 seconds",
          product: "The Ordinary Hyaluronic Acid 2% + B5"
        },
        { 
          id: 5, 
          name: "Retinol Treatment (alternating nights)", 
          description: "Small pea-sized amount, avoid eye area", 
          time: "30 seconds",
          product: "Differin Adapalene Gel 0.1%"
        },
        { 
          id: 6, 
          name: "Rich Moisturizer", 
          description: "Focus on dryer areas of the face", 
          time: "1 minute",
          product: "CeraVe Moisturizing Cream"
        }
      ]
    },
    weekly: {
      title: "Weekly Treatments",
      lastUpdated: "October 14, 2023",
      steps: [
        { 
          id: 1, 
          name: "Clay Mask", 
          description: "Apply to T-zone or oilier areas, avoid eye area", 
          time: "10-15 minutes",
          product: "Aztec Secret Indian Healing Clay",
          day: "Sunday"
        },
        { 
          id: 2, 
          name: "Hydrating Mask", 
          description: "Apply generously to entire face", 
          time: "15-20 minutes",
          product: "Dr. Jart+ Ceramidin Facial Barrier Mask",
          day: "Wednesday"
        },
        { 
          id: 3, 
          name: "Chemical Exfoliant", 
          description: "Apply evenly to face, avoid broken skin", 
          time: "10 minutes",
          product: "The Ordinary AHA 30% + BHA 2% Peeling Solution",
          day: "Saturday"
        }
      ]
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 md:ml-64">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Skincare Routines</h1>
          <p className="text-gray-500">Customize and track your daily skincare regimens</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={18} /> Create Routine
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Morning Routine Summary */}
        <Card className={`hover:shadow-md transition-shadow cursor-pointer ${activeRoutine === 'morning' ? 'ring-2 ring-primary' : ''}`} onClick={() => setActiveRoutine('morning')}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Sun className="mr-2 h-5 w-5 text-amber-500" /> Morning
              </CardTitle>
              <Badge variant="outline">{routines.morning.steps.length} Steps</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-gray-500">Last updated: {routines.morning.lastUpdated}</p>
          </CardContent>
          <CardFooter>
            <Button variant={activeRoutine === 'morning' ? 'default' : 'outline'} className="w-full">
              {activeRoutine === 'morning' ? 'Currently Viewing' : 'View Routine'}
            </Button>
          </CardFooter>
        </Card>

        {/* Evening Routine Summary */}
        <Card className={`hover:shadow-md transition-shadow cursor-pointer ${activeRoutine === 'evening' ? 'ring-2 ring-primary' : ''}`} onClick={() => setActiveRoutine('evening')}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Moon className="mr-2 h-5 w-5 text-blue-500" /> Evening
              </CardTitle>
              <Badge variant="outline">{routines.evening.steps.length} Steps</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-gray-500">Last updated: {routines.evening.lastUpdated}</p>
          </CardContent>
          <CardFooter>
            <Button variant={activeRoutine === 'evening' ? 'default' : 'outline'} className="w-full">
              {activeRoutine === 'evening' ? 'Currently Viewing' : 'View Routine'}
            </Button>
          </CardFooter>
        </Card>

        {/* Weekly Treatments Summary */}
        <Card className={`hover:shadow-md transition-shadow cursor-pointer ${activeRoutine === 'weekly' ? 'ring-2 ring-primary' : ''}`} onClick={() => setActiveRoutine('weekly')}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-purple-500" /> Weekly
              </CardTitle>
              <Badge variant="outline">{routines.weekly.steps.length} Steps</Badge>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-gray-500">Last updated: {routines.weekly.lastUpdated}</p>
          </CardContent>
          <CardFooter>
            <Button variant={activeRoutine === 'weekly' ? 'default' : 'outline'} className="w-full">
              {activeRoutine === 'weekly' ? 'Currently Viewing' : 'View Routine'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Active Routine Details */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {activeRoutine === 'morning' && <Sun className="mr-2 h-5 w-5 text-amber-500" />}
              {activeRoutine === 'evening' && <Moon className="mr-2 h-5 w-5 text-blue-500" />}
              {activeRoutine === 'weekly' && <Calendar className="mr-2 h-5 w-5 text-purple-500" />}
              <CardTitle>{routines[activeRoutine as keyof typeof routines].title}</CardTitle>
            </div>
            <Button size="sm">Edit Routine</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="steps">
            <TabsList className="mb-4">
              <TabsTrigger value="steps">Steps</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
              <TabsTrigger value="recommendations">
                <Star className="h-4 w-4 mr-1" /> AI Recommendations
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="steps">
              <ol className="space-y-4">
                {routines[activeRoutine as keyof typeof routines].steps.map((step, index) => (
                  <li key={step.id} className="bg-white rounded-lg border p-4">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{step.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" /> {step.time}
                          {step.day && (
                            <>
                              <span className="mx-2">•</span>
                              <Calendar className="h-4 w-4 mr-1" /> {step.day}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="ml-11">
                      <p className="text-gray-600 mb-3">{step.description}</p>
                      <div className="bg-gray-50 px-3 py-2 rounded-md text-sm">
                        <span className="font-medium">Product:</span> {step.product}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </TabsContent>
            
            <TabsContent value="products">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {routines[activeRoutine as keyof typeof routines].steps.map((step) => (
                  <Card key={step.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-32 bg-gray-100 flex items-center justify-center">
                      <div className="text-gray-400">Product Image</div>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-medium">{step.product}</h3>
                      <p className="text-sm text-gray-500 mt-1">Used in: {step.name}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0">
                      <Button variant="ghost" size="sm">View Details</Button>
                      <Button size="sm">Replace</Button>
                    </CardFooter>
                  </Card>
                ))}
                
                <Card className="border-dashed flex flex-col items-center justify-center p-6">
                  <Plus className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-center text-gray-500 mb-3">Add another product to this routine</p>
                  <Button>Add Product</Button>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tracking">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Routine Adherence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Last 7 Days</span>
                        <span className="font-medium">86%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '86%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Last 30 Days</span>
                        <span className="font-medium">72%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '72%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Streak Calendar</h4>
                    <div className="grid grid-cols-7 gap-2">
                      {[...Array(28)].map((_, i) => {
                        // Mock data - in real app this would be based on actual tracking
                        const status = Math.random() > 0.3 ? 'completed' : Math.random() > 0.5 ? 'partial' : 'missed';
                        return (
                          <div 
                            key={i} 
                            className={`h-8 w-8 rounded-md flex items-center justify-center text-xs ${
                              status === 'completed' ? 'bg-green-100 text-green-800' : 
                              status === 'partial' ? 'bg-amber-100 text-amber-800' : 
                              'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {i + 1}
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="flex justify-end mt-4">
                      <Button>View Full History</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations">
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">Premium Feature</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  Get AI-powered personalized recommendations to optimize your skincare routine based on your skin type, concerns, and product effectiveness.
                </p>
                <Button>Upgrade to Premium</Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800 mb-1">Important Notes</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Introduce new products one at a time with at least a week between additions</li>
                <li>• Always patch test new products, especially if you have sensitive skin</li>
                <li>• Adjust frequency of actives based on how your skin responds</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Routines;
