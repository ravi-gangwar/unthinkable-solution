import { apiSlice, Recipe, ApiResponse } from './apiSlice'

export const favoritesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query<ApiResponse<Recipe[]>, number>({
      query: (userId) => `/users/${userId}/favorites`,
      providesTags: ['Favorites'],
    }),
    addToFavorites: builder.mutation<ApiResponse<void>, { userId: number; recipeId: number }>({
      query: ({ userId, recipeId }) => ({
        url: `/users/${userId}/favorites/${recipeId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Favorites'],
    }),
    removeFromFavorites: builder.mutation<ApiResponse<void>, { userId: number; recipeId: number }>({
      query: ({ userId, recipeId }) => ({
        url: `/users/${userId}/favorites/${recipeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorites'],
    }),
  }),
})

export const {
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} = favoritesApi
