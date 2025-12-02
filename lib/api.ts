// lib/api.ts - UPDATED WITH DOMAIN FIX
import axios from 'axios'

export const API_BASE_URL = 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor - FIX DOMAIN ISSUE
api.interceptors.request.use(
  (config) => {
    // Force withCredentials
    config.withCredentials = true
    
    if (typeof window !== 'undefined') {
      console.log('🔍 === COOKIE DEBUG ===')
      console.log('Window location:', window.location.href)
      console.log('Document cookies:', document.cookie)
      
      // Check for JWT cookie on ANY domain
      const allCookies = document.cookie
      const jwtCookie = allCookies.split('; ').find(c => c.startsWith('jwt='))
      
      if (jwtCookie) {
        const jwtValue = jwtCookie.split('=')[1]
        console.log('✅ JWT cookie found locally:', jwtValue.substring(0, 30) + '...')
        
        // MANUAL FIX: If cookie exists but isn't being sent automatically
        // Add it manually to the request headers
        if (!config.headers['Cookie']) {
          config.headers['Cookie'] = `jwt=${jwtValue}`
          console.log('⚠️ Manually added JWT to Cookie header')
        }
      } else {
        console.warn('❌ No JWT cookie found in document.cookie')
        
        // Check if we're on wrong domain
        const currentHost = window.location.hostname
        console.log(`Current hostname: ${currentHost}`)
        console.log(`Cookie is set for domain: 127.0.0.1`)
        
        if (currentHost === 'localhost') {
          console.warn('⚠️ DOMAIN MISMATCH: Frontend on localhost, cookie for 127.0.0.1')
          console.warn('   Solution: Access via http://127.0.0.1:3000 instead')
        }
      }
      
      console.log('🔍 ====================')
    }
    
    return config
  },
  (error) => Promise.reject(error)
)

export default api