'use client'

import React, { use } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { useGetRecipeQuery } from '@/lib/api/recipesApi'
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation, useGetFavoritesQuery } from '@/lib/api/favoritesApi'
import { useAuthAction } from '@/lib/hooks/useAuthAction'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Heart, Clock, ChefHat, ArrowLeft } from 'lucide-react'
import AuthModal from '@/components/auth/AuthModal'
import { useRouter } from 'next/navigation'

interface RecipePageProps {
  params: Promise<{ id: string }>
}

export default function RecipePage({ params }: RecipePageProps) {
  const router = useRouter()
  const { user } = useSelector((state: RootState) => state.auth)
  const resolvedParams = use(params)
  const { data, isLoading, error } = useGetRecipeQuery(parseInt(resolvedParams.id))
  const { data: favoritesData } = useGetFavoritesQuery(user?.id || 0, { skip: !user })
  const [addToFavorites] = useAddToFavoritesMutation()
  const [removeFromFavorites] = useRemoveFromFavoritesMutation()
  const { executeWithAuth, showAuthModal, closeAuthModal, handleAuthSuccess } = useAuthAction()

  const recipe = data?.data
  const isFavorite = favoritesData?.data?.some(fav => fav.id === recipe?.id) || false

  const toggleFavorite = async () => {
    if (!user || !recipe) return

    try {
      if (isFavorite) {
        await removeFromFavorites({ userId: user.id, recipeId: recipe.id }).unwrap()
      } else {
        await addToFavorites({ userId: user.id, recipeId: recipe.id }).unwrap()
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const handleToggleFavorite = () => {
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Recipe not found</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <Card className="bg-black/30 backdrop-blur-md border-white/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl text-white">{recipe.name}</CardTitle>
                <p className="text-gray-300">{recipe.description}</p>
              </div>
              <Button
                variant="ghost"
                size="lg"
                onClick={handleToggleFavorite}
                className="hover:bg-white/10"
              >
                <Heart 
                  className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300'}`} 
                />
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recipe.instructions.split('.').filter(step => step.trim()).map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm">{step.trim()}.</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {recipe.ingredients.split(',').map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">{ingredient.trim()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recipe Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Cooking Time</span>
                  </div>
                  <span className="font-medium">{recipe.cooking_time} minutes</span>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Difficulty</span>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-white ${getDifficultyColor(recipe.difficulty)}`}
                  >
                    {recipe.difficulty}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm">Cuisine</span>
                  <span className="font-medium">{recipe.cuisine_type}</span>
                </div>

                {recipe.dietary_tags && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Dietary Tags</span>
                      <div className="flex flex-wrap gap-1">
                        {recipe.dietary_tags.split(',').map((tag) => (
                          <Badge key={tag.trim()} variant="outline" className="text-xs">
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={closeAuthModal}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}
