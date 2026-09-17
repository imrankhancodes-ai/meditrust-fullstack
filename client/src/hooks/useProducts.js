import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import productService from "../services/productService";

export function useProducts(params) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productService.list(params),
  });
}

export function useProduct(pid) {
  return useQuery({
    queryKey: ["product", pid],
    queryFn: () => productService.get(pid),
    enabled: !!pid,
  });
}

export function useAlternatives(pid) {
  return useQuery({
    queryKey: ["alternatives", pid],
    queryFn: () => productService.alternatives(pid),
    enabled: !!pid,
  });
}

export function useProductMutations() {
  const qc = useQueryClient();
  return {
    invalidate: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
  };
}

export function useAdminProductsToast() {
  return useMutation({
    mutationFn: async () => null,
    onSuccess: () => toast.success("Done"),
  });
}
