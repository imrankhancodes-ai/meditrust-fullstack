import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Modal, Button } from "../ui/ui";
import { useBookTest } from "../../hooks/useDoctors";

export function LabCard({ lab }) {
  return (
    <div className="flex flex-col rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(15,118,110,0.08)]">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-xl">🧪</div>
        <div className="min-w-0">
          <div className="truncate font-bold text-slate-900">{lab.laboratoryName}</div>
          <div className="text-sm text-slate-500">{lab.laboratoryAddress}</div>
          <div className="mt-1 flex flex-wrap gap-1">
            {(lab.specialization || []).slice(0, 3).map((s) => (
              <Badge key={s} tone="default">{s}</Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 text-sm text-slate-600">💰 ₹{lab.consultationFee} onwards</div>
      <Link
        to={`/labs/${lab._id}`}
        className="btn-press mt-4 rounded-xl bg-teal-700 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-teal-800"
      >
        View tests & book
      </Link>
    </div>
  );
}

export function TestCard({ test, onBook }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm">
      <div>
        <div className="font-bold text-slate-900">{test.title}</div>
        <div className="text-sm text-slate-500">{test.description}</div>
        <div className="mt-1 text-sm font-extrabold text-teal-800">₹{test.price}</div>
      </div>
      <Button onClick={() => onBook(test)}>Book</Button>
    </div>
  );
}

export function TestBookingModal({ open, onClose, labId, test }) {
  const book = useBookTest();
  const [confirming, setConfirming] = useState(false);

  if (!open) return null;

  const handleBook = () => {
    setConfirming(true);
    book.mutate(
      { pid: labId, pathologyTest: test._id },
      {
        onSuccess: () => {
          setConfirming(false);
          onClose();
        },
        onSettled: () => setConfirming(false),
      }
    );
  };

  return (
    <Modal open={open} onClose={onClose} title={`Book: ${test?.title}`}>
      <p className="text-sm text-slate-600">
        {test?.description} — <span className="font-bold">₹{test?.price}</span>
      </p>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleBook} disabled={confirming || book.isPending}>
          {confirming || book.isPending ? "Booking…" : "Confirm booking"}
        </Button>
      </div>
    </Modal>
  );
}
