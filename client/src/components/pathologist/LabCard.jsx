import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge, Modal, Button } from "../ui/ui";
import { useBookTest } from "../../hooks/useDoctors";
import { StaggerGroup, StaggerItem } from "../motion/Stagger";
import { FlaskConical, Wallet, ArrowRight } from "lucide-react";

export function LabCard({ lab }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_2px_16px_rgba(15,118,110,0.08)] hover:shadow-[0_12px_36px_rgba(124,58,237,0.15)]"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 p-3 text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)]">
          <FlaskConical size={24} strokeWidth={2.2} />
        </div>
        <div className="min-w-0">
          <div className="font-display truncate font-bold text-slate-900">{lab.laboratoryName}</div>
          <div className="text-sm text-slate-500">{lab.laboratoryAddress}</div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {(lab.specialization || []).slice(0, 3).map((s) => (
              <Badge key={s} tone="default">{s}</Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
        <Wallet size={14} strokeWidth={2.2} className="text-slate-400" />
        <span className="font-display font-bold text-slate-900">₹{lab.consultationFee}</span> onwards
      </div>
      <Link
        to={`/labs/${lab._id}`}
        className="btn-press mt-4 inline-flex items-center justify-center gap-1 rounded-full bg-violet-600 px-3 py-2.5 text-center text-sm font-semibold text-white shadow-[0_4px_14px_rgba(124,58,237,0.35)] hover:bg-violet-700"
      >
        View tests & book <ArrowRight size={14} strokeWidth={2.4} />
      </Link>
    </motion.div>
  );
}

export function LabGrid({ labs }) {
  return (
    <StaggerGroup className="grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3">
      {labs.map((l) => (
        <StaggerItem key={l._id} className="h-full">
          <LabCard lab={l} />
        </StaggerItem>
      ))}
    </StaggerGroup>
  );
}

export function TestCard({ test, onBook }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
      <div>
        <div className="font-display font-bold text-slate-900">{test.title}</div>
        <div className="text-sm text-slate-500">{test.description}</div>
        <div className="font-display mt-1 text-sm font-bold text-violet-700">₹{test.price}</div>
      </div>
      <Button onClick={() => onBook(test)} className="!bg-violet-600 hover:!bg-violet-700">Book</Button>
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
        {test?.description} — <span className="font-display font-bold">₹{test?.price}</span>
      </p>
      <div className="mt-4 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onClose}>
          Cancel
        </Button>
        <Button className="flex-1 !bg-violet-600 hover:!bg-violet-700" onClick={handleBook} disabled={confirming || book.isPending}>
          {confirming || book.isPending ? "Booking…" : "Confirm booking"}
        </Button>
      </div>
    </Modal>
  );
}
