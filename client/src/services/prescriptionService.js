import api from "./api";

const prescriptionService = {
  upload: async (file) => {
    const form = new FormData();
    form.append("prescription", file);
    return (await api.post("/ai/prescription", form)).data;
  },
  mine: async () => (await api.get("/ai/prescriptions")).data,
  get: async (pid) => (await api.get(`/ai/prescriptions/${pid}`)).data,
  find: async (pid) => (await api.get(`/ai/find/${pid}`)).data,
};

export default prescriptionService;
