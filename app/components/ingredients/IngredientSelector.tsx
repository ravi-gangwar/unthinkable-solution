'use client'

import { useState } from 'react'
import { useGetIngredientsQuery } from '@/lib/api/recipesApi'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'

interface IngredientSelectorProps {
  selectedIngredients: number[]
  onSelectionChange: (ingredients: number[]) => void
}

export default function IngredientSelector({ 
  selectedIngredients, 
  onSelectionChange 
}: IngredientSelectorProps) {
  const { data, isLoading, error } = useGetIngredientsQuery()
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['protein', 'vegetable'])

  if (isLoading) {
    return (
      <Card className="bg-black/30 backdrop-blur-md border-white/20">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
        </CardContent>
      </Card>
    )
  }

  if (error || !data?.success) {
    return (
      <Card className="bg-black/30 backdrop-blur-md border-white/20">
        <CardContent className="py-8 text-center text-gray-300">
          Failed to load ingredients
        </CardContent>
      </Card>
    )
  }

  const ingredients = data.data
  const categories = Object.keys(ingredients)

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleIngredient = (ingredientId: number) => {
    const newSelection = selectedIngredients.includes(ingredientId)
      ? selectedIngredients.filter(id => id !== ingredientId)
      : [...selectedIngredients, ingredientId]
    onSelectionChange(newSelection)
  }

  const clearAll = () => onSelectionChange([])

  return (
    <Card className="bg-black/30 backdrop-blur-md border-white/20">
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-white text-lg sm:text-xl">Select Ingredients</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-indigo-600 text-white text-xs sm:text-sm">{selectedIngredients.length} selected</Badge>
            {selectedIngredients.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAll} 
                className="border-red-400/50 text-red-300 hover:bg-red-400/10 hover:border-red-400 transition-all bg-transparent text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Clear all</span>
                <span className="sm:hidden">Clear</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => (
          <div key={category}>
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto font-medium capitalize text-white hover:text-indigo-300 hover:bg-indigo-400/10 transition-all rounded-lg"
              onClick={() => toggleCategory(category)}
            >
              <span className="flex items-center gap-2">
                <span className={`transform transition-transform ${expandedCategories.includes(category) ? 'rotate-90' : ''}`}>
                  ▶
                </span>
                {category} ({ingredients[category].length})
              </span>
            </Button>
            {expandedCategories.includes(category) && (
              <div className="mt-3 space-y-3 pl-6">
                {ingredients[category].map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <Checkbox
                      id={`ingredient-${ingredient.id}`}
                      checked={selectedIngredients.includes(ingredient.id)}
                      onCheckedChange={() => toggleIngredient(ingredient.id)}
                      className="border-white/30 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 data-[state=checked]:text-white"
                    />
                    <label
                      htmlFor={`ingredient-${ingredient.id}`}
                      className="text-sm font-medium leading-none cursor-pointer text-gray-300 hover:text-white transition-colors flex-1"
                    >
                      {ingredient.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
            {category !== categories[categories.length - 1] && <Separator className="mt-4 bg-white/20" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
