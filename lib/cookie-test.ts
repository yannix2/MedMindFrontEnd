// lib/cookie-test.ts
export async function testCookieTransmission() {
  console.log('🧪 Testing cookie transmission...')
  
  // Test 1: Check if JWT cookie exists
  const jwtCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('jwt='))
  
  console.log('Test 1 - JWT cookie exists:', jwtCookie ? 'YES' : 'NO')
  if (jwtCookie) {
    console.log('JWT cookie value (first 20 chars):', jwtCookie.substring(0, 50) + '...')
  }
  
  // Test 2: Check cookie attributes
  console.log('Test 2 - All cookies:')
  document.cookie.split('; ').forEach(cookie => {
    console.log(`  ${cookie}`)
  })
  
  // Test 3: Try to make a simple GET request to see if cookies are sent
  try {
    const testUrl = 'http://127.0.0.1:8000/api/accounts/test-cookie/'
    console.log('Test 3 - Making test request to:', testUrl)
    
    const response = await fetch(testUrl, {
      method: 'GET',
      credentials: 'include', // This is the fetch equivalent of withCredentials
      headers: {
        'Accept': 'application/json',
      }
    })
    
    console.log('Test 3 - Response status:', response.status)
    const data = await response.json()
    console.log('Test 3 - Response data:', data)
    
    return {
      jwtExists: !!jwtCookie,
      testStatus: response.status,
      testData: data
    }
  } catch (error) {
    console.error('Test 3 failed:', error)
    return { jwtExists: !!jwtCookie, error: String(error) }
  }
}