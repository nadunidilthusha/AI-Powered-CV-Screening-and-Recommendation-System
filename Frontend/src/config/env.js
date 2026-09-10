// Central place to read environment variables (Vite exposes vars prefixed with VITE_)
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  APP_NAME: import.meta.env.VITE_APP_NAME,
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT,
};
