import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { BadgeCheck, Check } from "lucide-react";
import adminService from "../../../services/adminService";
import { ErrorState, Button, Badge } from "../../../components/ui/ui";
import { ListSkeletonShaped } from "../../../components/ui/Skeletons";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export default function AdminVerifications() {
  const qc = useQueryClient();
  const [tab, setTab] = useState("doctors");

  const doctorsQ = useQuery({ queryKey: ["admin-doctors"], queryFn: adminService.doctors });
  const pathsQ = useQuery({ queryKey: ["admin-pathologists"], queryFn: adminService.pathologists });

  const verifyDoctor = useMutation({
    mutationFn: ({ id, v }) => adminService.verifyDoctor(id, v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-doctors"] });
      toast.success("Doctor verification updated");
    },
    onError: (err) => toast.error(errMsg(err, "Update failed")),
  });

  const verifyPath = useMutation({
    mutationFn: ({ id, v }) => adminService.verifyPathologist(id, v),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-pathologists"] });
      toast.success("Pathologist verification updated");
    },
    onError: (err) => toast.error(errMsg(err, "Update failed")),
  });

  const pending = (list) => (list || []).filter((x) => !x.isVerified);

  return (
    <div>
      <h1 className="font-display text-xl font-bold">Verifications</h1>
      <div className="mt-3 flex gap-2">
        {(["doctors", "pathologists"]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`btn-press rounded-full px-4 py-2 text-sm font-bold capitalize transition ${tab === t ? "bg-ink-950 text-white shadow" : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "doctors" && (
        <VerifyList
          loading={doctorsQ.isLoading}
          error={doctorsQ.isError}
          retry={() => doctorsQ.refetch()}
          items={doctorsQ.data}
          pendingCount={pending(doctorsQ.data).length}
          kind="doctor"
          onVerify={(id, v) => verifyDoctor.mutate({ id, v })}
          busy={verifyDoctor.isPending}
        />
      )}
      {tab === "pathologists" && (
        <VerifyList
          loading={pathsQ.isLoading}
          error={pathsQ.isError}
          retry={() => pathsQ.refetch()}
          items={pathsQ.data}
          pendingCount={pending(pathsQ.data).length}
          kind="pathologist"
          onVerify={(id, v) => verifyPath.mutate({ id, v })}
          busy={verifyPath.isPending}
        />
      )}
    </div>
  );
}

function VerifyList({ loading, error, retry, items, pendingCount, kind, onVerify, busy }) {
  if (loading) return <div className="mt-4"><ListSkeletonShaped count={4} /></div>;
  if (error) return <div className="mt-4"><ErrorState message="Could not load requests." onRetry={retry} /></div>;

  const sorted = [...(items || [])].sort((a, b) => (a.isVerified ? 1 : 0) - (b.isVerified ? 1 : 0));

  return (
    <div className="mt-4">
      <p className="flex items-center gap-1.5 text-sm text-slate-500">
        <BadgeCheck size={15} strokeWidth={2.2} className="text-teal-700" />
        {pendingCount} pending request(s)
      </p>
      <div className="mt-2 space-y-3">
        {sorted.map((x) => (
          <div key={x._id} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-display font-bold">
                {kind === "doctor" ? x.clinicName : x.laboratoryName}
                <span className="ml-2 text-sm font-normal text-slate-500">
                  {x.user?.name} · {x.registrationNumber}
                </span>
              </div>
              <Badge tone={x.isVerified ? "delivered" : "pending"}>
                {x.isVerified ? "verified" : "pending"}
              </Badge>
            </div>
            <div className="mt-1 text-sm text-slate-500">
              {x.qualification} · {x.experience}y · {(x.specialization || []).join(", ")}
            </div>
            {!x.isVerified && (
              <Button className="mt-2" disabled={busy} onClick={() => onVerify(x._id, true)}>
                <Check size={15} strokeWidth={2.6} /> Approve
              </Button>
            )}
          </div>
        ))}
        {(!items || items.length === 0) && (
          <p className="rounded-3xl border border-slate-100 bg-white p-8 text-center text-sm text-slate-500">No requests.</p>
        )}
      </div>
    </div>
  );
}
