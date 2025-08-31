'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { useGetFavoritesQuery } from '@/lib/api/favoritesApi'
import AuthGuard from '@/components/auth/AuthGuard'
import RecipeGrid from '@/components/recipes/RecipeGrid'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const { data, isLoading } = useGetFavoritesQuery(user?.id || 0, {
    skip: !user
  })

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Card className="bg-black/30 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Heart className="h-5 w-5 text-red-500" />
                Your Favorite Recipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Keep track of your favorite recipes and easily access them anytime
              </p>
            </CardContent>
          </Card>

          <RecipeGrid
            recipes={data?.data || []}
            isLoading={isLoading}
            favoriteRecipeIds={data?.data?.map(recipe => recipe.id) || []}
            emptyMessage="You haven't added any favorite recipes yet. Start exploring and save the ones you love!"
          />
        </div>
      </div>
    </AuthGuard>
  )
}
