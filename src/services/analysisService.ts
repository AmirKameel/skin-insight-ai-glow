
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
    console.log('Saving analysis to Supabase for user:', userId);
    
    // First, upload the image to Supabase Storage
    const timestamp = Date.now();
    const fileExt = imageFile.name.split('.').pop();
    const filePath = `${userId}/${timestamp}.${fileExt}`;
    
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('skin-images')
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }
    
    console.log('Image uploaded successfully:', uploadData);
    
    // Get the public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('skin-images')
      .getPublicUrl(filePath);
      
    console.log('Public URL:', publicUrl);
      
    // Save analysis data to the database
    const { error: insertError, data: insertedAnalysis } = await supabase
      .from('skin_analyses')
      .insert({
        user_id: userId,
        image_url: publicUrl,
        ai_analysis_results: analysis.aiAnalysisResults as Json,
        detected_issues: analysis.detectedIssues,
        severity_scores: analysis.severityScores as Json,
        recommendations: analysis.recommendations as Json
      })
      .select('*')
      .single();
      
    if (insertError) {
      console.error('Error inserting analysis:', insertError);
      throw insertError;
    }
    
    console.log('Analysis saved successfully:', insertedAnalysis);
    
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

// Get premium skincare product recommendations
const getPremiumRecommendations = async (analysisId: string): Promise<any> => {
  // In a real app, this would call a premium API or service
  // For now, we'll return mock premium recommendations
  return {
    premiumProducts: [
      {
        name: "Advanced Hydration Serum",
        brand: "SkinElite",
        price: "$89.99",
        description: "Pharmaceutical-grade hyaluronic acid complex with ceramides for deep hydration",
        affiliateLink: "https://example.com/product1"
      },
      {
        name: "Vitamin C Brightening Treatment",
        brand: "DermScience",
        price: "$115.00",
        description: "15% stabilized vitamin C with ferulic acid and vitamin E for advanced brightening",
        affiliateLink: "https://example.com/product2"
      },
      {
        name: "Retinol Renewal Night Cream",
        brand: "ClinicalSkin",
        price: "$95.00",
        description: "Encapsulated retinol with peptide complex for overnight skin renewal",
        affiliateLink: "https://example.com/product3"
      }
    ],
    customRoutine: {
      morning: [
        "Gentle cleanser",
        "Antioxidant serum",
        "Hydrating moisturizer",
        "Broad-spectrum SPF"
      ],
      evening: [
        "Oil-based cleanser",
        "Water-based cleanser",
        "Treatment serum",
        "Moisturizer",
        "Targeted treatment"
      ],
      weekly: [
        "Gentle exfoliation",
        "Hydrating mask",
        "Detoxifying mask"
      ]
    },
    treatmentOptions: [
      {
        id: 1,
        name: "Conservative Treatment",
        description: "A gentle approach focused on hydration and barrier repair",
        duration: "6-8 weeks",
        steps: [
          "Introduce ceramide-rich moisturizer",
          "Add hyaluronic acid serum",
          "Gentle PHA exfoliation once weekly"
        ],
        expectedResults: "Improved hydration, reduced sensitivity, better barrier function"
      },
      {
        id: 2,
        name: "Moderate Treatment",
        description: "Balanced approach addressing multiple concerns simultaneously",
        duration: "8-10 weeks",
        steps: [
          "Introduce retinol (2x weekly)",
          "Add niacinamide serum",
          "Weekly BHA treatment for congestion"
        ],
        expectedResults: "Improved texture, reduced breakouts, more even skin tone"
      },
      {
        id: 3,
        name: "Intensive Treatment",
        description: "Accelerated approach for those seeking faster results",
        duration: "10-12 weeks",
        steps: [
          "Alternate retinol and AHA treatments",
          "Vitamin C + Ferulic for morning antioxidant protection",
          "Intensive hydration and barrier support"
        ],
        expectedResults: "Significant improvement in texture, tone, and clarity with possible initial purging"
      }
    ]
  };
};

// Track treatment progress
const trackTreatmentProgress = async (analysisId: string, selectedSolutionIndex: number): Promise<void> => {
  // In a real app, this would save the treatment plan and track progress in the database
  console.log(`Starting treatment plan ${selectedSolutionIndex} for analysis ${analysisId}`);
  
  // This would normally save to the database
  try {
    // Using a raw insert query instead of using the treatment_tracking table directly
    // since the TypeScript types don't know about our new table yet
    await supabase.rpc('insert_treatment_tracking', {
      p_analysis_id: analysisId,
      p_solution_index: selectedSolutionIndex,
      p_start_date: new Date().toISOString(),
      p_status: 'active',
      p_progress: JSON.stringify({
        days_completed: 0,
        total_days: 30,
        checkpoints: [],
        next_checkup: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      })
    });
  } catch (error) {
    console.error('Error tracking treatment progress:', error);
    // No need to throw the error here as this is just a mock
  }
};

// Create journal entry to track progress
const createJournalEntry = async (userId: string, data: {
  mood: string;
  notes: string;
  sleep_quality: number;
  stress_level: number;
  image_url?: string;
}): Promise<any> => {
  try {
    const { error, data: journalEntry } = await supabase
      .from('skin_journal')
      .insert({
        user_id: userId,
        mood: data.mood,
        notes: data.notes,
        sleep_quality: data.sleep_quality,
        stress_level: data.stress_level,
        image_url: data.image_url,
        // Convert Date to ISO string to match the expected string type
        date: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) throw error;
    return journalEntry;
  } catch (error) {
    console.error('Error creating journal entry:', error);
    throw error;
  }
};

// Get journal entries
const getJournalEntries = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('skin_journal')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return [];
  }
};

export { 
  analyzeSkinImage, 
  saveAnalysisToSupabase, 
  getAnalysisById, 
  getUserAnalyses, 
  getPremiumRecommendations, 
  trackTreatmentProgress,
  createJournalEntry,
  getJournalEntries
};
