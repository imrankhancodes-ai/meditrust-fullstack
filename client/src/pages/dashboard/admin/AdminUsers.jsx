import { useQuery } from "@tanstack/react-query";
import adminService from "../../../services/adminService";
import { Spinner, ErrorState, EmptyState, Badge } from "../../../components/ui/ui";

export default function AdminUsers() {
  const { data: users, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-users"],
    queryFn: adminService.users,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorState message="Could not load users." onRetry={() => refetch()} />;
  if (!users || users.length === 0) return <EmptyState icon="👥" title="No users" />;

  return (
    <div>
      <h1 className="text-xl font-extrabold">Users ({users.length})</h1>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-slate-50 last:border-0">
                <td className="px-4 py-3 font-semibold">{u.name}</td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3 text-slate-600">{u.phone}</td>
                <td className="px-4 py-3"><Badge>{u.userType}</Badge></td>
                <td className="px-4 py-3">{u.isActive ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
