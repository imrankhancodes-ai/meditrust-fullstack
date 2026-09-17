import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import adminService from "../../../services/adminService";
import { Spinner, ErrorState, EmptyState, Badge } from "../../../components/ui/ui";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export default function AdminUsers() {
  const qc = useQueryClient();
  const [grantFor, setGrantFor] = useState(null);
  const [grantAmount, setGrantAmount] = useState(3);
  const { data: users, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminService.users,
  });

  const grant = useMutation({
    mutationFn: ({ uid, addCredits }) => adminService.grantCredits(uid, addCredits),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["admin-credit-requests"] });
      toast.success("Credits granted");
      setGrantFor(null);
    },
    onError: (err) => toast.error(errMsg(err, "Grant failed")),
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message="Could not load users." onRetry={() => refetch()} />;
  if (!users || users.length === 0) return <EmptyState icon="👥" title="No users" />;

  return (
    <div>
      <h1 className="text-xl font-extrabold">Users ({users.length})</h1>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Credits</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Grant</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3 font-semibold">{u.name}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3 text-slate-600">{u.phone}</td>
                <td className="px-4 py-3"><Badge>{u.userType}</Badge></td>
                <td className="px-4 py-3 font-extrabold text-teal-800">{u.prescriptionCredits ?? 3}</td>
                <td className="px-4 py-3">{u.isActive ? "✅" : "❌"}</td>
                <td className="px-4 py-3">
                  {grantFor === u._id ? (
                    <span className="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={grantAmount}
                        onChange={(e) => setGrantAmount(e.target.value)}
                        className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                      />
                      <button
                        disabled={grant.isPending}
                        onClick={() => grant.mutate({ uid: u._id, addCredits: Number(grantAmount) })}
                        className="rounded-lg bg-teal-700 px-2 py-1 text-xs font-bold text-white hover:bg-teal-800"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setGrantFor(null)}
                        className="rounded-lg px-2 py-1 text-xs text-slate-400 hover:bg-slate-100"
                      >
                        ✕
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => { setGrantFor(u._id); setGrantAmount(3); }}
                      className="rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-800 hover:bg-teal-100"
                    >
                      + credits
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
