import api from "./api";

const pathologistService = {
  list: async () => (await api.get("/pathologist")).data,
  tests: async () => (await api.get("/pathologist/tests")).data,
  appointments: async () => (await api.get("/pathologist/appointments")).data,
  getAppointment: async (aid) => (await api.get(`/pathologist/appointments/${aid}`)).data,
  request: async (payload) => (await api.post("/pathologist/request", payload)).data,
  addTest: async (payload) => (await api.post("/pathologist/add", payload)).data,
  updateTest: async (tid, payload) => (await api.put(`/pathologist/test/${tid}`, payload)).data,
  deleteTest: async (tid) => (await api.delete(`/pathologist/test/${tid}`)).data,
  book: async (pid, pathologyTest) =>
    (await api.post(`/pathologist/${pid}`, { pathologyTest })).data,
  updateAppointment: async (aid, payload) =>
    (await api.put(`/pathologist/appointments/${aid}`, payload)).data,
};

export default pathologistService;
