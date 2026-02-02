// next.config.js - Production version
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Add these for Vercel
  images: {
    domains: ['medmind-wkpd.onrender.com'],
    unoptimized: true, // For Vercel optimization
  },
  
  // Environment variables for production
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'production',
  },
  
  // Output for Vercel
  output: 'standalone',
    experimental: {
    allowedDevOrigins: [
      "http://192.168.56.1",
      "http://localhost:3000",
      "http://127.0.0.1:3000"
    ]
  },
}

module.exports = nextConfig