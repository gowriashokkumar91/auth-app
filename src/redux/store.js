import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./api/baseApi";
import authReducer from "./slices/auth.slice";
import wishlistReducer from "./slices/wishlist.slice";
import recentlyViewedReducer from "./slices/recentlyViewed.slice";
import cartReducer from "./slices/cart.slice";

import { combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// SSR-safe storage: falls back to noop on server (localStorage doesn't exist there)
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (_key, value) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
});

const storage =
  typeof window !== "undefined"
    ? require("redux-persist/lib/storage").default
    : createNoopStorage();

// Persist config – only persist cart and wishlist
const cartPersistConfig = {
  key: "cart",
  storage,
};

const wishlistPersistConfig = {
  key: "wishlist",
  storage,
};

const appReducer = combineReducers({
  auth: authReducer,
  wishlist: persistReducer(wishlistPersistConfig, wishlistReducer),
  recentlyViewed: recentlyViewedReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  [baseApi.reducerPath]: baseApi.reducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    // Reset all state to prevent data leakage between users
    // Keep persisted keys so redux-persist can clear them properly
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
