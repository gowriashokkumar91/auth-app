import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage if available (client-side only)
const loadState = () => {
  if (typeof window === "undefined") return { items: [] };
  try {
    const serializedState = localStorage.getItem("recentlyViewed");
    if (serializedState === null) {
      return { items: [] };
    }
    return { items: JSON.parse(serializedState) };
  } catch (err) {
    return { items: [] };
  }
};

const initialState = loadState();

export const recentlyViewedSlice = createSlice({
  name: "recentlyViewed",
  initialState,
  reducers: {
    addViewedProduct: (state, action) => {
      const product = action.payload;

      // Remove product if it already exists to avoid duplicates
      state.items = state.items.filter((item) => item.id !== product.id);

      // Add product to the front of the array
      state.items.unshift(product);

      // Keep only the 10 most recently viewed items
      if (state.items.length > 10) {
        state.items.pop();
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("recentlyViewed", JSON.stringify(state.items));
      }
    },
    clearRecentlyViewed: (state) => {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("recentlyViewed");
      }
    },
  },
});

export const { addViewedProduct, clearRecentlyViewed } =
  recentlyViewedSlice.actions;

export default recentlyViewedSlice.reducer;
