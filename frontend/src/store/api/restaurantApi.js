import { apiSlice } from './apiSlice';

export const restaurantApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurants: builder.query({
      query: () => '/restaurants',
      providesTags: ['Restaurant'],
    }),
    createRestaurant: builder.mutation({
      query: (restaurant) => ({
        url: '/restaurants',
        method: 'POST',
        body: restaurant,
      }),
      invalidatesTags: ['Restaurant'],
    }),
  }),
});

export const { useGetRestaurantsQuery, useCreateRestaurantMutation } = restaurantApi;

