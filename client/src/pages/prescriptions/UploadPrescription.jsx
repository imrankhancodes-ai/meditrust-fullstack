import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PrescriptionUploader, ProcessingSteps } from "../../components/prescription/PrescriptionUploader";
import {
  useUploadPrescription,
  useCredits,
  useMyCreditRequests,
  useRequestCredits,
} from "../../hooks/usePrescriptions";
import { Badge, Spinner } from "../../components/ui/ui";

const STEPS = ["Reading image…", "Extracting medicines…", "Matching inventory…"];

function errMsg(err, fallback) {
  return err?.response?.data?.message || err?.response?.data?.error || err?.message || fallback;
}

export default function UploadPrescription() {
  const [step, setStep] = useState(0);
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
    setStep(0);
    const timer = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 2500);
    upload.mutate(file, {
      onSuccess: (prescription) => {
        clearInterval(timer);
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
      onSettled: () => clearInterval(timer),
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
      <h1 className="text-2xl font-extrabold text-slate-900">Upload prescription</h1>
      <p className="mt-1 text-sm text-slate-500">
        Take a clear photo — our AI extracts medicines and checks what&apos;s in stock.
      </p>

      {/* Credits banner */}
      <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <div className="text-sm">
          <span className="font-semibold text-slate-700">Parsing credits: </span>
          {creditsQ.isLoading ? (
            <span className="text-slate-400">…</span>
          ) : (
            <span className="text-lg font-extrabold text-teal-800">{balance ?? "—"}</span>
          )}
          <span className="ml-2 text-xs text-slate-400">1 credit = 1 prescription parse</span>
        </div>
        <Badge tone={balance === 0 ? "cancelled" : "default"}>
          {balance === 0 ? "Out of credits" : `${balance ?? "?"} left`}
        </Badge>
      </div>

      {outOfCredits ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-bold text-amber-900">You&apos;re out of credits</h2>
          <p className="mt-1 text-sm text-amber-800">
            Each account gets 3 free prescription parses. Request more and an admin will grant them.
          </p>
          {pendingRequest ? (
            <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700">
              ⏳ Request for {pendingRequest.requestedCredits} credits is pending review
              (sent {new Date(pendingRequest.createdAt).toLocaleString()}).
            </p>
          ) : (
            <form onSubmit={submitRequest} className="mt-3 space-y-3">
              <div className="flex gap-3">
                <label className="block flex-1">
                  <span className="mb-1 block text-xs font-bold text-amber-900">Credits needed</span>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-amber-900">Reason (optional)</span>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={2}
                  placeholder="e.g. Need to parse family prescriptions"
                  className="w-full rounded-xl border border-amber-300 bg-white px-3 py-2 text-sm"
                />
              </label>
              <button
                type="submit"
                disabled={requestCredits.isPending}
                className="btn-press w-full rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {requestCredits.isPending ? "Sending…" : "Request credits from admin"}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="mt-5">
          <PrescriptionUploader onFile={handleFile} loading={upload.isPending} />
        </div>
      )}

      {upload.isPending && (
        <div className="mt-4">
          <ProcessingSteps step={step} />
        </div>
      )}

      {/* Request history */}
      <div className="mt-6">
        <h2 className="text-sm font-extrabold text-slate-900">My credit requests</h2>
        {requestsQ.isLoading ? (
          <Spinner />
        ) : !requestsQ.data || requestsQ.data.length === 0 ? (
          <p className="mt-2 text-sm text-slate-400">No requests yet.</p>
        ) : (
          <div className="mt-2 space-y-2">
            {requestsQ.data.slice(0, 5).map((r) => (
              <div key={r._id} className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm shadow-sm">
                <span>
                  <span className="font-bold">+{r.requestedCredits}</span>
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
      </div>
    </div>
  );
}
