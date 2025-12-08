import axios from 'axios';
import { AnalysisResult } from '../types';

// Automatically detect API URL based on current host
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // If running on mobile/network, use the same host as the frontend
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:5000`;
  }
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

export const analyzeImage = async (
  imageFile: File,
  evaluateStyle: boolean = false
): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const params = evaluateStyle ? { style_eval: 'true' } : {};
  
  try {
    const response = await axios.post<AnalysisResult>(
      `${API_BASE_URL}/api/analyze`,
      formData,
      {
        params,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 seconds timeout
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || error.message || 'Failed to analyze image');
    }
    throw error;
  }
};

export const getImageUrl = (path: string): string => {
  if (!path) return '';
  // If it's already a full URL, return it
  if (path.startsWith('http')) return path;
  // Clean up path (remove ../ and normalize slashes)
  const cleanPath = path.replace(/^\.\.\//, '').replace(/\\/g, '/');
  // Construct URL relative to API base
  return `${API_BASE_URL}/${cleanPath}`;
};

