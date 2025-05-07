
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, Loader2, Star, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getAIDoctorResponse, checkUserPremiumStatus } from '@/services/analysisService';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  recommendations?: any[];
  isLoading?: boolean;
}

interface AIDoctorChatProps {
  analysisId?: string;
  language?: 'en' | 'ar';
}

const AIDoctorChat: React.FC<AIDoctorChatProps> = ({ analysisId, language = 'en' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    // Initialize with a greeting message
    const initialMessage = getWelcomeMessage(language);
    setMessages([{
      id: 'welcome',
      content: initialMessage,
      sender: 'ai',
      timestamp: new Date()
    }]);
    
    // Check if user is premium
    if (user?.id) {
      checkUserPremiumStatus(user.id)
        .then(result => setIsPremium(result))
        .catch(error => {
          console.error('Error checking premium status:', error);
          setIsPremium(false);
        });
    }
  }, [user, language]);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const getWelcomeMessage = (lang: string): string => {
    if (lang === 'ar') {
      return 'مرحبًا! أنا الطبيب الإفتراضي المتخصص في العناية بالبشرة. كيف يمكنني مساعدتك اليوم؟';
    }
    return "Hello! I'm Dr. AI, your virtual dermatologist. How can I help with your skin concerns today?";
  };
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add placeholder for AI response
    const aiPlaceholder: Message = {
      id: `ai-${Date.now()}`,
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, userMessage, aiPlaceholder]);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await getAIDoctorResponse(
        user.id,
        newMessage,
        analysisId
      );
      
      // Update the placeholder with the actual response
      setMessages(prev => prev.map(msg => 
        msg.id === aiPlaceholder.id 
          ? {
              ...msg,
              content: response.response,
              recommendations: response.recommendations,
              isLoading: false
            } 
          : msg
      ));
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Update placeholder with error message
      setMessages(prev => prev.map(msg => 
        msg.id === aiPlaceholder.id 
          ? {
              ...msg,
              content: 'Sorry, I encountered an error. Please try again later.',
              isLoading: false
            } 
          : msg
      ));
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get AI response"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Format recommendations
  const renderRecommendations = (recommendations: any[]) => {
    return (
      <div className="mt-4 space-y-2">
        <h4 className="font-medium text-sm">Recommended Products:</h4>
        <div className="flex flex-wrap gap-2">
          {recommendations.map((rec, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              <span>{rec.name}</span>
              <span className="text-xs text-muted-foreground">({rec.type})</span>
            </Badge>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardContent className={cn("flex-1 overflow-y-auto p-4", language === 'ar' ? 'text-right' : '')}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={cn(
                "flex gap-3 max-w-[85%]", 
                message.sender === 'user' 
                  ? 'ml-auto flex-row-reverse' 
                  : 'mr-auto',
                language === 'ar' ? 'flex-row-reverse' : ''
              )}
            >
              <Avatar className={cn("h-8 w-8 shrink-0", message.sender === 'user' ? 'bg-primary' : 'bg-blue-600')}>
                {message.sender === 'user' ? (
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                ) : (
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className={cn("rounded-lg p-4", 
                message.sender === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              )}>
                {message.isLoading ? (
                  <div className="flex items-center justify-center h-6">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    
                    {/* Recommendations if present */}
                    {message.recommendations && message.recommendations.length > 0 && 
                      renderRecommendations(message.recommendations)
                    }
                    
                    {/* Premium badge on AI messages */}
                    {message.sender === 'ai' && isPremium && (
                      <div className="mt-2 flex items-center">
                        <Badge variant="outline" className="text-xs flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500" />
                          <span>Premium Response</span>
                        </Badge>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      {/* Input area */}
      <div className="border-t p-4 flex gap-2 items-end">
        {isPremium && (
          <span className="text-amber-500 mr-1">
            <Sparkles className="h-5 w-5" />
          </span>
        )}
        <Textarea 
          value={newMessage} 
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={language === 'ar' ? "اكتب رسالتك هنا..." : "Type your message here..."}
          className={cn("resize-none flex-1", language === 'ar' ? 'text-right' : '')} 
          rows={1}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
        />
        <Button 
          onClick={handleSendMessage} 
          disabled={isLoading || !newMessage.trim()} 
          size="icon"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
};

export default AIDoctorChat;
