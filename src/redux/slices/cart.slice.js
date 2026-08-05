import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const product = action.payload;
      const existingItem = state.items.find(
        (item) =>
          (item._id && product._id && item._id === product._id) ||
          (item.id && product.id && item.id === product.id)
      );

      if (existingItem) {
        existingItem.cartQuantity += product.cartQuantity || 1;
      } else {
        state.items.push({
          ...product,
          cartQuantity: product.cartQuantity || 1,
        });
      }
    },
    updateCartQuantity(state, action) {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find(
        (item) => (item._id && item._id === id) || (item.id && item.id === id)
      );
      if (existingItem) {
        existingItem.cartQuantity = quantity;
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      state.items = state.items.filter(
        (item) => item._id !== id && item.id !== id
      );
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
