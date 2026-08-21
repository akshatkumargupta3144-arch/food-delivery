import axios from 'axios'

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

export const getAIRecommendations = async (userPreferences) => {
  try {
    const prompt = `Based on the following user preferences: ${JSON.stringify(userPreferences)}, 
    suggest 5 food items they might enjoy. Return as JSON array with name and reason.`

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      }
    )

    const content = response.data.candidates[0].content.parts[0].text
    return JSON.parse(content)
  } catch (error) {
    console.error('Error getting AI recommendations:', error)
    throw error
  }
}

export const getNutritionInsights = async (foodItem) => {
  try {
    const prompt = `Provide nutrition insights for ${foodItem.name}. Include calories, protein, carbs, fats, and health benefits. Return as JSON.`

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      }
    )

    const content = response.data.candidates[0].content.parts[0].text
    return JSON.parse(content)
  } catch (error) {
    console.error('Error getting nutrition insights:', error)
    throw error
  }
}

export const getSmartSuggestions = async (searchQuery) => {
  try {
    const prompt = `Based on the search query "${searchQuery}", suggest 5 food items or restaurants. Return as JSON array.`

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      }
    )

    const content = response.data.candidates[0].content.parts[0].text
    return JSON.parse(content)
  } catch (error) {
    console.error('Error getting smart suggestions:', error)
    throw error
  }
}
