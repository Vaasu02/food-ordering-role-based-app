import { apiSlice } from './apiSlice';

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentMethods: builder.query({
      query: () => '/payments',
      providesTags: ['Payment'],
    }),
    createPaymentMethod: builder.mutation({
      query: (paymentMethod) => ({
        url: '/payments',
        method: 'POST',
        body: paymentMethod,
      }),
      invalidatesTags: ['Payment'],
    }),
  }),
});

export const { useGetPaymentMethodsQuery, useCreatePaymentMethodMutation } = paymentApi;

