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
  credits: async () => (await api.get("/ai/credits")).data,
  requestCredits: async (requestedCredits, reason) =>
    (await api.post("/ai/credits/request", { requestedCredits, reason })).data,
  myCreditRequests: async () => (await api.get("/ai/credits/requests")).data,
};

export default prescriptionService;
