// src/lib/api.ts
import axios from 'axios';
import type { AnalysisResult } from '../types';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'An unexpected error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export const analyzeDocument = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('document', file);

  const response = await apiClient.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data as AnalysisResult;
};

export const askQuestion = async (question: string): Promise<{ answer: string }> => {
  const response = await apiClient.post<{ answer: string }>('/ask', { question });
  return response.data;
};