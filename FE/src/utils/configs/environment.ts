// Environment configuration
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// Feature flags
export const useSampleData = process.env.NEXT_PUBLIC_USE_SAMPLE_DATA === 'true' || isDevelopment;
export const useMockAPI = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || isDevelopment;

// API URLs
export const apiBaseURL = process.env.NEXT_PUBLIC_API_URL;
export const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

// Analytics
export const gaId = process.env.NEXT_PUBLIC_GA_ID;
export const googleVerification = process.env.GOOGLE_VERIFICATION;

// Logging
export const logLevel = isDevelopment ? 'debug' : 'error';

export const config = {
  isDevelopment,
  isProduction,
  useSampleData,
  useMockAPI,
  apiBaseURL,
  baseURL,
  gaId,
  googleVerification,
  logLevel,
} as const;

export default config;
