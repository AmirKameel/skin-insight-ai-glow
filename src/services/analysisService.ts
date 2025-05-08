
import { supabase } from '@/integrations/supabase/client';
import { SkinAnalysis } from '@/types';

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
    ...analysis,
    createdAt: new Date(analysis.created_at),
    detectedIssues: analysis.detected_issues || [],
    recommendations: analysis.recommendations || {
      products: [],
      routines: [],
      tips: []
    },
    severityScores: analysis.severity_scores || {},
    aiAnalysisResults: analysis.ai_analysis_results || {}
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
    ...data,
    createdAt: new Date(data.created_at),
    detectedIssues: data.detected_issues || [],
    recommendations: data.recommendations || {
      products: [],
      routines: [],
      tips: []
    },
    severityScores: data.severity_scores || {},
    aiAnalysisResults: data.ai_analysis_results || {}
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
