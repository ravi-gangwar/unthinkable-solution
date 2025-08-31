'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Camera, Upload, Loader2, CheckCircle } from 'lucide-react'
import { analyzeImage, IngredientRecognitionResult, debugApiKey } from '@/lib/api/geminiApi'

interface PhotoIngredientSearchProps {
  onIngredientsDetected: (ingredients: string[]) => void
}

export default function PhotoIngredientSearch({ onIngredientsDetected }: PhotoIngredientSearchProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<IngredientRecognitionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Debug API key status
    console.log('🔍 Debugging API key before analysis...')
    debugApiKey()

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    
    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const analysisResult = await analyzeImage(file)
      setResult(analysisResult)
      onIngredientsDetected(analysisResult.ingredients)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze image'
      
      // Show user-friendly message for API key issues
      if (errorMessage.includes('API key') || errorMessage.includes('not configured')) {
        setError('⚠️ Gemini API key not configured. Please check the setup guide!')
      } else if (errorMessage.includes('403') || errorMessage.includes('unregistered callers')) {
        setError('🔑 Invalid API key. Please check your Gemini API key in .env.local file.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const resetAnalysis = () => {
    setResult(null)
    setError(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      {!previewUrl ? (
        <Card className="bg-black/30 backdrop-blur-md border-white/20">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div
              className="border-2 border-dashed border-indigo-400/30 rounded-lg p-4 sm:p-6 lg:p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-400/5 transition-all duration-300"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={openFileDialog}
            >
              <Camera className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-3 sm:mb-4 text-indigo-400" />
              <h3 className="text-base sm:text-lg font-semibold text-white mb-2">Upload Ingredient Photo</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
                <span className="hidden sm:inline">Drag and drop an image here, or </span>Click to browse
              </p>
              <Button 
                variant="outline" 
                className="border-indigo-400/50 text-indigo-300 hover:bg-indigo-400/10 hover:border-indigo-400 transition-all bg-transparent text-sm sm:text-base px-3 sm:px-4 py-2"
              >
                <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Choose Image</span>
                <span className="sm:hidden">Upload</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-black/30 backdrop-blur-md border-white/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Image Analysis</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={resetAnalysis}
                className="border-indigo-400/50 text-indigo-300 hover:bg-indigo-400/10 hover:border-indigo-400 transition-all bg-transparent"
              >
                Try Another
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {previewUrl && (
              <div className="relative">
                <Image
                  src={previewUrl}
                  alt="Uploaded ingredient photo"
                  width={400}
                  height={256}
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Analyzing ingredients...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="bg-red-500/20 border-red-500/30">
                <AlertDescription className="text-red-300">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {result && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-white font-medium">Analysis Complete</span>
                  <Badge variant="secondary" className="bg-indigo-600 text-white">
                    {Math.round(result.confidence * 100)}% confidence
                  </Badge>
                </div>
                
                <div>
                  <h4 className="text-white font-medium mb-2">Detected Ingredients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.ingredients.map((ingredient, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-indigo-400 text-indigo-300"
                      >
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>

                {result.description && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Description:</h4>
                    <p className="text-gray-300 text-sm">{result.description}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
