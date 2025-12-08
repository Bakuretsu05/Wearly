export interface AnalysisResult {
  success: boolean;
  categories?: string[];
  attributes?: ClothingAttributes;
  region_colors?: RegionColors;
  color_confidence?: ColorConfidence;
  style_evaluation?: StyleEvaluation;
  visualizations?: Visualizations;
  error?: string;
}

export interface ClothingAttributes {
  sleeve_length: string;
  lower_length: string;
  socks: string;
  hat: string;
  glasses: string;
  neckwear: string;
  wristwear: string;
  ring: string;
  waist_accessory: string;
  neckline: string;
  outer_cardigan: string;
  upper_cover_navel: string;
  fabric_0: string;
  fabric_1: string;
  fabric_2: string;
  color_0: string;
  color_1: string;
  color_2: string;
}

export interface RegionColor {
  hex: string | null;
  name: string | null;
  rgb: [number, number, number] | null;
  pattern: string | null;
  classifier_source: string | null;
}

export interface RegionColors {
  shirt?: RegionColor;
  pants?: RegionColor;
  shoes?: RegionColor;
}

export interface ColorConfidence {
  overall: number;
  per_region: {
    shirt?: number;
    pants?: number;
    shoes?: number;
  };
}

export interface SheinLinks {
  top?: string;
  bottom?: string;
  pants?: string;
  shoes?: string;
  accessories?: string;
}

export interface StyleEvaluation {
  rating: 'excellent' | 'good' | 'fair' | 'poor';
  score: number;
  feedback: string;
  suggestions: string[];
  shein_links?: SheinLinks;
  color_confidence?: number;
  color_confidence_note?: string;
}

export interface Visualizations {
  parsed_regions?: string;
  color_extraction?: string;
}

export type LoadingState = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

