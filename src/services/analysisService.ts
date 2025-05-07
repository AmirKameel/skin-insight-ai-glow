
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

// Check if a user is premium
const checkUserPremiumStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('is_premium_user', { user_uuid: userId });
    
    if (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

// Get premium skincare product recommendations
const getPremiumRecommendations = async (analysisId: string): Promise<any> => {
  // Check if the analysis exists and get the user id
  try {
    const { data: analysis, error: analysisError } = await supabase
      .from('skin_analyses')
      .select('user_id')
      .eq('id', analysisId)
      .single();
    
    if (analysisError || !analysis) {
      console.error('Error fetching analysis:', analysisError);
      throw new Error('Analysis not found');
    }
    
    // Check if the user is premium
    const isPremium = await checkUserPremiumStatus(analysis.user_id);
    if (!isPremium) {
      return {
        isPremium: false,
        message: 'Please upgrade to premium to access detailed product recommendations'
      };
    }
    
    // In a real app, this would call a premium API or service
    // For now, we'll return mock premium recommendations
    return {
      isPremium: true,
      premiumProducts: [
        {
          name: "Advanced Hydration Serum",
          brand: "SkinElite",
          price: "$89.99",
          description: "Pharmaceutical-grade hyaluronic acid complex with ceramides for deep hydration",
          affiliateLink: "https://example.com/product1",
          ingredients: ["Hyaluronic Acid", "Ceramides", "Niacinamide", "Peptide Complex"],
          scientificBacking: "Clinically proven to increase hydration by 87% within 24 hours"
        },
        {
          name: "Vitamin C Brightening Treatment",
          brand: "DermScience",
          price: "$115.00",
          description: "15% stabilized vitamin C with ferulic acid and vitamin E for advanced brightening",
          affiliateLink: "https://example.com/product2",
          ingredients: ["L-Ascorbic Acid", "Ferulic Acid", "Vitamin E", "Glutathione"],
          scientificBacking: "Reduces hyperpigmentation by 63% in clinical trials"
        },
        {
          name: "Retinol Renewal Night Cream",
          brand: "ClinicalSkin",
          price: "$95.00",
          description: "Encapsulated retinol with peptide complex for overnight skin renewal",
          affiliateLink: "https://example.com/product3",
          ingredients: ["Encapsulated Retinol", "Peptide Complex", "Squalane", "Ceramides"],
          scientificBacking: "Increases cell turnover by 45% compared to standard retinol formulations"
        },
        {
          name: "AHA/BHA Resurfacing Serum",
          brand: "PureDerm",
          price: "$78.00",
          description: "Blend of glycolic, lactic, and salicylic acids for gentle but effective exfoliation",
          affiliateLink: "https://example.com/product4",
          ingredients: ["Glycolic Acid", "Lactic Acid", "Salicylic Acid", "Centella Asiatica"],
          scientificBacking: "Improves skin texture by 74% after 8 weeks of use"
        }
      ],
      customRoutine: {
        morning: [
          "Gentle pH-balanced cleanser",
          "Vitamin C serum with ferulic acid",
          "Hydrating toner with beta-glucan",
          "Niacinamide and ceramide moisturizer",
          "Broad-spectrum mineral SPF 50 with iron oxides"
        ],
        evening: [
          "Oil-based cleanser",
          "Gentle foaming cleanser",
          "AHA/BHA treatment (3x weekly)",
          "Retinol serum (alternate nights)",
          "Advanced peptide moisturizer",
          "Occlusive barrier repair cream"
        ],
        weekly: [
          "Enzyme exfoliation treatment",
          "Hydrating mask with hyaluronic acid",
          "Clay-based detoxifying mask for T-zone"
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
      ],
      detailedAnalysis: {
        skinBarrierHealth: "72% - Mild impairment",
        inflammationLevel: "Moderate, localized to cheek areas",
        hydrationStatus: "Below optimal (32% vs target 45-50%)",
        antioxidantProtection: "Low-moderate, indicating environmental damage",
        cellTurnoverRate: "Sluggish, approximately 35 days vs optimal 28 days",
        microbiomeBalance: "Disrupted, with reduced diversity of beneficial bacteria"
      }
    };
  } catch (error) {
    console.error('Error fetching premium recommendations:', error);
    throw error;
  }
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
      p_progress: {
        days_completed: 0,
        total_days: 30,
        checkpoints: [],
        next_checkup: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      }
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

// AI Doctor chat for personalized advice
const getAIDoctorResponse = async (
  userId: string, 
  message: string, 
  analysisId?: string
): Promise<{ 
  response: string, 
  recommendations?: any[]
}> => {
  try {
    // Check if premium first
    const isPremium = await checkUserPremiumStatus(userId);
    
    // Get user's latest analysis if analysisId not provided
    let analysis = null;
    if (analysisId) {
      const { data, error } = await supabase
        .from('skin_analyses')
        .select('*')
        .eq('id', analysisId)
        .single();
      
      if (!error && data) {
        analysis = data;
      }
    } else {
      const { data, error } = await supabase
        .from('skin_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!error && data) {
        analysis = data;
      }
    }
    
    // Mock AI doctor response based on user's analysis
    let response = '';
    let recommendations = [];
    
    if (analysis) {
      // In a real app, this would call Claude 3.7 API with the analysis and user message
      // Fake context-aware response
      if (message.toLowerCase().includes('routine')) {
        response = `Based on your skin analysis showing ${analysis.detected_issues.join(', ')}, I'd recommend a gentle cleanser, hydrating serum, and SPF 50 for your morning routine. In the evening, consider double cleansing followed by a mild retinol product and barrier-repairing moisturizer.`;
        
        recommendations = [
          { name: "CeraVe Hydrating Cleanser", type: "Cleanser" },
          { name: "The Ordinary Hyaluronic Acid 2% + B5", type: "Serum" },
          { name: "La Roche-Posay Anthelios SPF 50", type: "Sunscreen" }
        ];
      } else if (message.toLowerCase().includes('acne') || analysis.detected_issues.includes('mild acne')) {
        response = `For your acne concerns, I notice your skin analysis showed mild acne. I recommend incorporating a salicylic acid cleanser 2-3 times weekly, avoiding comedogenic products, and adding a niacinamide serum to help regulate sebum production.`;
        
        recommendations = [
          { name: "Paula's Choice 2% BHA Liquid Exfoliant", type: "Treatment" },
          { name: "The Ordinary Niacinamide 10% + Zinc 1%", type: "Serum" }
        ];
      } else if (message.toLowerCase().includes('hydration') || analysis.detected_issues.includes('some dryness')) {
        response = `To address the dryness indicated in your skin analysis, focus on incorporating humectants like hyaluronic acid and glycerin, followed by emollients to lock in moisture. Consider using a hydrating toner and adding a weekly hydrating mask.`;
        
        recommendations = [
          { name: "Hada Labo Gokujyun Premium Hyaluronic Solution", type: "Toner" },
          { name: "Neutrogena Hydro Boost Gel Cream", type: "Moisturizer" }
        ];
      } else {
        response = `Based on your skin analysis from ${new Date(analysis.created_at).toLocaleDateString()}, I see you have ${analysis.detected_issues.join(', ')}. Your overall skin health score is ${analysis.severity_scores.overallHealth}/10. How can I help you with your specific skin concerns today?`;
      }
    } else {
      response = "I don't have any skin analysis data for you yet. Would you like to complete a skin analysis first? This will help me provide more personalized recommendations for your specific skin concerns.";
    }
    
    // Add premium-specific advice
    if (isPremium) {
      response += "\n\nAs a premium member, I recommend checking out our personalized treatment options tailored specifically for your skin profile. You also have access to our advanced product formulation recommendations.";
    } else {
      response += "\n\nFor more personalized recommendations and detailed analysis, consider upgrading to our premium plan.";
    }
    
    // Add Arabic translation option mention
    response += "\n\nNote: You can switch to Arabic language in the settings if you prefer.";
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      response,
      recommendations: recommendations.length > 0 ? recommendations : undefined
    };
  } catch (error) {
    console.error('Error getting AI doctor response:', error);
    return {
      response: "I'm sorry, I encountered an error processing your request. Please try again later."
    };
  }
};

// Generate personalized routines based on analysis
const generatePersonalizedRoutines = async (userId: string, analysisId?: string): Promise<{
  morning: string[];
  evening: string[];
  weekly: string[];
}> => {
  try {
    // Get the latest analysis if not specified
    let analysis = null;
    if (analysisId) {
      const { data, error } = await supabase
        .from('skin_analyses')
        .select('*')
        .eq('id', analysisId)
        .single();
      
      if (!error && data) {
        analysis = data;
      }
    } else {
      const { data, error } = await supabase
        .from('skin_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (!error && data) {
        analysis = data;
      }
    }
    
    if (!analysis) {
      // Default routine if no analysis found
      return {
        morning: [
          "Gentle cleanser",
          "Hydrating toner",
          "Moisturizer",
          "Sunscreen SPF 30+"
        ],
        evening: [
          "Makeup remover (if applicable)",
          "Gentle cleanser",
          "Hydrating toner",
          "Moisturizer"
        ],
        weekly: [
          "Gentle exfoliation",
          "Hydrating mask"
        ]
      };
    }
    
    // Generate personalized routines based on analysis
    const detectedIssues = analysis.detected_issues || [];
    const skinType = analysis.ai_analysis_results?.skinType || 'combination';
    
    const isPremium = await checkUserPremiumStatus(userId);
    
    // Base routines everyone gets
    let morningRoutine = [
      "Gentle cleanser",
      "Hydrating toner",
      "Moisturizer",
      "Sunscreen SPF 50"
    ];
    
    let eveningRoutine = [
      "Oil cleanser",
      "Water-based cleanser", 
      "Hydrating toner",
      "Moisturizer"
    ];
    
    let weeklyRoutine = [
      "Gentle exfoliation",
      "Hydrating mask"
    ];
    
    // Customize based on skin issues
    if (detectedIssues.some(issue => issue.includes('acne'))) {
      morningRoutine.splice(2, 0, "Niacinamide serum");
      eveningRoutine.splice(3, 0, "BHA treatment (2-3x weekly)");
      weeklyRoutine.push("Clay mask for T-zone");
    }
    
    if (detectedIssues.some(issue => issue.includes('dryness'))) {
      morningRoutine.splice(2, 0, "Hyaluronic acid serum");
      eveningRoutine.splice(3, 0, "Rich hydrating serum");
      eveningRoutine.push("Occlusive as last step (petroleum jelly or balm)");
      weeklyRoutine.push("Overnight hydrating mask");
    }
    
    if (detectedIssues.some(issue => issue.includes('hyperpigmentation'))) {
      morningRoutine.splice(2, 0, "Vitamin C serum");
      eveningRoutine.splice(3, 0, "Alpha arbutin or tranexamic acid");
      weeklyRoutine.push("Brightening mask");
    }
    
    if (detectedIssues.some(issue => issue.includes('texture'))) {
      eveningRoutine.splice(3, 0, "AHA treatment (2-3x weekly)");
      weeklyRoutine.push("Chemical exfoliation treatment");
    }
    
    // Premium users get more advanced routines
    if (isPremium) {
      if (skinType === 'oily' || skinType === 'combination') {
        morningRoutine.splice(2, 0, "Oil-control toner with witch hazel");
        eveningRoutine.splice(3, 0, "Azelaic acid treatment");
      }
      
      if (detectedIssues.some(issue => issue.includes('wrinkle') || issue.includes('aging'))) {
        morningRoutine.splice(2, 0, "Peptide complex");
        eveningRoutine.splice(3, 0, "Retinol serum (start 2x weekly)");
        weeklyRoutine.push("Firming mask");
      }
      
      if (detectedIssues.some(issue => issue.includes('sensitivity'))) {
        morningRoutine.splice(2, 0, "Centella asiatica serum");
        eveningRoutine.splice(3, 0, "Barrier repair concentrate");
        weeklyRoutine = weeklyRoutine.filter(item => !item.includes('exfoliation')); // Remove exfoliation
        weeklyRoutine.push("Cica mask");
      }
    }
    
    // Save the personalized routine to the database (in a real app)
    // Here we're just returning it
    
    return {
      morning: morningRoutine,
      evening: eveningRoutine,
      weekly: weeklyRoutine
    };
  } catch (error) {
    console.error('Error generating personalized routines:', error);
    // Return default routines on error
    return {
      morning: ["Gentle cleanser", "Moisturizer", "Sunscreen"],
      evening: ["Cleanser", "Moisturizer"],
      weekly: ["Exfoliation"]
    };
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
  getJournalEntries,
  checkUserPremiumStatus,
  getAIDoctorResponse,
  generatePersonalizedRoutines
};
