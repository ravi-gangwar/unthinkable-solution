import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'

export interface User {
  id: number
  name: string
  email: string
  created_at: string
}

export interface Recipe {
  id: number
  name: string
  description: string
  ingredients: string
  instructions: string
  difficulty: 'easy' | 'medium' | 'hard'
  cooking_time: number
  cuisine_type: string
  dietary_tags: string
  image_url?: string
  created_at: string
  match_percentage?: number
  adjusted_serving_size?: number
}

export interface Ingredient {
  id: number
  name: string
}

export interface IngredientsResponse {
  [category: string]: Ingredient[]
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers) => {
      headers.set('content-type', 'application/json')
      return headers
    },
  }),
  tagTypes: ['User', 'Recipe', 'Favorites', 'Ingredients'],
  endpoints: () => ({}),
})
