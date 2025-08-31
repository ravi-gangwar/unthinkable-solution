'use client'

import { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { Recipe } from '@/lib/api/apiSlice'
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from '@/lib/api/favoritesApi'
import { useAuthAction } from '@/lib/hooks/useAuthAction'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Clock, ChefHat } from 'lucide-react'
import Link from 'next/link'
import AuthModal from '@/components/auth/AuthModal'

interface RecipeCardProps {
  recipe: Recipe
  isFavorite?: boolean
}

export default function RecipeCard({ recipe, isFavorite = false }: RecipeCardProps) {
  const { user } = useSelector((state: RootState) => state.auth)
  const [isCurrentlyFavorite, setIsCurrentlyFavorite] = useState(isFavorite)
  const [addToFavorites] = useAddToFavoritesMutation()
  const [removeFromFavorites] = useRemoveFromFavoritesMutation()
  const { executeWithAuth, showAuthModal, closeAuthModal, handleAuthSuccess } = useAuthAction()

  const toggleFavorite = async () => {
    if (!user) return

    try {
      if (isCurrentlyFavorite) {
        await removeFromFavorites({ userId: user.id, recipeId: recipe.id }).unwrap()
        setIsCurrentlyFavorite(false)
      } else {
        await addToFavorites({ userId: user.id, recipeId: recipe.id }).unwrap()
        setIsCurrentlyFavorite(true)
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    executeWithAuth(toggleFavorite)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500'
      case 'medium': return 'bg-yellow-500'
      case 'hard': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <>
      <Card className="group hover:shadow-xl hover:shadow-indigo-500/20 transition-all bg-black/30 backdrop-blur-md border-white/20 hover:border-indigo-400/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg line-clamp-2 text-white">{recipe.name}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleFavorite}
              className="shrink-0 hover:bg-white/10"
            >
              <Heart 
                className={`h-4 w-4 ${isCurrentlyFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-400'}`} 
              />
            </Button>
          </div>
          <p className="text-sm text-gray-300 line-clamp-2">{recipe.description}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-indigo-400" />
              {recipe.cooking_time}m
            </div>
            <div className="flex items-center gap-1">
              <ChefHat className="h-4 w-4 text-indigo-400" />
              <Badge 
                variant="secondary" 
                className={`text-white ${getDifficultyColor(recipe.difficulty)}`}
              >
                {recipe.difficulty}
              </Badge>
            </div>
            {recipe.match_percentage && (
              <Badge variant="outline" className="border-indigo-400 text-indigo-300">
                {recipe.match_percentage}% match
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{recipe.cuisine_type}</span>
            <Link href={`/recipes/${recipe.id}`}>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white border-none">View Recipe</Button>
            </Link>
          </div>

          {recipe.dietary_tags && (
            <div className="flex flex-wrap gap-1">
              {recipe.dietary_tags.split(',').map((tag) => (
                <Badge key={tag.trim()} variant="outline" className="text-xs border-white/30 text-gray-300">
                  {tag.trim()}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={closeAuthModal}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
}
