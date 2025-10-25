// API functions to connect with Flask backend
const API_BASE_URL = 'http://127.0.0.1:8010'

// Test API connection
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to connect to Flask API:', error)
    return { status: 'error', message: 'Backend not available' }
  }
}

// Fetch prediction/trend data from Flask
export const fetchPredictData = async (sector: string, district: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trends?sector=${encodeURIComponent(sector)}&district=${encodeURIComponent(district)}`)
    const data = await response.json()
    
    if (data.success) {
      // Transform Flask response to match frontend format
      return {
        trends: data.data.map((item: any) => ({
          year: item.year,
          value: item.value,
          confidence_low: item.confidence_low,
          confidence_high: item.confidence_high
        })),
        confidence: data.data.length > 0 
          ? [data.data[0].confidence_low, data.data[data.data.length - 1].confidence_high]
          : [70, 85]
      }
    }
    
    // Fallback to mock data if API fails
    return {
      trends: [
        { year: 2023, value: 75, confidence_low: 70, confidence_high: 80 },
        { year: 2024, value: 78, confidence_low: 73, confidence_high: 83 },
        { year: 2025, value: 82, confidence_low: 77, confidence_high: 87 },
      ],
      confidence: [70, 85],
    }
  } catch (error) {
    console.error('Failed to fetch trend data:', error)
    // Return mock data as fallback
    return {
      trends: [
        { year: 2023, value: 75, confidence_low: 70, confidence_high: 80 },
        { year: 2024, value: 78, confidence_low: 73, confidence_high: 83 },
        { year: 2025, value: 82, confidence_low: 77, confidence_high: 87 },
      ],
      confidence: [70, 85],
    }
  }
}

// Fetch drivers data from Flask
export const fetchDriversData = async (sector: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/drivers?sector=${encodeURIComponent(sector)}`)
    const data = await response.json()
    
    if (data.success) {
      // Transform Flask response to match frontend format
      return data.data.map((item: any) => ({
        driver: item.name,
        value: item.value,
        impact: item.impact,
        trend: item.trend
      }))
    }
    
    // Fallback to mock data
    return [
      { driver: 'Funding', value: 85 },
      { driver: 'Infrastructure', value: 72 },
      { driver: 'Policy', value: 68 },
    ]
  } catch (error) {
    console.error('Failed to fetch drivers data:', error)
    // Return mock data as fallback
    return [
      { driver: 'Funding', value: 85 },
      { driver: 'Infrastructure', value: 72 },
      { driver: 'Policy', value: 68 },
    ]
  }
}

// Send chat message (with mock fallback for now)
export const sendChatMessage = async (message: string) => {
  // TODO: Once backend adds AI chat endpoint, use real API
  // For now, using mock response
  
  return {
    response: `This is a mock response. Backend AI chat endpoint coming soon! You asked: "${message}"`,
    chart: null,
    sources: ['data.gov.in', 'Flask Backend (Coming Soon)'],
  }
}

// Get districts list from Flask
export const fetchDistricts = async (state: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/districts?state=${encodeURIComponent(state)}`)
    const data = await response.json()
    
    if (data.success) {
      return data.districts
    }
    
    return []
  } catch (error) {
    console.error('Failed to fetch districts:', error)
    return []
  }
}
