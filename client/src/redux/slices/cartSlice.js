import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [], // [{ product: {...}, quantity }]
    count: 0,
    total: 0,
    drawerOpen: false,
  },
  reducers: {
    syncFromServer(state, action) {
      const cart = action.payload;
      state.items = cart?.items || [];
      state.count = state.items.reduce((n, i) => n + (i.quantity || 0), 0);
      state.total = state.items.reduce(
        (sum, i) => sum + (i.product?.price || 0) * (i.quantity || 0),
        0
      );
    },
    setDrawerOpen(state, action) {
      state.drawerOpen = action.payload;
    },
    clearLocal(state) {
      state.items = [];
      state.count = 0;
      state.total = 0;
    },
  },
});

export const { syncFromServer, setDrawerOpen, clearLocal } = cartSlice.actions;
export default cartSlice.reducer;
