
import { SkinAnalysis } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

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
      pores: 'moderate',
      wrinkles: 'minimal',
      hydration: 'adequate',
      pigmentation: 'some uneven areas',
      sensitivity: 'low to moderate',
      analysis: 'Your skin shows characteristics of combination skin with some areas being oilier than others. There are signs of mild dehydration and early UV damage. Your skin barrier appears relatively healthy, though there are indications of some sensitivity around the cheek area.',
    },
    detectedIssues: ['mild acne', 'some dryness', 'slight uneven texture', 'minor hyperpigmentation'],
    severityScores: {
      acne: 3,
      dryness: 4,
      unevenTexture: 2,
      hyperpigmentation: 3,
      overallHealth: 7
    },
    recommendations: {
      products: [
        'Gentle non-foaming cleanser',
        'Hyaluronic acid serum',
        'Oil-free moisturizer',
        'Mineral sunscreen SPF 50',
        'Mild chemical exfoliant with AHAs'
      ],
      routines: [
        'Double cleansing in the evening',
        'Hydrating routine in the morning',
        'Exfoliation 2-3 times per week'
      ],
      tips: [
        'Drink more water',
        'Use sunscreen daily',
        'Avoid touching face',
        'Change pillowcase regularly',
        'Consider reducing dairy consumption'
      ]
    },
    createdAt: new Date()
  };
  
  return mockAnalysis;
};

// Save analysis to Supabase
const saveAnalysisToSupabase = async (analysis: SkinAnalysis, userId: string, imageFile: File): Promise<SkinAnalysis> => {
  try {
    // First, upload the image to Supabase Storage
    const timestamp = Date.now();
    const fileExt = imageFile.name.split('.').pop();
    const filePath = `skin-analyses/${userId}/${timestamp}.${fileExt}`;
    
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('skin-images')
      .upload(filePath, imageFile);
      
    if (uploadError) throw uploadError;
    
    // Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('skin-images')
      .getPublicUrl(filePath);
      
    // Save analysis data to the database
    const { error: insertError, data: insertedAnalysis } = await supabase
      .from('skin_analyses')
      .insert({
        user_id: userId,
        image_url: publicUrl,
        ai_analysis_results: analysis.aiAnalysisResults,
        detected_issues: analysis.detectedIssues,
        severity_scores: analysis.severityScores,
        recommendations: analysis.recommendations
      })
      .select('*')
      .single();
      
    if (insertError) throw insertError;
    
    // Return the analysis with the Supabase data
    return {
      ...analysis,
      id: insertedAnalysis.id,
      imageUrl: publicUrl,
      userId: insertedAnalysis.user_id,
      createdAt: new Date(insertedAnalysis.created_at)
    };
  } catch (error) {
    console.error('Error saving analysis to Supabase:', error);
    throw error;
  }
};

// Fetch a specific analysis by ID
const getAnalysisById = async (analysisId: string): Promise<SkinAnalysis | null> => {
  try {
    const { data, error } = await supabase
      .from('skin_analyses')
      .select('*')
      .eq('id', analysisId)
      .single();
      
    if (error) throw error;
    if (!data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      imageUrl: data.image_url,
      // Cast the JSON data to the correct types
      aiAnalysisResults: data.ai_analysis_results as Record<string, any>,
      detectedIssues: data.detected_issues as string[],
      severityScores: data.severity_scores as Record<string, number>,
      recommendations: data.recommendations as {
        products?: string[];
        routines?: string[];
        tips?: string[];
      },
      createdAt: new Date(data.created_at)
    };
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }
};

// Fetch all analyses for a user
const getUserAnalyses = async (userId: string): Promise<SkinAnalysis[]> => {
  try {
    const { data, error } = await supabase
      .from('skin_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      userId: item.user_id,
      imageUrl: item.image_url,
      // Cast the JSON data to the correct types
      aiAnalysisResults: item.ai_analysis_results as Record<string, any>,
      detectedIssues: item.detected_issues as string[],
      severityScores: item.severity_scores as Record<string, number>,
      recommendations: item.recommendations as {
        products?: string[];
        routines?: string[];
        tips?: string[];
      },
      createdAt: new Date(item.created_at)
    }));
  } catch (error) {
    console.error('Error fetching user analyses:', error);
    return [];
  }
};

export { analyzeSkinImage, saveAnalysisToSupabase, getAnalysisById, getUserAnalyses };
