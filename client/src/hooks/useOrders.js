import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import orderService from "../services/orderService";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export function useMyOrders(enabled = true) {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderService.mine,
    enabled,
  });
}

export function useOrder(oid) {
  return useQuery({
    queryKey: ["order", oid],
    queryFn: () => orderService.get(oid),
    enabled: !!oid,
  });
}

export function usePlaceOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: orderService.place,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => toast.error(errMsg(err, "Could not place order")),
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (oid) => orderService.cancel(oid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order cancelled");
    },
    onError: (err) => toast.error(errMsg(err, "Could not cancel order")),
  });
}
