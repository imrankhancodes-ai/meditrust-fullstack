import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import cartService from "../services/cartService";
import { syncFromServer, setDrawerOpen } from "../redux/slices/cartSlice";
import { useEffect } from "react";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export function useCartQuery() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);
  const q = useQuery({
    queryKey: ["cart"],
    queryFn: cartService.get,
    enabled: !!token,
  });
  useEffect(() => {
    if (q.data) dispatch(syncFromServer(q.data));
  }, [q.data, dispatch]);
  return q;
}

export function useAddToCart() {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ productId, quantity }) => cartService.add(productId, quantity),
    onSuccess: (cart) => {
      dispatch(syncFromServer(cart));
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart");
    },
    onError: (err) => toast.error(errMsg(err, "Could not add to cart")),
  });
}

export function useSetCartQty() {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: ({ productId, quantity }) => cartService.setQty(productId, quantity),
    onSuccess: (cart) => {
      dispatch(syncFromServer(cart));
      qc.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (err) => toast.error(errMsg(err, "Could not update quantity")),
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (productId) => cartService.remove(productId),
    onSuccess: (cart) => {
      dispatch(syncFromServer(cart));
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Removed from cart");
    },
    onError: (err) => toast.error(errMsg(err, "Could not remove item")),
  });
}

export function useCartDrawer() {
  const dispatch = useDispatch();
  const open = useSelector((s) => s.cart.drawerOpen);
  return {
    open,
    setOpen: (v) => dispatch(setDrawerOpen(v)),
  };
}
