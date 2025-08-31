'use client'

import { Recipe } from '@/lib/api/apiSlice'
import RecipeCard from './RecipeCard'
import { Loader2 } from 'lucide-react'

interface RecipeGridProps {
  recipes: Recipe[]
  isLoading?: boolean
  favoriteRecipeIds?: number[]
  emptyMessage?: string
}

export default function RecipeGrid({ 
  recipes, 
  isLoading = false, 
  favoriteRecipeIds = [],
  emptyMessage = "No recipes found"
}: RecipeGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-300">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          isFavorite={favoriteRecipeIds.includes(recipe.id)}
        />
      ))}
    </div>
  )
}
