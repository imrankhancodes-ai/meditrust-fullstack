import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { usePrescription, useFindMedicines } from "../../hooks/usePrescriptions";
import { useAddToCart } from "../../hooks/useCart";
import productService from "../../services/productService";
import {
  ExtractedMedicineTable,
  MatchResultsPanel,
} from "../../components/prescription/PrescriptionUploader";
import { Spinner, ErrorState, Button, Card } from "../../components/ui/ui";

export default function PrescriptionResult() {
  const { pid } = useParams();
  const { data: prescription, isLoading, isError, refetch } = usePrescription(pid);
  const [matchEnabled, setMatchEnabled] = useState(false);
  const {
    data: match,
    isLoading: matchLoading,
    isError: matchError,
    refetch: refetchMatch,
  } = useFindMedicines(pid, matchEnabled);
  const add = useAddToCart();
  const [addingName, setAddingName] = useState(null);

  if (isLoading) return <Spinner />;
  if (isError || !prescription)
    return <ErrorState message="Could not load this prescription." onRetry={() => refetch()} />;

  const handleAddMatched = async (m) => {
    // resolve matched product by name, then add to cart
    setAddingName(m.matched_product_name);
    try {
      const list = await productService.list({ search: m.matched_product_name });
      const hit =
        list.find((p) => p.name === m.matched_product_name) || list[0];
      if (!hit) {
        toast.error("Matched product is not in the catalog");
        return;
      }
      add.mutate({ productId: hit._id, quantity: 1 });
    } catch {
      toast.error("Could not add to cart");
    } finally {
      setAddingName(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/prescriptions" className="text-sm font-semibold text-teal-700">
        ← My prescriptions
      </Link>
      <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Prescription result</h1>

      <Card className="mt-4">
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div><span className="text-slate-500">Patient: </span><span className="font-bold">{prescription.patient_name || "—"}</span></div>
          <div><span className="text-slate-500">Doctor: </span><span className="font-bold">{prescription.doctor_name || "—"}</span></div>
          <div><span className="text-slate-500">Date: </span><span className="font-bold">{prescription.date || "—"}</span></div>
          <div><span className="text-slate-500">Uploaded: </span><span className="font-bold">{new Date(prescription.createdAt).toLocaleString()}</span></div>
        </div>
        {prescription.diagnosis_notes && (
          <p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            <span className="font-bold">Notes: </span>{prescription.diagnosis_notes}
          </p>
        )}
        {prescription.image && (
          <img src={prescription.image} alt="Prescription" className="mt-3 max-h-56 rounded-xl object-contain" />
        )}
      </Card>

      <h2 className="mt-6 font-extrabold text-slate-900">Extracted medicines</h2>
      <div className="mt-2">
        <ExtractedMedicineTable medicines={prescription.medicines} />
      </div>

      <div className="mt-6">
        {!matchEnabled ? (
          <Button onClick={() => setMatchEnabled(true)}>Check availability & alternatives</Button>
        ) : matchLoading ? (
          <Spinner />
        ) : matchError ? (
          <ErrorState message="Matching failed — please try again." onRetry={() => refetchMatch()} />
        ) : (
          <div>
            <h2 className="mb-2 font-extrabold text-slate-900">Availability</h2>
            <MatchResultsPanel result={match} onAddToCart={handleAddMatched} addingId={addingName} />
            {(match?.tests || []).length > 0 && (
              <Link
                to="/labs"
                className="btn-press mt-3 inline-block rounded-xl border border-teal-700 px-4 py-2 text-sm font-bold text-teal-800"
              >
                Browse labs to book these tests →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
