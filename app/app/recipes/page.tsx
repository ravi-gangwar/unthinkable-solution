'use client'

import { useState, useMemo } from 'react'
import { useGetRecipesQuery } from '@/lib/api/recipesApi'
import { useGetFavoritesQuery } from '@/lib/api/favoritesApi'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import RecipeGrid from '@/components/recipes/RecipeGrid'
import RecipeFilters, { FilterValues } from '@/components/recipes/RecipeFilters'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Search } from 'lucide-react'
import { useDebounce } from '@/lib/hooks/useDebounce'

export default function RecipesPage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    difficulty: 'all',
    maxCookingTime: 120,
    cuisineType: 'all',
    dietaryTags: 'all',
  })

  const debouncedSearch = useDebounce(filters.search, 300)
  
  const searchParams = useMemo(() => {
    const params: Record<string, string | number> = {}
    if (debouncedSearch) params.search = debouncedSearch
    if (filters.difficulty && filters.difficulty !== 'all') params.difficulty = filters.difficulty
    if (filters.maxCookingTime < 120) params.maxCookingTime = filters.maxCookingTime
    if (filters.cuisineType && filters.cuisineType !== 'all') params.cuisineType = filters.cuisineType
    if (filters.dietaryTags && filters.dietaryTags !== 'all') params.dietaryTags = filters.dietaryTags
    return params
  }, [debouncedSearch, filters])

  const { data: recipesData, isLoading } = useGetRecipesQuery(searchParams)
  const { data: favoritesData } = useGetFavoritesQuery(user?.id || 0, {
    skip: !user
  })

  const handleClearFilters = () => {
    setFilters({
      search: '',
      difficulty: 'all',
      maxCookingTime: 120,
      cuisineType: 'all',
      dietaryTags: 'all',
    })
  }

  const favoriteIds = favoritesData?.data?.map(recipe => recipe.id) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white">All Recipes</h1>
          <p className="text-gray-300">
            Discover and explore our collection of delicious recipes
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <RecipeFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClear={handleClearFilters}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-black/30 backdrop-blur-md border-white/20">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search recipes..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </CardContent>
            </Card>

            <RecipeGrid
              recipes={recipesData?.data || []}
              isLoading={isLoading}
              favoriteRecipeIds={favoriteIds}
              emptyMessage="No recipes match your current filters"
            />

            {recipesData?.pagination && (
              <div className="text-center text-sm text-gray-300">
                Showing {recipesData.data.length} of {recipesData.pagination.total} recipes
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
