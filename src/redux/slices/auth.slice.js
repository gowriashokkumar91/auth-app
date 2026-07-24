import { createSlice } from "@reduxjs/toolkit";
import { baseApi } from "@/redux/api/baseApi";

const initialState = {
  token: null,
  isAuthenticated: false,
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
    }),
  }),
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { useRegisterMutation, useLoginMutation, useProfileQuery } =
  authService;
export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
