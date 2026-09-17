import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Coins, Check, X } from "lucide-react";
import adminService from "../../../services/adminService";
import { ErrorState, EmptyState, Badge } from "../../../components/ui/ui";
import { ListSkeletonShaped } from "../../../components/ui/Skeletons";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export default function AdminCredits() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("pending");
  const [grantAmounts, setGrantAmounts] = useState({});
  const [notes, setNotes] = useState({});

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-credit-requests", filter],
    queryFn: () => adminService.creditRequests(filter === "all" ? undefined : filter),
  });

  const review = useMutation({
    mutationFn: ({ rid, payload }) => adminService.reviewCreditRequest(rid, payload),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["admin-credit-requests"] });
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success(res.status === "approved" ? `Approved (+${res.grantedCredits} credits)` : "Request rejected");
    },
    onError: (err) => toast.error(errMsg(err, "Review failed")),
  });

  if (isLoading) return <ListSkeletonShaped count={4} />;
  if (isError) return <ErrorState message="Could not load credit requests." onRetry={() => refetch()} />;

  const toneFor = (s) => (s === "approved" ? "delivered" : s === "rejected" ? "cancelled" : "pending");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-xl font-bold">Prescription credits</h1>
        <div className="flex gap-1.5">
          {["pending", "approved", "rejected", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn-press rounded-full px-3.5 py-1.5 text-xs font-bold capitalize transition ${
                filter === f ? "bg-ink-950 text-white shadow" : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-teal-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-1 text-xs text-slate-400">
        Each user starts with 3 free parses. Approve requests to top up their balance. Full history is stored below.
      </p>

      {!data || data.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={<Coins size={30} strokeWidth={2} />} title={`No ${filter} requests`} />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {data.map((r) => (
            <div key={r._id} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-900">{r.user?.name || "Unknown"}</span>
                  <span className="ml-2 text-xs text-slate-400">{r.user?.email}</span>
                  <span className="ml-2 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-bold text-teal-800">
                    balance: {r.user?.prescriptionCredits ?? "—"}
                  </span>
                </div>
                <Badge tone={toneFor(r.status)}>{r.status}</Badge>
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Requested <span className="font-extrabold">+{r.requestedCredits}</span>
                {r.status === "approved" && (
                  <span> · granted <span className="font-extrabold">+{r.grantedCredits}</span></span>
                )}
                <span className="text-slate-400"> · {new Date(r.createdAt).toLocaleString()}</span>
              </div>
              {r.reason && <p className="mt-1 text-sm italic text-slate-500">“{r.reason}”</p>}
              {r.adminNote && <p className="mt-1 text-xs text-slate-500">Admin note: {r.adminNote}</p>}
              {r.reviewedBy && (
                <p className="mt-1 text-xs text-slate-400">Reviewed by {r.reviewedBy?.name || r.reviewedBy?.email}</p>
              )}

              {r.status === "pending" && (
                <div className="mt-3 flex flex-col gap-2 rounded-2xl bg-slate-50 p-3 sm:flex-row sm:items-end">
                  <label className="block">
                    <span className="mb-1 block text-xs font-bold text-slate-600">Grant amount</span>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={grantAmounts[r._id] ?? r.requestedCredits}
                      onChange={(e) => setGrantAmounts({ ...grantAmounts, [r._id]: e.target.value })}
                      className="w-28 rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block flex-1">
                    <span className="mb-1 block text-xs font-bold text-slate-600">Note (optional)</span>
                    <input
                      type="text"
                      value={notes[r._id] ?? ""}
                      onChange={(e) => setNotes({ ...notes, [r._id]: e.target.value })}
                      placeholder="e.g. Granted for family uploads"
                      className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      disabled={review.isPending}
                      onClick={() =>
                        review.mutate({
                          rid: r._id,
                          payload: {
                            action: "approve",
                            grantedCredits: Number(grantAmounts[r._id] ?? r.requestedCredits),
                            adminNote: notes[r._id] || "",
                          },
                        })
                      }
                      className="btn-press inline-flex items-center gap-1.5 rounded-full bg-teal-700 px-4 py-2 text-sm font-bold text-white shadow-[0_4px_14px_rgba(17,94,89,0.35)] hover:bg-teal-800 disabled:opacity-50"
                    >
                      <Check size={14} strokeWidth={2.6} /> Approve
                    </button>
                    <button
                      disabled={review.isPending}
                      onClick={() =>
                        review.mutate({ rid: r._id, payload: { action: "reject", adminNote: notes[r._id] || "" } })
                      }
                      className="btn-press inline-flex items-center gap-1.5 rounded-full border border-red-300 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <X size={14} strokeWidth={2.6} /> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
