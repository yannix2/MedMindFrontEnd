// lib/debug.ts
export function debugCookies() {
  if (typeof document === 'undefined') {
    console.log('🚫 Document not available (server-side)')
    return
  }
  
  console.log('=== COOKIE DEBUG ===')
  console.log('All cookies:', document.cookie)
  
  const cookies = document.cookie.split(';')
  console.log('Total cookies:', cookies.length)
  
  cookies.forEach(cookie => {
    const [name, value] = cookie.trim().split('=')
    console.log(`🍪 ${name}: ${value ? 'Present' : 'Missing'} (length: ${value?.length || 0})`)
    
    if (name === 'jwt') {
      console.log('🔑 JWT cookie found!')
      try {
        // Try to decode JWT to see if it's valid (just for debugging)
        const payload = JSON.parse(atob(value.split('.')[1]))
        console.log('JWT payload:', payload)
        console.log('JWT expires at:', new Date(payload.exp * 1000))
        console.log('Is expired?', new Date() > new Date(payload.exp * 1000))
      } catch (e) {
        console.log('Could not decode JWT:', e)
      }
    }
  })
  console.log('===================')
}

export function debugRequest(method: string, url: string, data?: any) {
  console.log(`📤 ${method.toUpperCase()} ${url}`)
  console.log('Data:', data)
  debugCookies()
}