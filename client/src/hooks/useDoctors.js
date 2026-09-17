import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import doctorService from "../services/doctorService";
import pathologistService from "../services/pathologistService";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export function useDoctors() {
  return useQuery({ queryKey: ["doctors"], queryFn: doctorService.list });
}

export function useDoctorAppointments(enabled = true) {
  return useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: doctorService.appointments,
    enabled,
  });
}

export function useBookDoctor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (did) => doctorService.book(did),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast.success("Appointment booked");
    },
    onError: (err) => toast.error(errMsg(err, "Booking failed")),
  });
}

export function useUpdateDoctorAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ aid, payload }) => doctorService.updateAppointment(aid, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["doctor-appointments"] });
      toast.success("Appointment updated");
    },
    onError: (err) => toast.error(errMsg(err, "Update failed")),
  });
}

export function usePathologists() {
  return useQuery({ queryKey: ["pathologists"], queryFn: pathologistService.list });
}

export function usePathologyTests(pathologistId) {
  return useQuery({
    queryKey: ["pathology-tests", pathologistId || "all"],
    queryFn: pathologistService.tests,
    select: (tests) =>
      pathologistId ? tests.filter((t) => (t.pathologist?._id || t.pathologist) === pathologistId) : tests,
  });
}

export function usePathologistAppointments(enabled = true) {
  return useQuery({
    queryKey: ["pathologist-appointments"],
    queryFn: pathologistService.appointments,
    enabled,
  });
}

export function useBookTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ pid, pathologyTest }) => pathologistService.book(pid, pathologyTest),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pathologist-appointments"] });
      toast.success("Test booked");
    },
    onError: (err) => toast.error(errMsg(err, "Booking failed")),
  });
}

export function useUpdatePathologistAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ aid, payload }) => pathologistService.updateAppointment(aid, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pathologist-appointments"] });
      toast.success("Appointment updated");
    },
    onError: (err) => toast.error(errMsg(err, "Update failed")),
  });
}
