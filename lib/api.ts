// lib/api.ts - FIXED VERSION
import axios from 'axios'

export const API_BASE_URL = 'https://medmind-wkpd.onrender.com/api'

// CRITICAL: Create axios instance with explicit config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Set global axios defaults
axios.defaults.withCredentials = true

// Request interceptor - FIXED
api.interceptors.request.use(
  (config) => {
    // CRITICAL: Manually ensure withCredentials is true
    config.withCredentials = true
    
    // DEBUG: Check what we're sending
    if (typeof window !== 'undefined') {
      console.log('🔍 === REQUEST COOKIE DEBUG ===')
      console.log('Request URL:', config.url)
      console.log('withCredentials:', config.withCredentials)
      console.log('Config.withCredentials:', config.withCredentials)
      
      // Check ALL cookies in browser
      const allCookies = document.cookie
      console.log('Browser has cookies:', allCookies ? 'YES' : 'NO')
      
      if (allCookies) {
        // Parse and log each cookie
        const cookies = allCookies.split('; ')
        cookies.forEach(cookie => {
          const [name, ...valueParts] = cookie.split('=')
          const value = valueParts.join('=')
          console.log(`🍪 Cookie "${name}": ${value ? 'PRESENT' : 'EMPTY'}`)
          
          // Check JWT specifically
          if (name === 'jwt') {
            console.log(`   JWT token length: ${value.length}`)
            console.log(`   JWT starts with: ${value.substring(0, 30)}...`)
            
            // CRITICAL FIX: If cookie exists but isn't being sent,
            // manually add it to the request headers
            // This is a workaround for CORS cookie issues
            if (!config.headers['Cookie']) {
              config.headers['Cookie'] = `jwt=${value}`
              console.log('⚠️ MANUALLY added JWT cookie to headers')
            }
          }
        })
      }
      
      console.log('🔍 ============================')
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request setup error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response from:', response.config.url, 'Status:', response.status)
    
    // Check response headers for CORS issues
    const acao = response.headers['access-control-allow-origin']
    const acac = response.headers['access-control-allow-credentials']
    
    if (acao || acac) {
      console.log('🌐 CORS Headers:')
      console.log('   Access-Control-Allow-Origin:', acao)
      console.log('   Access-Control-Allow-Credentials:', acac)
    }
    
    return response
  },
  async (error) => {
    console.error('❌ === API ERROR ===')
    console.error('URL:', error.config?.url)
    console.error('Status:', error.response?.status)
    console.error('Error:', error.response?.data || error.message)
    
    // Check for CORS specific errors
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.error('🌐 NETWORK/CORS ERROR - Check:')
      console.error('1. Django server is running')
      console.error('2. Django CORS_ALLOW_CREDENTIALS = True')
      console.error('3. Django CORS_ALLOWED_ORIGINS includes frontend')
    }
    
    if (error.response?.status === 403) {
      console.error('🔒 403 Forbidden - Cookies not being sent or invalid')
      
      // Try a direct fetch to debug
      if (typeof window !== 'undefined' && error.config?.url) {
        console.log('🔄 Testing with direct fetch...')
        try {
          const testResponse = await fetch(`${API_BASE_URL}${error.config.url}`, {
            method: error.config.method,
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })
          console.log('Fetch test status:', testResponse.status)
          console.log('Fetch test cookies sent:', testResponse.headers.get('set-cookie'))
        } catch (fetchError) {
          console.error('Fetch test failed:', fetchError)
        }
      }
    }
    
    console.error('❌ =================')
    
    return Promise.reject(error)
  }
)

// Export a test function
export const testCookieSending = async () => {
  if (typeof window === 'undefined') return
  
  console.log('🧪 Testing cookie sending...')
  
  // Test 1: Direct fetch
  console.log('Test 1: Using fetch with credentials')
  try {
    const fetchResponse = await fetch(`${API_BASE_URL}/debug/cookies/`, {
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
    const fetchData = await fetchResponse.json()
    console.log('Fetch result:', fetchData)
  } catch (error) {
    console.error('Fetch test error:', error)
  }
  
  // Test 2: Axios
  console.log('Test 2: Using axios')
  try {
    const axiosResponse = await api.get('/debug/cookies/')
    console.log('Axios result:', axiosResponse.data)
  } catch (error) {
    console.error('Axios test error:', error)
  }
}

export default api