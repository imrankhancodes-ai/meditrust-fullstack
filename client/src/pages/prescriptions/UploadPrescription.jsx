import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Coins, Hourglass, ArrowRight } from "lucide-react";
import { PrescriptionUploader } from "../../components/prescription/PrescriptionUploader";
import RxAnalysisLoader from "../../components/prescription/RxAnalysisLoader";
import {
  useUploadPrescription,
  useCredits,
  useMyCreditRequests,
  useRequestCredits,
} from "../../hooks/usePrescriptions";
import { Badge, Button } from "../../components/ui/ui";
import { OrderRowSkeleton } from "../../components/ui/Skeletons";
import SectionHeading from "../../components/ui/SectionHeading";
import GradientMesh from "../../components/ui/GradientMesh";
import Reveal from "../../components/motion/Reveal";

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export default function UploadPrescription() {
  const [noCredits, setNoCredits] = useState(false);
  const [amount, setAmount] = useState(3);
  const [reason, setReason] = useState("");
  const upload = useUploadPrescription();
  const creditsQ = useCredits();
  const requestsQ = useMyCreditRequests();
  const requestCredits = useRequestCredits();
  const navigate = useNavigate();

  const balance = creditsQ.data?.credits ?? null;
  const outOfCredits = noCredits || balance === 0;
  const pendingRequest = (requestsQ.data || []).find((r) => r.status === "pending");

  const handleFile = (file) => {
    setNoCredits(false);
    upload.mutate(file, {
      onSuccess: (prescription) => {
        toast.success("Prescription analyzed! (1 credit used)");
        creditsQ.refetch();
        navigate(`/prescriptions/${prescription._id}`);
      },
      onError: (err) => {
        if (err?.response?.status === 402) {
          setNoCredits(true);
          toast.error("No credits left — request more below.");
        }
      },
    });
  };

  const submitRequest = (e) => {
    e.preventDefault();
    requestCredits.mutate(
      { requestedCredits: Number(amount), reason },
      {
        onSuccess: () => {
          toast.success("Credit request sent to admin");
          setReason("");
          requestsQ.refetch();
        },
      }
    );
  };

  return (
    <div className="mx-auto max-w-2xl">
      <SectionHeading
        eyebrow="AI Analysis"
        title="Upload prescription"
        sub="Take a clear photo — our AI extracts medicines and checks what's in stock."
      />

      {/* Credits banner */}
      <Reveal className="relative mt-4 overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-4 shadow-sm">
        <GradientMesh />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <Coins size={19} strokeWidth={2.2} />
            </span>
            <div>
              <span className="font-semibold text-slate-700">Parsing credits: </span>
              {creditsQ.isLoading ? (
                <span className="text-slate-400">…</span>
              ) : (
                <span className="font-display text-lg font-bold text-teal-800">{balance ?? "—"}</span>
              )}
              <div className="text-xs text-slate-400">1 credit = 1 prescription parse</div>
            </div>
          </div>
          <Badge tone={balance === 0 ? "cancelled" : "default"}>
            {balance === 0 ? "Out of credits" : `${balance ?? "?"} left`}
          </Badge>
        </div>
      </Reveal>

      {outOfCredits ? (
        <Reveal className="mt-4 rounded-[2rem] border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <h2 className="font-display font-bold text-amber-900">You&apos;re out of credits</h2>
          <p className="mt-1 text-sm text-amber-800">
            Each account gets 3 free prescription parses. Request more and an admin will grant them.
          </p>
          {pendingRequest ? (
            <p className="mt-3 flex items-start gap-2 rounded-2xl bg-white px-3 py-2.5 text-sm font-semibold text-slate-700">
              <Hourglass size={16} strokeWidth={2.2} className="mt-0.5 shrink-0 text-amber-600" />
              Request for {pendingRequest.requestedCredits} credits is pending review
              (sent {new Date(pendingRequest.createdAt).toLocaleString()}).
            </p>
          ) : (
            <form onSubmit={submitRequest} className="mt-3 space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-amber-900">Credits needed</span>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-2xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-amber-900">Reason (optional)</span>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Need to parse family prescriptions"
                  className="w-full rounded-2xl border border-amber-300 bg-white px-3.5 py-2.5 text-sm focus:border-amber-500 focus:outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={requestCredits.isPending}
                className="btn-press w-full rounded-full bg-amber-600 px-4 py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(217,119,6,0.4)] hover:bg-amber-700 disabled:opacity-50"
              >
                {requestCredits.isPending ? "Sending…" : "Request credits from admin"}
              </button>
            </form>
          )}
        </Reveal>
      ) : (
        <div className="mt-5">
          <PrescriptionUploader onFile={handleFile} loading={upload.isPending} />
        </div>
      )}

      {upload.isPending && (
        <div className="mt-4">
          <RxAnalysisLoader />
        </div>
      )}

      {/* Request history */}
      <div className="mt-6">
        <h2 className="font-display text-sm font-bold text-slate-900">My credit requests</h2>
        {requestsQ.isLoading ? (
          <div className="mt-2"><OrderRowSkeleton /></div>
        ) : !requestsQ.data || requestsQ.data.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">No requests yet.</p>
        ) : (
          <div className="mt-2 space-y-2">
            {requestsQ.data.slice(0, 5).map((r) => (
              <div key={r._id} className="flex items-center justify-between gap-2 rounded-2xl border border-slate-100 bg-white px-3.5 py-2.5 text-sm shadow-sm">
                <span>
                  <span className="font-display font-bold">+{r.requestedCredits}</span>
                  <span className="ml-2 text-xs text-slate-400">{new Date(r.createdAt).toLocaleString()}</span>
                  {r.status === "approved" && (
                    <span className="ml-2 text-xs text-slate-500">granted: {r.grantedCredits}</span>
                  )}
                </span>
                <Badge tone={r.status === "approved" ? "delivered" : r.status === "rejected" ? "cancelled" : "processing"}>
                  {r.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
        {requestsQ.isError && (
          <p className="mt-1 text-xs text-slate-400">{errMsg(requestsQ.error, "")}</p>
        )}
        <Button variant="ghost" className="mt-2 !px-2 text-teal-700" onClick={() => navigate("/prescriptions")}>
          View all my prescriptions <ArrowRight size={14} strokeWidth={2.4} />
        </Button>
      </div>
    </div>
  );
}
