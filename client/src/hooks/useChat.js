import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import chatService from "../services/chatService";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export function useChatHistory(enabled = true) {
  return useQuery({
    queryKey: ["chat"],
    queryFn: chatService.history,
    enabled,
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });
}

export function useSendChat() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (message) => chatService.send(message),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["chat"] });
    },
    onError: (err) => toast.error(errMsg(err, "Could not send message")),
  });
}
