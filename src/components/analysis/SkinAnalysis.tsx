import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Camera, AlertTriangle } from 'lucide-react';
import { analyzeSkinImage, saveAnalysisToSupabase } from '@/services/analysisService';
import { SkinAnalysis as SkinAnalysisType, PageProps } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const SkinAnalysis: React.FC<PageProps> = ({ language = 'en' }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SkinAnalysisType | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Text content based on selected language
  const texts = {
    title: language === 'ar' ? 'تحليل البشرة' : 'Skin Analysis',
    subtitle: language === 'ar' 
      ? 'قم بتحميل صورة شخصية جيدة الإضاءة للحصول على رؤى للبشرة مدعومة بالذكاء الاصطناعي'
      : 'Upload a well-lit selfie to receive AI-powered skin insights',
    // ... add more text translations as needed
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Validate file type
    if (!selectedFile.type.match('image.*')) {
      toast({
        variant: "destructive",
        title: language === 'ar' ? 'نوع ملف غير صالح' : 'Invalid file type',
        description: language === 'ar' 
          ? 'الرجاء تحديد ملف صورة (JPEG، PNG، إلخ)'
          : 'Please select an image file (JPEG, PNG, etc.)',
      });
      return;
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: language === 'ar' ? 'الملف كبير جدًا' : 'File too large',
        description: language === 'ar'
          ? 'الرجاء تحديد صورة أصغر من 10 ميجابايت'
          : 'Please select an image smaller than 10MB',
      });
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
    
    // Reset analysis result when new file is selected
    setAnalysisResult(null);
  };

  const handleCapturePhoto = () => {
    // In a real app, this would open the device camera
    // For now, we'll just click the file input
    document.getElementById('photo-upload')?.click();
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: language === 'ar' ? 'لم يتم تحديد صورة' : 'No image selected',
        description: language === 'ar'
          ? 'يرجى تحميل أو التقاط صورة أولاً'
          : 'Please upload or capture a photo first',
      });
      return;
    }
    
    if (!user) {
      toast({
        variant: "destructive",
        title: language === 'ar' ? 'المصادقة مطلوبة' : 'Authentication required',
        description: language === 'ar'
          ? 'يرجى تسجيل الدخول لتحليل بشرتك'
          : 'Please log in to analyze your skin',
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      const result = await analyzeSkinImage(file);
      
      // Save to Supabase
      const savedAnalysis = await saveAnalysisToSupabase(result, user.id, file);
      setAnalysisResult(savedAnalysis);
      
      toast({
        title: language === 'ar' ? 'اكتمل التحليل' : 'Analysis complete',
        description: language === 'ar'
          ? 'تحليل بشرتك جاهز للعرض'
          : 'Your skin analysis is ready to view',
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        variant: "destructive",
        title: language === 'ar' ? 'فشل التحليل' : 'Analysis failed',
        description: language === 'ar'
          ? 'لم نتمكن من تحليل بشرتك. يرجى المحاولة مرة أخرى'
          : 'We couldn\'t analyze your skin. Please try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewResults = () => {
    if (analysisResult) {
      navigate(`/analysis/${analysisResult.id}`);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 md:ml-64">
      <div className="max-w-3xl mx-auto">
        <h1 className={cn("text-3xl font-bold mb-2", language === 'ar' && "text-right")}>{texts.title}</h1>
        <p className={cn("text-gray-500 mb-6", language === 'ar' && "text-right")}>
          {texts.subtitle}
        </p>

        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Photo Guidelines</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-skin-green flex items-center justify-center text-xs">✓</div>
                  Take a close-up photo in natural light
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-skin-green flex items-center justify-center text-xs">✓</div>
                  Remove makeup and cleanse your face
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-skin-green flex items-center justify-center text-xs">✓</div>
                  Capture your entire face directly facing the camera
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-xs">✗</div>
                  Avoid harsh lighting or flash
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              {!preview ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                    <Label htmlFor="photo-upload" className="block">
                      <div className="h-48 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors">
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <span className="text-gray-600 font-medium">Upload Photo</span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG up to 10MB</span>
                      </div>
                    </Label>
                  </div>
                  
                  <Button 
                    onClick={handleCapturePhoto} 
                    variant="outline"
                    className="h-48"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Camera size={24} className="text-gray-400 mb-2" />
                      <span className="text-gray-600 font-medium">Take Photo</span>
                      <span className="text-xs text-gray-400 mt-1">Use your device camera</span>
                    </div>
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="relative aspect-square max-w-md mx-auto mb-4">
                    <img 
                      src={preview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-lg shadow-md"
                    />
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2 bg-white"
                      onClick={() => {
                        setPreview(null);
                        setFile(null);
                        setAnalysisResult(null);
                      }}
                    >
                      Change Photo
                    </Button>
                  </div>
                  
                  {!analysisResult && !isAnalyzing && (
                    <div className="flex justify-center">
                      <Button onClick={handleAnalyze} size="lg">
                        Analyze My Skin
                      </Button>
                    </div>
                  )}
                  
                  {isAnalyzing && (
                    <div className="text-center p-8">
                      <div className="inline-flex items-center justify-center p-4 bg-skin-blue/20 rounded-full mb-4">
                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Analyzing your skin...</h3>
                      <p className="text-gray-500">This will take a few moments</p>
                    </div>
                  )}
                </div>
              )}

              {analysisResult && (
                <div className="space-y-6 mt-8 py-6 border-t border-gray-200">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center p-4 bg-skin-green/20 rounded-full mb-4">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                        ✓
                      </div>
                    </div>
                    <h3 className="text-lg font-medium mb-2">Analysis Complete!</h3>
                    <p className="text-gray-500">We've analyzed your skin condition</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium mb-2">Detected Issues</h4>
                      <ul className="space-y-2">
                        {analysisResult.detectedIssues.map((issue, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <AlertTriangle size={16} className="text-amber-500" />
                            <span className="capitalize">{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium mb-2">Top Recommendations</h4>
                      <ul className="space-y-2">
                        {analysisResult.recommendations.tips?.slice(0, 3).map((tip, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-4 h-4 rounded-full bg-skin-blue flex items-center justify-center text-primary text-xs">
                              ✓
                            </div>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button onClick={handleViewResults} size="lg">
                      View Detailed Results
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className={cn("text-center text-sm text-gray-500", language === 'ar' && "text-right")}>
          <p>
            {language === 'ar' 
              ? 'خصوصيتك مهمة بالنسبة لنا. جميع الصور مشفرة وتتم معالجتها بشكل آمن.'
              : 'Your privacy is important to us. All photos are encrypted and processed securely.'}{' '}
            <a href="/privacy" className="text-primary hover:underline">
              {language === 'ar' ? 'تعلم المزيد' : 'Learn more'}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SkinAnalysis;
