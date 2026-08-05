import { createSlice } from "@reduxjs/toolkit";
import { baseApi } from "@/redux/api/baseApi";

const initialState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

export const authService = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    profile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),
    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: "/upload/profile-image",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useProfileQuery,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
} = authService;
export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
