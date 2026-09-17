import { useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileImage, TriangleAlert, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/ui";
import GradientMesh from "../ui/GradientMesh";

export function PrescriptionUploader({ onFile, loading }) {
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const pick = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setPreview(URL.createObjectURL(file));
    onFile(file);
  };

  return (
    <motion.div
      whileHover={loading ? {} : { y: -2 }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        pick(e.dataTransfer.files?.[0]);
      }}
      className={`relative overflow-hidden rounded-[2rem] border-2 border-dashed bg-white p-8 text-center transition ${
        dragOver ? "border-teal-600 bg-teal-50/60" : "border-slate-300"
      }`}
    >
      <GradientMesh />
      <div className="relative">
        {preview ? (
          <img src={preview} alt="Prescription preview" className="mx-auto max-h-64 rounded-2xl object-contain shadow-md" />
        ) : (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-[0_6px_20px_rgba(17,94,89,0.4)]">
            <FileImage size={28} strokeWidth={2} />
          </div>
        )}
        <h3 className="font-display mt-4 font-bold text-slate-900">Drop your prescription photo here</h3>
        <p className="mt-1 text-sm text-slate-500">or pick a clear photo of the prescription (printed or handwritten)</p>
        <label className="mt-4 inline-block cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={loading}
            onChange={(e) => pick(e.target.files?.[0])}
          />
          <span className="btn-press inline-flex items-center gap-2 rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(17,94,89,0.4)] hover:bg-teal-800">
            <UploadCloud size={16} strokeWidth={2.2} /> Choose photo
          </span>
        </label>
      </div>
    </motion.div>
  );
}

export function ProcessingSteps({ step }) {
  const steps = ["Reading image…", "Extracting medicines…", "Matching inventory…"];
  return (
    <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-200 border-t-teal-700" />
        <p className="font-semibold text-slate-800">Analyzing your prescription with AI…</p>
      </div>
      <ol className="mt-4 space-y-2">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`flex items-center gap-2 text-sm ${
              i <= step ? "font-semibold text-teal-800" : "text-slate-400"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                i <= step ? "bg-teal-700 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs text-slate-400">This can take several seconds. Please don&apos;t close this page.</p>
    </div>
  );
}

export function ExtractedMedicineTable({ medicines }) {
  if (!medicines || medicines.length === 0) {
    return <p className="text-sm text-slate-500">No medicines were extracted from this prescription.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-sm">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
            <th className="px-4 py-3">Medicine</th>
            <th className="px-4 py-3">Dosage</th>
            <th className="px-4 py-3">Frequency</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">Notes</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((m, i) => (
            <tr key={i} className="border-b border-slate-50 last:border-0">
              <td className="px-4 py-3 font-semibold text-slate-900">{m.name || "—"}</td>
              <td className="px-4 py-3 text-slate-600">{m.dosage || "—"}</td>
              <td className="px-4 py-3 text-slate-600">{m.frequency || "—"}</td>
              <td className="px-4 py-3 text-slate-600">{m.duration || "—"}</td>
              <td className="px-4 py-3 text-slate-600">{m.notes || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MatchResultsPanel({ result, onAddToCart, addingId }) {
  if (!result) return null;
  const confTone = (c) => ({ high: "high", medium: "medium", low: "low", none: "none" }[c] || "default");
  const unclear = (m) =>
    m.match_confidence === "low" ||
    (m.reason || "").toLowerCase().includes("unclear") ||
    (m.reason || "").toLowerCase().includes("crossed");

  return (
    <div className="space-y-3">
      {result.summary && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Prescribed", result.summary.total_medicines_prescribed],
            ["Available", result.summary.medicines_available],
            ["Unavailable", result.summary.medicines_unavailable],
            ["Tests found", result.summary.tests_with_available_labs],
          ].map(([k, v]) => (
            <div key={k} className="rounded-3xl border border-slate-100 bg-white p-4 text-center shadow-sm">
              <div className="font-display text-2xl font-bold text-teal-800">{v ?? 0}</div>
              <div className="text-xs font-medium text-slate-500">{k}</div>
            </div>
          ))}
        </div>
      )}

      {(result.medicines || []).map((m, i) => (
        <div key={i} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-900">{m.prescribed_name}</span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                { high: "bg-emerald-100 text-emerald-800", medium: "bg-amber-100 text-amber-800", low: "bg-orange-100 text-orange-800", none: "bg-slate-200 text-slate-700" }[
                  confTone(m.match_confidence)
                ]
              }`}
            >
              {m.match_confidence} confidence
            </span>
            {m.available ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 size={12} strokeWidth={2.6} /> Available
              </span>
            ) : (
              <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-600">Unavailable</span>
            )}
          </div>
          {unclear(m) && (
            <p className="mt-2 flex items-start gap-1.5 rounded-2xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
              <TriangleAlert size={14} strokeWidth={2.4} className="mt-0.5 shrink-0" />
              Unclear — please verify with your doctor or pharmacist before ordering.
            </p>
          )}
          <p className="mt-1 text-sm text-slate-500">
            {m.matched_product_name
              ? `Matched: ${m.matched_product_name}${m.price != null ? ` · ₹${m.price}` : ""} — ${m.reason || ""}`
              : m.reason || "No matching product found"}
          </p>
          {m.available && m.matched_product_name && (
            <Button
              className="mt-2"
              disabled={addingId === m.matched_product_name}
              onClick={() => onAddToCart(m)}
            >
              {addingId === m.matched_product_name ? "Adding…" : "Add to cart"}
            </Button>
          )}
        </div>
      ))}

      {(result.tests || []).length > 0 && (
        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
          <h4 className="font-display font-bold text-slate-900">Suggested lab tests</h4>
          {(result.tests || []).map((t, i) => (
            <div key={i} className="mt-2 border-t border-slate-100 pt-2 text-sm">
              <div className="font-semibold">{t.prescribed_test}</div>
              {(t.available_labs || []).map((lab, j) => (
                <div key={j} className="mt-1 text-slate-600">
                  {lab.laboratoryName} · {lab.laboratoryAddress} · ₹{lab.consultationFee}
                </div>
              ))}
              {(!t.available_labs || t.available_labs.length === 0) && (
                <div className="text-slate-400">No labs found for this test.</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
