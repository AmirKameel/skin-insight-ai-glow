
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Search, Star, Tag, Calendar, ChevronRight, CheckCircle } from 'lucide-react';

const Knowledge = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock featured articles
  const featuredArticles = [
    {
      id: 1,
      title: "Understanding Your Skin Barrier",
      description: "Learn how your skin's natural barrier functions and how to protect it for healthier skin.",
      image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&q=80&w=500&h=280",
      tags: ["Education", "Skin Health"],
      readTime: "5 min",
      date: "Oct 15, 2023",
      premium: false
    },
    {
      id: 2,
      title: "The Science of Hydration",
      description: "Discover the scientific principles behind skin hydration and the best ingredients for lasting moisture.",
      image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&q=80&w=500&h=280",
      tags: ["Ingredients", "Hydration"],
      readTime: "7 min",
      date: "Sep 28, 2023",
      premium: true
    },
    {
      id: 3,
      title: "Acne: Causes and Solutions",
      description: "A comprehensive guide to understanding acne formation and evidence-based treatment approaches.",
      image: "https://images.unsplash.com/photo-1607354175781-c62db53329a4?auto=format&fit=crop&q=80&w=500&h=280",
      tags: ["Acne", "Treatment"],
      readTime: "9 min",
      date: "Oct 5, 2023",
      premium: false
    }
  ];

  // Mock recent articles
  const recentArticles = [
    {
      id: 4,
      title: "Retinoids: Benefits and Best Practices",
      description: "Everything you need to know about retinoid types, application methods, and how to avoid irritation.",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=500&h=280",
      tags: ["Ingredients", "Anti-aging"],
      readTime: "8 min",
      date: "Oct 12, 2023",
      premium: false
    },
    {
      id: 5,
      title: "Understanding Skin Types",
      description: "How to accurately determine your skin type and tailor your skincare routine accordingly.",
      image: "https://images.unsplash.com/photo-1599840464536-d45697907d1c?auto=format&fit=crop&q=80&w=500&h=280",
      tags: ["Education", "Routine"],
      readTime: "6 min",
      date: "Oct 8, 2023",
      premium: false
    },
    {
      id: 6,
      title: "Advanced Hyperpigmentation Treatments",
      description: "Clinical approaches to treating stubborn hyperpigmentation issues.",
      image: "https://images.unsplash.com/photo-1629732097571-b496e5770a5d?auto=format&fit=crop&q=80&w=500&h=280",
      tags: ["Treatment", "Pigmentation"],
      readTime: "10 min",
      date: "Oct 1, 2023",
      premium: true
    }
  ];

  // Mock guides
  const skinGuides = [
    {
      id: 7,
      title: "Complete Guide to Exfoliation",
      description: "Learn about chemical vs. physical exfoliation and how to safely incorporate it into your routine.",
      steps: 5,
      complexity: "Intermediate"
    },
    {
      id: 8,
      title: "Building a Basic Skincare Routine",
      description: "The essential steps and products for beginners to create an effective skincare routine.",
      steps: 3,
      complexity: "Beginner"
    },
    {
      id: 9,
      title: "Addressing Mature Skin Concerns",
      description: "Specialized routine and product recommendations for aging skin.",
      steps: 7,
      complexity: "Advanced"
    }
  ];

  // Filter articles based on search query
  const filteredFeatured = featuredArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredRecent = recentArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredGuides = skinGuides.filter(guide =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.complexity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Article Card Component
  const ArticleCard = ({ article }: { article: typeof featuredArticles[0] }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-44 object-cover"
        />
        {article.premium && (
          <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <Star className="w-3 h-3 mr-1" /> Premium
          </div>
        )}
      </div>
      <CardContent className="pt-4">
        <div className="flex gap-2 mb-2">
          {article.tags.map((tag, i) => (
            <Badge key={i} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <h3 className="font-medium text-lg mb-2">{article.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{article.description}</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            {article.date}
          </div>
          <div>{article.readTime} read</div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="link" className="p-0 h-auto">
          Read More <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );

  // Guide Card Component
  const GuideCard = ({ guide }: { guide: typeof skinGuides[0] }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{guide.title}</CardTitle>
        <CardDescription>{guide.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Badge variant="outline" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {guide.steps} Steps
            </Badge>
          </div>
          <Badge className={guide.complexity === 'Beginner' ? 'bg-green-100 text-green-800' : guide.complexity === 'Intermediate' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
            {guide.complexity}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Guide</Button>
      </CardFooter>
    </Card>
  );

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 md:ml-64">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Knowledge Center</h1>
          <p className="text-gray-500">Expand your skincare expertise</p>
        </div>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input 
          placeholder="Search articles, guides, ingredients..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="articles">
        <TabsList className="mb-6">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="articles">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Featured Articles</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFeatured.length > 0 ? (
                filteredFeatured.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">No featured articles match your search.</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Recent Articles</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecent.length > 0 ? (
                filteredRecent.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">No recent articles match your search.</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="guides">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Skincare Guides</h2>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredGuides.length > 0 ? (
                filteredGuides.map(guide => (
                  <GuideCard key={guide.id} guide={guide} />
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <p className="text-gray-500">No guides match your search.</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Premium Masterclasses</h2>
            </div>
            
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-6">
                  <Badge className="mb-3 bg-amber-100 text-amber-800 hover:bg-amber-200">
                    <Star className="w-3 h-3 mr-1" /> Premium Exclusive
                  </Badge>
                  <h3 className="text-2xl font-bold mb-3">Complete Skincare Masterclass</h3>
                  <p className="text-gray-600 mb-6">
                    Join our comprehensive masterclass covering everything from the science of skin to advanced routines and product formulations.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>10 detailed video lessons by dermatologists</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Downloadable resources and routine guides</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                      <span>Access to exclusive Q&A sessions</span>
                    </li>
                  </ul>
                  <Button size="lg">Upgrade to Access</Button>
                </div>
                <div className="hidden md:block">
                  <img 
                    src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80" 
                    alt="Masterclass" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ingredients">
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={24} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Ingredient Directory Coming Soon</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Our comprehensive ingredient database is being prepared by our team of dermatologists and scientists.
            </p>
            <Button>
              <Star className="mr-2 h-4 w-4" />
              Upgrade for Early Access
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <Tag size={24} className="text-amber-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Save Articles for Later</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Bookmark articles and guides to build your personal skincare knowledge library.
            </p>
            <Button variant="outline">Browse Articles</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Knowledge;
