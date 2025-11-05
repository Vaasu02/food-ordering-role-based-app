import { apiSlice } from './apiSlice';

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),
    checkoutOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/checkout`,
        method: 'POST',
      }),
      invalidatesTags: ['Order'],
    }),
    cancelOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useCheckoutOrderMutation,
  useCancelOrderMutation,
} = orderApi;

