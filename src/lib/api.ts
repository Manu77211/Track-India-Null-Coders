// Mock API functions for frontend development

export const fetchPredictData = async (sector: string, district: string) => {
  // Mock data
  return {
    trends: [
      { year: 2023, value: 75 },
      { year: 2024, value: 78 },
      { year: 2025, value: 82 },
    ],
    confidence: [70, 85],
  }
}

export const fetchDriversData = async (sector: string) => {
  // Mock data
  return [
    { driver: 'Funding', value: 85 },
    { driver: 'Infrastructure', value: 72 },
    { driver: 'Policy', value: 68 },
  ]
}

export const sendChatMessage = async (message: string) => {
  // Mock response
  return {
    response: `Mock response to: ${message}`,
    chart: null,
    sources: ['data.gov.in'],
  }
}