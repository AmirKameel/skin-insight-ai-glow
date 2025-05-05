
export type SkinType = 'normal' | 'dry' | 'oily' | 'combination' | 'sensitive';

export type SkinConcern = 
  | 'acne' 
  | 'aging' 
  | 'dryness' 
  | 'hyperpigmentation' 
  | 'redness' 
  | 'sensitivity'
  | 'oiliness'
  | 'wrinkles'
  | 'dark-circles'
  | 'large-pores'
  | 'dullness';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt: Date;
  subscriptionTier: 'free' | 'premium' | 'professional';
  subscriptionStatus: 'active' | 'inactive' | 'canceled' | 'trial';
}

export interface SkinProfile {
  id: string;
  userId: string;
  skinType: SkinType;
  skinConcerns: SkinConcern[];
  allergies?: string[];
  environmentFactors: {
    location?: string;
    pollutionLevel?: string;
    climate?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface SkinAnalysis {
  id: string;
  userId: string;
  imageUrl: string;
  aiAnalysisResults: Record<string, any>;
  detectedIssues: string[];
  severityScores: Record<string, number>;
  recommendations: {
    products?: string[];
    routines?: string[];
    tips?: string[];
  };
  createdAt: Date;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<React.SVGAttributes<SVGSVGElement>>;
  current?: boolean;
}
