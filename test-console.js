// test-cookies.js - Run in browser console
async function diagnoseCookieIssue() {
  console.log('🩺 Starting cookie diagnosis...')
  
  // 1. Check what cookies we have
  console.log('1. Current cookies in document.cookie:', document.cookie)
  
  // 2. Check JWT specifically
  const jwtCookie = document.cookie.split('; ').find(c => c.startsWith('jwt='))
  console.log('2. JWT cookie:', jwtCookie ? 'FOUND' : 'NOT FOUND')
  if (jwtCookie) {
    const jwtValue = jwtCookie.split('=')[1]
    console.log('   JWT length:', jwtValue.length)
    console.log('   JWT starts with:', jwtValue.substring(0, 30) + '...')
  }
  
  // 3. Test with fetch
  console.log('3. Testing with fetch...')
  try {
    const fetchResponse = await fetch('http://127.0.0.1:8000/api/accounts/api/debug/cookies/', {
      method: 'GET',
      credentials: 'include', // CRITICAL
      headers: {
        'Accept': 'application/json',
      }
    })
    
    console.log('   Fetch status:', fetchResponse.status)
    const data = await fetchResponse.json()
    console.log('   Fetch response:', data)
  } catch (error) {
    console.error('   Fetch error:', error)
  }
  
  // 4. Test with axios
  console.log('4. Testing with axios...')
  try {
    const axios = await import('https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js')
    
    const axiosResponse = await axios.default.get('http://127.0.0.1:8000/api/debug/cookies/', {
      withCredentials: true
    })
    
    console.log('   Axios status:', axiosResponse.status)
    console.log('   Axios response:', axiosResponse.data)
  } catch (error) {
    console.error('   Axios error:', error.message)
  }
  
  console.log('🩺 Diagnosis complete')
}

// Run it
diagnoseCookieIssue()