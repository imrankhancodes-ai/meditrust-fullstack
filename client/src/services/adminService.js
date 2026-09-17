import api from "./api";

const adminService = {
  users: async () => (await api.get("/admin/users")).data,
  products: async () => (await api.get("/admin/products")).data,
  pathologists: async () => (await api.get("/admin/pathologists")).data,
  doctors: async () => (await api.get("/admin/doctors")).data,
  orders: async () => (await api.get("/admin/orders")).data,
  addProduct: async (formData) =>
    (await api.post("/admin/product", formData)).data,
  updateProduct: async (pid, payload) =>
    (await api.put(`/admin/product/${pid}`, payload)).data,
  deleteProduct: async (pid) => (await api.delete(`/admin/product/${pid}`)).data,
  verifyPathologist: async (pid, isVerified) =>
    (await api.put(`/admin/pathologists/${pid}`, { isVerified })).data,
  verifyDoctor: async (did, isVerified) =>
    (await api.put(`/admin/doctor/${did}`, { isVerified })).data,
  updateOrderStatus: async (oid, status) =>
    (await api.put(`/admin/orders/${oid}`, { status })).data,
  creditRequests: async (status) =>
    (await api.get("/admin/credit-requests", { params: status ? { status } : {} })).data,
  reviewCreditRequest: async (rid, payload) =>
    (await api.put(`/admin/credit-requests/${rid}`, payload)).data,
  grantCredits: async (uid, addCredits, adminNote) =>
    (await api.put(`/admin/users/${uid}/credits`, { addCredits, adminNote })).data,
};

export default adminService;
