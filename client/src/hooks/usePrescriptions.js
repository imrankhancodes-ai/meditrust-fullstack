import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import prescriptionService from "../services/prescriptionService";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export function useMyPrescriptions(enabled = true) {
  return useQuery({
    queryKey: ["prescriptions"],
    queryFn: prescriptionService.mine,
    enabled,
  });
}

export function usePrescription(pid) {
  return useQuery({
    queryKey: ["prescription", pid],
    queryFn: () => prescriptionService.get(pid),
    enabled: !!pid,
  });
}

export function useFindMedicines(pid, enabled = false) {
  return useQuery({
    queryKey: ["find-medicines", pid],
    queryFn: () => prescriptionService.find(pid),
    enabled: !!pid && enabled,
    retry: 1,
  });
}

export function useUploadPrescription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file) => prescriptionService.upload(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prescriptions"] });
    },
    onError: (err) => toast.error(errMsg(err, "Upload failed")),
  });
}
