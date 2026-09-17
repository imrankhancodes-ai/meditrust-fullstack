import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PrescriptionUploader, ProcessingSteps } from "../../components/prescription/PrescriptionUploader";
import { useUploadPrescription } from "../../hooks/usePrescriptions";

const STEPS = ["Reading image…", "Extracting medicines…", "Matching inventory…"];

export default function UploadPrescription() {
  const [step, setStep] = useState(0);
  const upload = useUploadPrescription();
  const navigate = useNavigate();

  const handleFile = (file) => {
    setStep(0);
    const timer = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 2500);
    upload.mutate(file, {
      onSuccess: (prescription) => {
        clearInterval(timer);
        toast.success("Prescription analyzed!");
        navigate(`/prescriptions/${prescription._id}`);
      },
      onSettled: () => clearInterval(timer),
    });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold text-slate-900">Upload prescription</h1>
      <p className="mt-1 text-sm text-slate-500">
        Take a clear photo — our AI extracts medicines and checks what&apos;s in stock.
      </p>
      <div className="mt-5">
        <PrescriptionUploader onFile={handleFile} loading={upload.isPending} />
      </div>
      {upload.isPending && (
        <div className="mt-4">
          <ProcessingSteps step={step} />
        </div>
      )}
    </div>
  );
}
