
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { getAIDoctorResponse, checkUserPremiumStatus } from '@/services/analysisService';
import { cn } from '@/lib/utils';
import { AIDoctorResponse } from '@/types';

interface AIDoctorChatProps {
  analysisId?: string;
  language?: 'en' | 'ar';
}

const AIDoctorChat: React.FC<AIDoctorChatProps> = ({ analysisId, language = 'en' }) => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{type: 'user' | 'ai', content: string | AIDoctorResponse}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Text content based on selected language
  const texts = {
    title: language === 'ar' ? 'استشر الطبيب الذكي' : 'Consult AI Doctor',
    subtitle: language === 'ar' 
      ? 'اطرح أسئلة متعلقة بالبشرة واحصل على إجابات مخصصة بناءً على حالة بشرتك'
      : 'Ask skin-related questions and get personalized answers based on your skin condition',
    placeholderQuestion: language === 'ar'
      ? 'ما هي أفضل المكونات لبشرتي الجافة؟'
      : 'What ingredients are best for my dry skin?',
    askButton: language === 'ar' ? 'اسأل' : 'Ask',
    loading: language === 'ar' ? 'يتم إعداد الإجابة...' : 'Getting answer...',
    premiumRequired: language === 'ar'
      ? 'ميزة الطبيب الذكي متاحة فقط للمستخدمين المميزين.'
      : 'AI Doctor feature is available only for premium users.',
    upgradeButton: language === 'ar' ? 'ترقية' : 'Upgrade',
    recommendations: language === 'ar' ? 'توصيات المنتجات:' : 'Product Recommendations:',
  };

  React.useEffect(() => {
    if (user?.id) {
      checkUserPremiumStatus(user.id)
        .then(status => setIsPremium(status))
        .catch(err => console.error('Error checking premium status:', err));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !user) return;
    
    const userQuestion = question;
    setQuestion('');
    setConversation(prev => [...prev, {type: 'user', content: userQuestion}]);
    setIsLoading(true);
    
    try {
      const response = await getAIDoctorResponse(user.id, userQuestion, analysisId);
      setConversation(prev => [...prev, {type: 'ai', content: response}]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        variant: "destructive",
        title: language === 'ar' ? "حدث خطأ" : "An error occurred",
        description: language === 'ar' 
          ? "لم نتمكن من الحصول على إجابة. يرجى المحاولة مرة أخرى لاحقًا." 
          : "We couldn't get an answer. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not premium, show upgrade prompt
  if (!isPremium) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="bg-muted/50 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Bot className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{texts.title}</h3>
            <p className="text-muted-foreground mb-6">{texts.premiumRequired}</p>
            <Button asChild>
              <a href="/upgrade">{texts.upgradeButton}</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{texts.title}</h3>
          <p className="text-muted-foreground">{texts.subtitle}</p>
        </div>
        
        <div className="border rounded-md mb-4 p-4 h-80 overflow-y-auto">
          {conversation.length === 0 ? (
            <div className="flex flex-col h-full items-center justify-center text-muted-foreground">
              <Bot className="h-10 w-10 mb-2" />
              <p>{language === 'ar' ? 'اسأل أي سؤال عن بشرتك' : 'Ask any question about your skin'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.map((message, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex items-start gap-3", 
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.type === 'ai' && (
                    <Avatar>
                      <AvatarFallback>AI</AvatarFallback>
                      <AvatarImage src="/doctor-avatar.png" />
                    </Avatar>
                  )}
                  
                  <div className={cn(
                    "rounded-lg p-3 max-w-[80%]",
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  )}>
                    {message.type === 'user' ? (
                      <p>{message.content as string}</p>
                    ) : (
                      <div>
                        <p>{(message.content as AIDoctorResponse).response}</p>
                        
                        {(message.content as AIDoctorResponse).recommendations && 
                         (message.content as AIDoctorResponse).recommendations!.length > 0 && (
                          <div className="mt-2 pt-2 border-t">
                            <p className="font-medium text-sm mb-1">{texts.recommendations}</p>
                            <ul className="space-y-1">
                              {(message.content as AIDoctorResponse).recommendations!.map((rec, i) => (
                                <li key={i} className="text-sm">
                                  <span className="font-medium">{rec.name}</span> ({rec.type})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {message.type === 'user' && (
                    <Avatar>
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback>AI</AvatarFallback>
                    <AvatarImage src="/doctor-avatar.png" />
                  </Avatar>
                  <div className="rounded-lg p-3 bg-muted flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p>{texts.loading}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea 
            placeholder={texts.placeholderQuestion}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className={cn("resize-none flex-1", language === 'ar' && "text-right")}
          />
          <Button type="submit" size="icon" disabled={isLoading || !question.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">{texts.askButton}</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AIDoctorChat;
