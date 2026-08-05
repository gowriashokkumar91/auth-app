import { baseApi } from "@/redux/api/baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProductsByCategory: builder.query({
      query: (category) => `/products?category=${category}`,
    }),
    getAllProducts: builder.query({
      query: () => "/products",
    }),
    searchProducts: builder.query({
      query: (keyword) => `/products?keyword=${encodeURIComponent(keyword)}`,
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
    }),
  }),
});

export const {
  useGetProductsByCategoryQuery,
  useGetAllProductsQuery,
  useSearchProductsQuery,
  useGetProductByIdQuery,
} = productApi;
