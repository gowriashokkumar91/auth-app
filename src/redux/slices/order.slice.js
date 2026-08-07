import { baseApi } from "@/redux/api/baseApi";

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: () => "/orders/myorders",
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    verifyPayment: builder.mutation({
      query: (data) => ({
        url: "/orders/verify-payment",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useGetMyOrdersQuery,
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} = orderApi;
