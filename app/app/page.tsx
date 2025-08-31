'use client'

import { useState } from 'react'
import { useGetRecipeSuggestionsMutation, useGetRecipesQuery } from '@/lib/api/recipesApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import IngredientSelector from '@/components/ingredients/IngredientSelector'
import PhotoIngredientSearch from '@/components/ingredients/PhotoIngredientSearch'
import RecipeGrid from '@/components/recipes/RecipeGrid'
import { Recipe } from '@/lib/api/apiSlice'
import { ChefHat, Sparkles, Search, Camera, CheckCircle } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'

export default function HomePage() {
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([])
  const [suggestions, setSuggestions] = useState<Recipe[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState('ingredients')
  const [getRecipeSuggestions, { isLoading }] = useGetRecipeSuggestionsMutation()
  
  const debouncedSearch = useDebounce(searchQuery, 300)
  const { data: searchResults, isLoading: isSearchLoading } = useGetRecipesQuery(
    debouncedSearch ? { search: debouncedSearch } : {},
    { skip: !debouncedSearch }
  )

  const handleGetSuggestions = async () => {
    if (selectedIngredients.length === 0) return

    try {
      const result = await getRecipeSuggestions({
        ingredients: selectedIngredients,
      }).unwrap()
      setSuggestions(result.data)
      // Auto-switch to suggestions tab when recipes are found
      if (result.data && result.data.length > 0) {
        setActiveTab('suggestions')
      }
    } catch (error) {
      console.error('Failed to get suggestions:', error)
    }
  }

  const handleIngredientsDetected = (ingredients: string[]) => {
    setDetectedIngredients(ingredients)
    // Auto-switch to suggestions tab when ingredients are detected from photo
    if (ingredients && ingredients.length > 0) {
      setActiveTab('suggestions')
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center justify-center gap-2 text-white">
          <ChefHat className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-indigo-400" />
          Recipe Suggestions
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-2">
          Select your available ingredients, search recipes, or upload a photo to get personalized suggestions instantly
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-black/30 backdrop-blur-md border border-white/20 h-auto p-1">
          <TabsTrigger 
            value="ingredients" 
            className="text-white data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2"
          >
            <span className="hidden sm:inline">Select </span>Ingredients
          </TabsTrigger>
          <TabsTrigger 
            value="search" 
            className="text-white data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2"
          >
            <span className="hidden sm:inline">Search </span>Recipes
          </TabsTrigger>
          <TabsTrigger 
            value="photo" 
            className="text-white data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2"
          >
            <span className="hidden sm:inline">Photo </span>Search
          </TabsTrigger>
          <TabsTrigger 
            value="suggestions" 
            disabled={suggestions.length === 0 && detectedIngredients.length === 0}
            className="text-white data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-xs sm:text-sm py-2 px-2"
          >
            <span className="sm:hidden">📋</span>
            <span className="hidden sm:inline">Suggestions</span>
            <span className="ml-1">({suggestions.length + (detectedIngredients.length > 0 ? detectedIngredients.length : 0)})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <IngredientSelector
                selectedIngredients={selectedIngredients}
                onSelectionChange={setSelectedIngredients}
              />
            </div>
            <div className="space-y-4">
              <Card className="bg-black/30 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    Get Suggestions
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Ready to discover recipes? Click below to get personalized suggestions based on your selected ingredients.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={handleGetSuggestions}
                    disabled={selectedIngredients.length === 0 || isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                    size="lg"
                  >
                    {isLoading ? 'Finding Recipes...' : 'Get Recipe Suggestions'}
                  </Button>
                  {selectedIngredients.length === 0 && (
                    <p className="text-sm text-gray-400 mt-2 text-center">
                      Select some ingredients first
                    </p>
                  )}
                </CardContent>
              </Card>
              
              {selectedIngredients.length > 0 && (
                <Card className="bg-black/30 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Selected Ingredients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300">
                      {selectedIngredients.length} ingredient{selectedIngredients.length !== 1 ? 's' : ''} selected
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <Card className="bg-black/30 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Search className="h-5 w-5 text-indigo-400" />
                Search Recipes
              </CardTitle>
              <CardDescription className="text-gray-300">
                Search through our collection of delicious recipes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for recipes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
            </CardContent>
          </Card>
          
          <RecipeGrid
            recipes={searchResults?.data || []}
            isLoading={isSearchLoading}
            emptyMessage={debouncedSearch ? "No recipes found matching your search" : "Start typing to search for recipes"}
          />
        </TabsContent>

        <TabsContent value="photo" className="space-y-6">
          <PhotoIngredientSearch onIngredientsDetected={handleIngredientsDetected} />
          
          {detectedIngredients.length > 0 && (
            <Card className="bg-black/30 backdrop-blur-md border-white/20">
              <CardContent className="py-6 text-center">
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Ingredients Detected Successfully!</h3>
                    <p className="text-gray-300">
                      We&apos;ve found {detectedIngredients.length} ingredients in your photo. Check the Suggestions tab to see them and find recipes!
                    </p>
                  </div>
                  <Button
                    onClick={() => setActiveTab('suggestions')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    View Suggestions
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-6">
          {/* Recipe Suggestions from Selected Ingredients */}
          {suggestions.length > 0 && (
            <>
              <Card className="bg-black/30 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Your Recipe Suggestions</CardTitle>
                  <CardDescription className="text-gray-300">
                    Based on your selected ingredients, here are the best recipes we found for you
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <RecipeGrid
                recipes={suggestions}
                isLoading={isLoading}
                emptyMessage="No recipe suggestions yet. Go back and select some ingredients!"
              />
            </>
          )}

          {/* Detected Ingredients from Photo */}
          {detectedIngredients.length > 0 && (
            <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 backdrop-blur-md border-indigo-400/30 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-white text-lg">
                  <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Camera className="h-5 w-5 text-indigo-400" />
                  </div>
                  Detected Ingredients from Photo
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-400/30">
                    AI Powered
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-300 text-sm">
                  AI successfully identified these ingredients from your uploaded photo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                    Found Ingredients ({detectedIngredients.length})
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {detectedIngredients.map((ingredient, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-3 py-1.5 text-sm border-indigo-400/50 text-indigo-200 bg-indigo-400/10 hover:bg-indigo-400/20 transition-colors cursor-default"
                      >
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    What would you like to do next?
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={() => {
                        setActiveTab('ingredients')
                      }}
                      variant="outline"
                      className="flex-1 border-emerald-400/50 text-emerald-300 hover:bg-emerald-400/10 hover:border-emerald-400 transition-all"
                    >
                      <span className="mr-2">🔍</span>
                      Match with Database
                    </Button>
                    <Button
                      onClick={() => {
                        setSearchQuery(detectedIngredients.join(' '))
                        setActiveTab('search')
                      }}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg transition-all"
                    >
                      <span className="mr-2">🍳</span>
                      Find Recipes Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty state when no suggestions or detected ingredients */}
          {suggestions.length === 0 && detectedIngredients.length === 0 && (
            <Card className="bg-gradient-to-br from-gray-900/40 to-slate-900/30 backdrop-blur-md border-gray-400/20">
              <CardContent className="py-12 text-center">
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-indigo-500/20 rounded-full">
                      <ChefHat className="h-12 w-12 text-indigo-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">Ready to Find Amazing Recipes?</h3>
                    <p className="text-gray-300 max-w-md mx-auto">
                      Get personalized recipe suggestions by selecting ingredients, searching our database, or using AI to analyze your photos!
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-sm mx-auto">
                    <Button 
                      onClick={() => setActiveTab('ingredients')}
                      variant="outline" 
                      className="flex-1 border-indigo-400/50 text-indigo-300 hover:bg-indigo-400/10 hover:border-indigo-400 transition-all"
                    >
                      <span className="mr-2">🥗</span>
                      Select Ingredients
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('photo')}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg transition-all"
                    >
                      <span className="mr-2">📸</span>
                      Upload Photo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}