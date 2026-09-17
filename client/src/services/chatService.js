import api from "./api";

const chatService = {
  history: async () => (await api.get("/chat")).data,
  send: async (message) => (await api.post("/chat", { message })).data,
};

export default chatService;
