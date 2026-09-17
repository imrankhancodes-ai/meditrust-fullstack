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
      qc.invalidateQueries({ queryKey: ["credits"] });
    },
    onError: (err) => {
      qc.invalidateQueries({ queryKey: ["credits"] });
      if (err?.response?.status !== 402) toast.error(errMsg(err, "Upload failed"));
    },
  });
}

export function useCredits(enabled = true) {
  return useQuery({
    queryKey: ["credits"],
    queryFn: prescriptionService.credits,
    enabled,
  });
}

export function useMyCreditRequests(enabled = true) {
  return useQuery({
    queryKey: ["credit-requests-mine"],
    queryFn: prescriptionService.myCreditRequests,
    enabled,
  });
}

export function useRequestCredits() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestedCredits, reason }) =>
      prescriptionService.requestCredits(requestedCredits, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["credit-requests-mine"] });
      qc.invalidateQueries({ queryKey: ["credits"] });
    },
    onError: (err) => toast.error(errMsg(err, "Request failed")),
  });
}
