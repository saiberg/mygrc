// Dynamic API base URL based on environment
// In production, uses the Railway public API URL
// In development, use localhost
const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1');

export const API_BASE = isProduction
  ? 'https://api-production-100e.up.railway.app/api'                            // production: Railway public API
  : 'http://localhost:3000/api';                                                // development

// Uncomment one of these for specific environments:
// export const API_BASE = 'http://100.96.122.41:3000/api';                     //test EQUIPO MMORALES
// export const API_BASE = 'http://laptop-lur3k0l3.tailae45b6.ts.net:3000/api'; //test TAILSCALE
