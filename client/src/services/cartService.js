import api from "./api";

const cartService = {
  get: async () => (await api.get("/cart")).data,
  add: async (productId, quantity = 1) => (await api.post("/cart", { productId, quantity })).data,
  setQty: async (productId, quantity) => (await api.put(`/cart/${productId}`, { quantity })).data,
  remove: async (productId) => (await api.delete(`/cart/${productId}`)).data,
  clear: async () => (await api.delete("/cart")).data,
};

export default cartService;
