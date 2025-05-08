
import { supabase } from '@/integrations/supabase/client';
import { SkinAnalysis, AIDoctorResponse, JournalEntry } from '@/types';

// Get all analyses for a user
export async function getUserAnalyses(userId: string): Promise<SkinAnalysis[]> {
  const { data, error } = await supabase
    .from('skin_analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching analyses:', error);
    return [];
  }

  return data.map(analysis => ({
    id: analysis.id,
    userId: analysis.user_id,
    imageUrl: analysis.image_url || '',
    createdAt: new Date(analysis.created_at),
    detectedIssues: analysis.detected_issues || [],
    recommendations: typeof analysis.recommendations === 'object' ? {
      products: Array.isArray(analysis.recommendations.products) ? analysis.recommendations.products : [],
      routines: Array.isArray(analysis.recommendations.routines) ? analysis.recommendations.routines : [],
      tips: Array.isArray(analysis.recommendations.tips) ? analysis.recommendations.tips : []
    } : {
      products: [],
      routines: [],
      tips: []
    },
    severityScores: typeof analysis.severity_scores === 'object' ? analysis.severity_scores : {},
    aiAnalysisResults: typeof analysis.ai_analysis_results === 'object' ? analysis.ai_analysis_results : {}
  }));
}

// Get a specific analysis by ID
export async function getAnalysisById(analysisId: string): Promise<SkinAnalysis | null> {
  const { data, error } = await supabase
    .from('skin_analyses')
    .select('*')
    .eq('id', analysisId)
    .single();

  if (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    imageUrl: data.image_url || '',
    createdAt: new Date(data.created_at),
    detectedIssues: data.detected_issues || [],
    recommendations: typeof data.recommendations === 'object' ? {
      products: Array.isArray(data.recommendations.products) ? data.recommendations.products : [],
      routines: Array.isArray(data.recommendations.routines) ? data.recommendations.routines : [],
      tips: Array.isArray(data.recommendations.tips) ? data.recommendations.tips : []
    } : {
      products: [],
      routines: [],
      tips: []
    },
    severityScores: typeof data.severity_scores === 'object' ? data.severity_scores : {},
    aiAnalysisResults: typeof data.ai_analysis_results === 'object' ? data.ai_analysis_results : {}
  };
}

// Check if user has premium status
export async function checkUserPremiumStatus(userId: string): Promise<boolean> {
  // First, try to use the database function
  try {
    const { data, error } = await supabase.rpc('is_premium_user', { user_uuid: userId });
    
    if (!error && data !== null) {
      console.log("Premium status from DB function:", data);
      return data;
    }
  } catch (e) {
    console.error("Error checking premium status with RPC:", e);
  }

  // Fallback: check subscriptions table directly
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('subscription_tier', 'premium')
      .eq('is_active', true)
      .single();

    if (!error && data) {
      // Check if subscription is still valid
      const isValid = !data.end_date || new Date(data.end_date) > new Date();
      console.log("Premium status from direct check:", isValid);
      return isValid;
    }
  } catch (e) {
    console.error("Error checking premium status directly:", e);
  }

  return false;
}

// Get premium recommendations
export async function getPremiumRecommendations(analysisId: string): Promise<any> {
  // This would normally fetch data from your backend API
  // For now, we'll return mock data
  return {
    personalizedRoutines: {
      morning: [
        "Gentle cleanser",
        "Vitamin C serum",
        "Moisturizer with SPF 50"
      ],
      evening: [
        "Oil cleanser",
        "Water-based cleanser",
        "Retinol serum",
        "Night cream"
      ]
    },
    treatmentOptions: [
      {
        name: "Hydration Boost Program",
        description: "A 4-week intensive hydration program to restore your skin's moisture barrier.",
        duration: "4 weeks",
        recommendedProducts: ["Hyaluronic acid serum", "Ceramide cream", "Hydrating mask"]
      },
      {
        name: "Texture Improvement Plan",
        description: "A gentle exfoliation regimen designed to smooth skin texture over 6 weeks.",
        duration: "6 weeks",
        recommendedProducts: ["AHA/BHA exfoliant", "Niacinamide serum", "Barrier repair cream"]
      }
    ],
    expertAnalysis: {
      diagnosis: "Your skin shows signs of dehydration with some texture irregularities. The moisture barrier appears slightly compromised.",
      recommendations: "Focus on hydration and barrier repair for the next 4-6 weeks before addressing texture concerns.",
      keyIngredients: ["Hyaluronic Acid", "Ceramides", "Niacinamide", "Panthenol"]
    }
  };
}

// Track treatment progress
export async function trackTreatmentProgress(analysisId: string, solutionIndex: number): Promise<boolean> {
  try {
    // Call the RPC function to insert the treatment tracking
    const { data, error } = await supabase.rpc('insert_treatment_tracking', {
      p_analysis_id: analysisId,
      p_solution_index: solutionIndex,
      p_start_date: new Date().toISOString(),
      p_status: 'active',
      p_progress: JSON.stringify({ week1: { completed: false }, week2: { completed: false } })
    });

    if (error) {
      console.error('Error tracking treatment:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in trackTreatmentProgress:', error);
    return false;
  }
}

// Add functions for skin image analysis
export async function analyzeSkinImage(file: File): Promise<any> {
  // Mock implementation for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        detectedIssues: ['dryness', 'fine lines', 'uneven texture'],
        severityScores: {
          dryness: 7,
          'fine lines': 5,
          'uneven texture': 6
        },
        recommendations: {
          products: ['Hyaluronic acid serum', 'Retinol cream', 'SPF 50 sunscreen'],
          routines: ['Morning hydration', 'Evening repair'],
          tips: [
            'Drink more water',
            'Use a humidifier in dry environments',
            'Apply sunscreen daily'
          ]
        }
      });
    }, 1500);
  });
}

export async function saveAnalysisToSupabase(analysis: any, userId: string, file: File): Promise<SkinAnalysis> {
  // Upload image to storage
  const timestamp = Date.now();
  const fileExt = file.name.split('.').pop();
  const filePath = `skin-analyses/${userId}/${timestamp}.${fileExt}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('skin-images')
    .upload(filePath, file);
    
  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw new Error('Failed to upload image');
  }
  
  // Get public URL
  const { data: urlData } = await supabase.storage
    .from('skin-images')
    .getPublicUrl(filePath);
    
  const imageUrl = urlData?.publicUrl || '';
  
  // Save analysis to database
  const { data, error } = await supabase
    .from('skin_analyses')
    .insert([
      {
        user_id: userId,
        image_url: imageUrl,
        detected_issues: analysis.detectedIssues,
        severity_scores: analysis.severityScores,
        recommendations: analysis.recommendations,
        ai_analysis_results: analysis
      }
    ])
    .select()
    .single();
    
  if (error) {
    console.error('Error saving analysis:', error);
    throw new Error('Failed to save analysis');
  }
  
  return {
    id: data.id,
    userId: data.user_id,
    imageUrl: data.image_url,
    createdAt: new Date(data.created_at),
    detectedIssues: data.detected_issues || [],
    recommendations: typeof data.recommendations === 'object' ? {
      products: Array.isArray(data.recommendations.products) ? data.recommendations.products : [],
      routines: Array.isArray(data.recommendations.routines) ? data.recommendations.routines : [],
      tips: Array.isArray(data.recommendations.tips) ? data.recommendations.tips : []
    } : {
      products: [],
      routines: [],
      tips: []
    },
    severityScores: typeof data.severity_scores === 'object' ? data.severity_scores : {},
    aiAnalysisResults: typeof data.ai_analysis_results === 'object' ? data.ai_analysis_results : {}
  };
}

// Add functions for Journal page
export async function getJournalEntries(userId: string): Promise<JournalEntry[]> {
  const { data, error } = await supabase
    .from('skin_journal')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching journal entries:', error);
    return [];
  }

  return data || [];
}

export async function createJournalEntry(userId: string, entryData: any): Promise<boolean> {
  const { error } = await supabase
    .from('skin_journal')
    .insert([{
      user_id: userId,
      mood: entryData.mood,
      notes: entryData.notes,
      sleep_quality: entryData.sleep_quality,
      stress_level: entryData.stress_level,
      image_url: entryData.image_url,
    }]);

  if (error) {
    console.error('Error creating journal entry:', error);
    return false;
  }

  return true;
}

// Add functions for premium features
export async function getAIDoctorResponse(userId: string, question: string, analysisId?: string): Promise<AIDoctorResponse> {
  // Mock implementation for now
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        response: `Based on your skin analysis and question about "${question}", I recommend focusing on hydration and gentle exfoliation. Your skin appears to need more moisture, so incorporating a hyaluronic acid serum would be beneficial. For your concern about redness, consider products with centella asiatica or niacinamide.`,
        recommendations: [
          { name: "Hyaluronic Acid Serum", type: "Hydration" },
          { name: "Centella Asiatica Extract", type: "Soothing" },
          { name: "Niacinamide Serum", type: "Redness Relief" }
        ]
      });
    }, 1000);
  });
}

export async function generatePersonalizedRoutines(userId: string, analysisId?: string): Promise<any> {
  // Mock implementation for now
  return {
    morning: [
      {
        step: "Cleanse",
        product: "Gentle Foaming Cleanser",
        description: "Use a pea-sized amount with lukewarm water"
      },
      {
        step: "Tone",
        product: "Hydrating Toner",
        description: "Apply with cotton pad or pat into skin with hands"
      },
      {
        step: "Treat",
        product: "Vitamin C Serum",
        description: "Apply 3-4 drops to entire face"
      },
      {
        step: "Moisturize",
        product: "Lightweight Gel Moisturizer",
        description: "Apply a thin layer to face and neck"
      },
      {
        step: "Protect",
        product: "Broad Spectrum SPF 50",
        description: "Apply generously 15 minutes before sun exposure"
      }
    ],
    evening: [
      {
        step: "Oil Cleanse",
        product: "Cleansing Oil",
        description: "Massage onto dry skin, then rinse"
      },
      {
        step: "Water-based Cleanse",
        product: "Gentle Foaming Cleanser",
        description: "Use a pea-sized amount with lukewarm water"
      },
      {
        step: "Tone",
        product: "Hydrating Toner",
        description: "Apply with cotton pad or pat into skin with hands"
      },
      {
        step: "Treat",
        product: "Retinol Serum",
        description: "Apply 2-3 drops to entire face, avoiding eye area"
      },
      {
        step: "Hydrate",
        product: "Hyaluronic Acid Serum",
        description: "Apply to slightly damp skin"
      },
      {
        step: "Moisturize",
        product: "Rich Night Cream",
        description: "Apply a generous layer to face and neck"
      }
    ]
  };
}
