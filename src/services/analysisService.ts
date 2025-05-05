
import { SkinAnalysis } from '@/types';

// In a real app, this would call Claude 3.7 API through a backend service
const analyzeSkinImage = async (imageFile: File): Promise<SkinAnalysis> => {
  // Mock API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // This is a mock response - in production this would be the actual AI analysis
  const mockAnalysis: SkinAnalysis = {
    id: `analysis-${Date.now()}`,
    userId: '123456',
    imageUrl: URL.createObjectURL(imageFile),
    aiAnalysisResults: {
      skinType: 'combination',
      skinTone: 'medium',
      skinCondition: 'good',
    },
    detectedIssues: ['mild acne', 'some dryness', 'slight uneven texture'],
    severityScores: {
      acne: 3,
      dryness: 4,
      unevenTexture: 2,
      overallHealth: 7
    },
    recommendations: {
      products: ['Gentle cleanser', 'Hyaluronic acid serum', 'Oil-free moisturizer'],
      routines: ['Double cleansing in the evening', 'Hydrating routine in the morning'],
      tips: ['Drink more water', 'Use sunscreen daily', 'Avoid touching face']
    },
    createdAt: new Date()
  };
  
  return mockAnalysis;
};

export { analyzeSkinImage };
