import { useCallback, useId, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { Shield, Upload } from "lucide-react";

const MAX_BYTES = 10 * 1024 * 1024;
const PDF_TYPE = "application/pdf";
const VALIDATION_ERROR = "Please upload a valid PDF under 10MB";

type StepMotion = Pick<HTMLMotionProps<"div">, "initial" | "animate" | "exit" | "transition">;

export function getOrCreateLeadClientId(): string {
  const key = "ihl-contact-lead-id";
  if (typeof sessionStorage === "undefined") return `anon_${Date.now()}`;
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

type Props = {
  contactStepId: string;
  stepMotion: StepMotion;
  onStepInteraction?: () => void;
  fileKey: string | null;
  onFileKeyChange: (key: string | null) => void;
  isUploading: boolean;
  onUploadingChange: (v: boolean) => void;
};

export function MortgageStatementUpload({
  contactStepId,
  stepMotion,
  onStepInteraction,
  fileKey,
  onFileKeyChange,
  isUploading,
  onUploadingChange,
}: Props) {
  const inputId = useId();
  const [showDropZone, setShowDropZone] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    if (file.type !== PDF_TYPE || !file.name.toLowerCase().endsWith(".pdf")) {
      setError(VALIDATION_ERROR);
      return false;
    }
    if (file.size > MAX_BYTES) {
      setError(VALIDATION_ERROR);
      return false;
    }
    setError(null);
    return true;
  }, []);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!validateFile(file)) return;
      onUploadingChange(true);
      setError(null);
      try {
        getOrCreateLeadClientId();
        const form = new FormData();
        form.append("file", file, file.name);
        const res = await fetch("/api/upload-pdf", {
          method: "POST",
          body: form,
        });
        const data = (await res.json()) as { fileKey?: string; error?: string };
        if (!res.ok || !data.fileKey) {
          setError(data.error ?? "Upload is temporarily unavailable. You can continue without uploading.");
          onUploadingChange(false);
          return;
        }
        onFileKeyChange(data.fileKey);
        onStepInteraction?.();
      } catch {
        setError("Something went wrong. You can try again or continue without uploading.");
      } finally {
        onUploadingChange(false);
      }
    },
    [onFileKeyChange, onStepInteraction, onUploadingChange, validateFile],
  );

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) void uploadFile(f);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void uploadFile(f);
  };

  const success = Boolean(fileKey);

  return (
    <motion.div id={contactStepId} key="mortgage-upload" className="form-step space-y-6" {...stepMotion}>
      <div className="space-y-3 text-center">
        <h2 className="text-balance font-heading text-lg font-semibold text-[#0B2A4A] sm:text-xl">
          Want us to take a closer look for you?
        </h2>
        <p className="mx-auto max-w-[32rem] font-sans text-[14px] leading-relaxed text-slate-600 sm:text-[15px]">
          You can securely upload your most recent mortgage statement — this helps us give you more precise guidance from the start.
        </p>
        <p className="mx-auto flex max-w-[32rem] items-center justify-center gap-1.5 font-sans text-[12px] leading-relaxed text-[#6B7280] sm:text-[13px]">
          <Shield className="h-3.5 w-3.5 shrink-0 text-[#0B2A4A]/70" aria-hidden />
          <span>Encrypted. Reviewed only by our team. Completely optional.</span>
        </p>
      </div>

      {success ? (
        <div
          className="mx-auto max-w-[32rem] rounded-xl border border-emerald-200/90 bg-emerald-50/80 px-4 py-4 text-center"
          role="status"
        >
          <p className="font-sans text-[14px] font-medium leading-relaxed text-emerald-900">
            Your document has been securely received.
          </p>
          <p className="mt-2 font-sans text-[13px] leading-relaxed text-emerald-800/90">
            This will help us better understand your current situation.
          </p>
        </div>
      ) : null}

      {!success && !showDropZone ? (
        <div className="flex flex-col gap-3 sm:mx-auto sm:max-w-[28rem]">
          <button
            type="button"
            onClick={() => {
              setShowDropZone(true);
              setError(null);
              onStepInteraction?.();
            }}
            className="card-option contact-card-transition flex min-h-[52px] items-center justify-center gap-2 py-4 text-center font-sans text-[15px] font-semibold text-[#0B2A4A]"
          >
            <Upload className="h-4 w-4 shrink-0" aria-hidden />
            Upload my statement
          </button>
          <p className="text-center font-sans text-[12px] text-[#6B7280] sm:text-[13px]">
            Or use <span className="font-medium text-slate-600">Continue</span> below to move on — no upload required.
          </p>
        </div>
      ) : null}

      {!success && showDropZone ? (
        <div className="space-y-3">
          <label
            htmlFor={inputId}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition-colors duration-300 ${
              dragOver
                ? "border-[#C6A15B] bg-[#C6A15B]/[0.06]"
                : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50/80"
            }`}
          >
            <Upload className="mb-3 h-8 w-8 text-[#0B2A4A]/50" aria-hidden />
            <span className="font-sans text-[14px] font-medium text-[#0B2A4A]">
              Drag and drop your mortgage statement here
            </span>
            <span className="mt-1 font-sans text-[13px] text-slate-500">or click to upload (PDF only, max 10MB)</span>
            <input
              ref={fileInputRef}
              id={inputId}
              type="file"
              accept={PDF_TYPE}
              className="sr-only"
              onChange={onInputChange}
              disabled={isUploading}
            />
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 font-sans text-[14px] font-semibold text-[#0B2A4A] transition-colors duration-300 hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
          >
            {isUploading ? "Uploading…" : "Choose PDF file"}
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="text-center font-sans text-[13px] text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </motion.div>
  );
}
