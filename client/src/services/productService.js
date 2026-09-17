import api from "./api";

const productService = {
  list: async (params = {}) => (await api.get("/products", { params })).data,
  get: async (pid) => (await api.get(`/products/${pid}`)).data,
  alternatives: async (pid) => (await api.get(`/products/${pid}/alternatives`)).data,
};

export default productService;
