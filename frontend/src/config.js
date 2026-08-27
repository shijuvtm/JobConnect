// Use Vite environment variable VITE_API_URL when available, otherwise fall back to the production URL.
// To override locally, create a .env.local (or .env.development) with: VITE_API_URL="http://localhost:5000"
export const API_URL = import.meta.env.VITE_API_URL || "https://jobconnect-1ofu.onrender.com";
