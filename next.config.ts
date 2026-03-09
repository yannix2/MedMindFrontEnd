// next.config.js - Production version
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Add these for Vercel
  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "medmind-wkpd.onrender.com"
    }
  ]
},
  // Environment variables for production
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'production',
  },
  
  // Output for Vercel
  output: 'standalone',
    experimental: {
 allowedDevOrigins: ["*"]
  },
}

module.exports = nextConfig