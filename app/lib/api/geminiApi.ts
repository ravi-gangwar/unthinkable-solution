import { GoogleGenerativeAI } from '@google/generative-ai'

// Validate API key
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY

if (!apiKey) {
  console.error('⚠️ GEMINI API KEY MISSING: Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file')
  console.log('🔍 Current env vars:', Object.keys(process.env).filter(key => key.includes('GEMINI')))
} else {
  console.log('✅ Gemini API key loaded successfully:', apiKey.substring(0, 10) + '...')
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

// Debug function to check API key status
export function debugApiKey() {
  const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  console.log('🔍 Debug - API Key status:')
  console.log('  - Key exists:', !!key)
  console.log('  - Key length:', key?.length || 0)
  console.log('  - Key preview:', key ? key.substring(0, 15) + '...' : 'undefined')
  console.log('  - All GEMINI env vars:', Object.keys(process.env).filter(k => k.includes('GEMINI')))
  return !!key
}

export interface IngredientRecognitionResult {
  ingredients: string[]
  confidence: number
  description: string
}

export async function analyzeImage(imageFile: File): Promise<IngredientRecognitionResult> {
  // Check if API key is available
  if (!genAI) {
    throw new Error('Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your .env.local file.')
  }

  try {
    console.log('🔍 Starting image analysis with Gemini API...')
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      },
    })

    // Convert file to base64
    const base64Data = await fileToBase64(imageFile)
    
    const prompt = `Analyze this image and identify all the vegetables, fruits, herbs, spices, and cooking ingredients you can see.

Return your response as a JSON object with this exact format:
{
  "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
  "confidence": 0.95,
  "description": "Brief description of what you see"
}

Guidelines:
- Only identify actual food ingredients
- Be specific (e.g., "red onion", "yellow bell pepper")
- List ingredients in order of prominence in the image
- Include confidence score between 0 and 1
- Focus on fresh ingredients used in cooking`

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: imageFile.type
      }
    }

    console.log('📤 Sending request to Gemini API...')
    const result = await model.generateContent([
      prompt,
      imagePart
    ])
    
    console.log('📥 Received response from Gemini API')
    const response = await result.response
    const text = response.text()
    console.log('📝 Raw Gemini response:', text)

    // Parse the JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          ingredients: parsed.ingredients || [],
          confidence: parsed.confidence || 0,
          description: parsed.description || 'No description available'
        }
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError)
    }

    // Fallback parsing if JSON parsing fails
    const ingredientLines = text.split('\n').filter(line => 
      line.toLowerCase().includes('ingredient') || 
      line.includes('-') || 
      line.includes('•')
    )

    const extractedIngredients = ingredientLines
      .map(line => line.replace(/[-•*]/g, '').trim())
      .filter(line => line.length > 2)
      .slice(0, 10) // Limit to 10 ingredients

    return {
      ingredients: extractedIngredients,
      confidence: 0.7,
      description: 'Ingredients identified from image analysis'
    }

  } catch (error) {
    console.error('Error analyzing image with Gemini:', error)
    throw new Error('Failed to analyze image. Please try again.')
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1]
      resolve(base64Data)
    }
    reader.onerror = error => reject(error)
  })
}
