import { apiSlice, Recipe, IngredientsResponse, ApiResponse } from './apiSlice'

export interface RecipeSearchParams {
  search?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  maxCookingTime?: number
  cuisineType?: string
  dietaryTags?: string
  page?: number
  limit?: number
}

export interface RecipeSuggestionsRequest {
  ingredients: number[]
  dietaryRestrictions?: string[]
  maxCookingTime?: number
  difficulty?: 'easy' | 'medium' | 'hard'
  servingSize?: number
}

export const recipesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query<ApiResponse<Recipe[]>, RecipeSearchParams | void>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams()
        Object.entries(params || {}).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, value.toString())
          }
        })
        return `/recipes?${searchParams.toString()}`
      },
      providesTags: ['Recipe'],
    }),
    getRecipe: builder.query<ApiResponse<Recipe>, number>({
      query: (id) => `/recipes/${id}`,
      providesTags: ['Recipe'],
    }),
    getRecipeSuggestions: builder.mutation<ApiResponse<Recipe[]>, RecipeSuggestionsRequest>({
      query: (body) => ({
        url: '/recipes/suggestions',
        method: 'POST',
        body,
      }),
    }),
    getIngredients: builder.query<ApiResponse<IngredientsResponse>, void>({
      query: () => '/users/ingredients',
      providesTags: ['Ingredients'],
    }),
    getCuisineTypes: builder.query<ApiResponse<string[]>, void>({
      query: () => '/recipes/data/cuisine-types',
    }),
    getDietaryTags: builder.query<ApiResponse<string[]>, void>({
      query: () => '/recipes/data/dietary-tags',
    }),
  }),
})

export const {
  useGetRecipesQuery,
  useGetRecipeQuery,
  useGetRecipeSuggestionsMutation,
  useGetIngredientsQuery,
  useGetCuisineTypesQuery,
  useGetDietaryTagsQuery,
} = recipesApi
