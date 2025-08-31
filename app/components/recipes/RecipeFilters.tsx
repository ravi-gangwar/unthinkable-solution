'use client'

import React from 'react'
import { useGetCuisineTypesQuery, useGetDietaryTagsQuery } from '@/lib/api/recipesApi'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { X } from 'lucide-react'

export interface FilterValues {
  search: string
  difficulty: string
  maxCookingTime: number
  cuisineType: string
  dietaryTags: string
}

interface RecipeFiltersProps {
  filters: FilterValues
  onFiltersChange: (filters: FilterValues) => void
  onClear: () => void
}

export default function RecipeFilters({ filters, onFiltersChange, onClear }: RecipeFiltersProps) {
  const { data: cuisineData } = useGetCuisineTypesQuery()
  const { data: dietaryData } = useGetDietaryTagsQuery()

  const updateFilter = (key: keyof FilterValues, value: string | number) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'search') return value !== ''
    if (key === 'maxCookingTime') return value !== 120
    if (key === 'difficulty' || key === 'cuisineType' || key === 'dietaryTags') return value !== 'all'
    return false
  })

  return (
    <Card className="bg-black/30 backdrop-blur-md border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClear} className="border-white/20 text-white hover:bg-white/10">
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-white">Search</Label>
          <Input
            id="search"
            placeholder="Search recipes..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white">Difficulty</Label>
          <Select value={filters.difficulty} onValueChange={(value) => updateFilter('difficulty', value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Any difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/20 backdrop-blur-md">
              <SelectItem value="all" className="text-white hover:bg-white/10">Any difficulty</SelectItem>
              <SelectItem value="easy" className="text-white hover:bg-white/10">Easy</SelectItem>
              <SelectItem value="medium" className="text-white hover:bg-white/10">Medium</SelectItem>
              <SelectItem value="hard" className="text-white hover:bg-white/10">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Max Cooking Time: {filters.maxCookingTime}m</Label>
          <Slider
            value={[filters.maxCookingTime]}
            onValueChange={([value]) => updateFilter('maxCookingTime', value)}
            max={120}
            min={5}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Cuisine Type</Label>
          <Select value={filters.cuisineType} onValueChange={(value) => updateFilter('cuisineType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any cuisine" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/20 backdrop-blur-md">
              <SelectItem value="all" className="text-white hover:bg-white/10">Any cuisine</SelectItem>
              {cuisineData?.data?.map((cuisine) => (
                <SelectItem key={cuisine} value={cuisine} className="text-white hover:bg-white/10">
                  {cuisine}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-white">Dietary Tags</Label>
          <Select value={filters.dietaryTags} onValueChange={(value) => updateFilter('dietaryTags', value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Any dietary preference" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-white/20 backdrop-blur-md">
              <SelectItem value="all" className="text-white hover:bg-white/10">Any dietary preference</SelectItem>
              {dietaryData?.data?.map((tag) => (
                <SelectItem key={tag} value={tag} className="text-white hover:bg-white/10">
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
