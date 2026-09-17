import api from "./api";

const doctorService = {
  list: async () => (await api.get("/doctor")).data,
  myAppointments: async () => (await api.get("/doctor/my")).data,
  appointments: async () => (await api.get("/doctor/appointments")).data,
  getAppointment: async (aid) => (await api.get(`/doctor/appointments/${aid}`)).data,
  request: async (payload) => (await api.post("/doctor/request", payload)).data,
  book: async (did) => (await api.post(`/doctor/${did}`)).data,
  updateAppointment: async (aid, payload) => (await api.put(`/doctor/appointments/${aid}`, payload)).data,
};

export default doctorService;
