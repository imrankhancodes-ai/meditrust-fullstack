import api from "./api";

const orderService = {
  place: async (payload) => (await api.post("/orders", payload)).data,
  mine: async () => (await api.get("/orders")).data,
  get: async (oid) => (await api.get(`/orders/${oid}`)).data,
  cancel: async (oid) => (await api.put(`/orders/${oid}/cancel`)).data,
};

export default orderService;
