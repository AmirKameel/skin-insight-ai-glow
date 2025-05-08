
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

// Add new interfaces for component props
export interface PageProps {
  language?: 'en' | 'ar';
}

export interface AIDoctorResponse {
  response: string;
  recommendations?: Array<{
    name: string;
    type: string;
  }>;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  mood: string;
  notes?: string;
  sleep_quality?: number;
  stress_level?: number;
  image_url?: string;
  diet_notes?: string;
}

// Define Json type for Supabase data handling
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Define recommendation format to match the database structure
export interface RecommendationsFormat {
  products?: string[];
  routines?: string[];
  tips?: string[];
}

// Define additional page props types for specific pages
export interface NotFoundProps extends PageProps {}
export interface JournalProps extends PageProps {}
export interface RoutinesProps extends PageProps {}
export interface KnowledgeProps extends PageProps {}
export interface UpgradeProps extends PageProps {}
export interface AnalysisDetailProps extends PageProps {}
export interface SkinAnalysisProps extends PageProps {}
export interface IndexProps extends PageProps {}
export interface LandingPageProps extends PageProps {}
