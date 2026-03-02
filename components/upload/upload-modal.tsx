"use client";

import { useMemo, useState } from "react";
import { uploadContract } from "@/lib/constants";
import { parseAndValidate } from "@/lib/validation/parseAndValidate";
import type { UploadFamily, UploadedFile } from "@/lib/types";
import { FileValidationStatus } from "@/components/upload/file-validation-status";
import { IngestProgress } from "@/components/upload/ingest-progress";

export function UploadModal({ onDone }: { onDone: (success: boolean, issues: { family: UploadFamily; message: string }[]) => void }) {
  const [open, setOpen] = useState(true);
  const [files, setFiles] = useState<Partial<Record<UploadFamily, File>>>({});
  const [selectedCount, setSelectedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; issues: { family: UploadFamily; message: string }[]; usedFallback: boolean } | null>(null);

  const mappedCount = useMemo(() => Object.keys(files).length, [files]);
  const ready = useMemo(() => uploadContract.requiredFamilies.every((family) => files[family]), [files]);

  if (!open) return null;

  function isUploadFamily(value: string): value is UploadFamily {
    return uploadContract.requiredFamilies.includes(value as UploadFamily);
  }

  function mapSelectedFiles(fileList: FileList): Partial<Record<UploadFamily, File>> {
    const mapped: Partial<Record<UploadFamily, File>> = {};
    for (const file of Array.from(fileList)) {
      const familyCandidate = file.name.toLowerCase().replace(/\.(csv|json)$/i, "");
      if (!isUploadFamily(familyCandidate) || mapped[familyCandidate]) continue;
      mapped[familyCandidate] = file;
    }
    return mapped;
  }

  async function handleValidate() {
    setLoading(true);
    const uploaded: UploadedFile[] = [];
    for (const family of uploadContract.requiredFamilies) {
      const f = files[family];
      if (!f) continue;
      uploaded.push({ family, fileName: f.name, content: await f.text() });
    }
    const parsed = parseAndValidate(uploaded);
    setResult(parsed);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      onDone(parsed.success, parsed.issues);
    }, 900);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-[var(--shadow-3)]">
        <h2 className="text-lg font-semibold text-[rgb(var(--indigo-dark))]">Upload Source Folder</h2>
        <p className="mb-4 text-sm text-[rgb(var(--text-soft))]">
          Select one folder containing all required files. Files are auto-mapped by filename (for example, <code>ap_aging.csv</code>). On pass,
          deterministic seeded data is mapped. On fail, fallback auto-loads.
        </p>

        <label className="mb-3 block rounded-lg border border-[rgb(var(--border))] p-3 text-sm">
          <span className="mb-1 block font-semibold">Upload Folder</span>
          <input
            type="file"
            accept=".csv,.json"
            multiple
            ref={(input) => {
              if (!input) return;
              input.setAttribute("webkitdirectory", "");
              input.setAttribute("directory", "");
            }}
            onChange={(e) => {
              const selected = e.target.files;
              if (!selected) return;
              setSelectedCount(selected.length);
              setFiles(mapSelectedFiles(selected));
            }}
          />
          <p className="mt-2 text-xs text-[rgb(var(--text-soft))]">
            Detected {mappedCount} of {uploadContract.requiredFamilies.length} required files from {selectedCount} selected item
            {selectedCount === 1 ? "" : "s"}.
          </p>
        </label>

        <div className="grid gap-3 md:grid-cols-2">
          {uploadContract.requiredFamilies.map((family) => (
            <div key={family} className="rounded-lg border border-[rgb(var(--border))] p-2 text-xs">
              <span className="mb-1 block font-semibold">{family}</span>
              <span className={files[family] ? "text-emerald-600" : "text-[rgb(var(--text-soft))]"}>
                {files[family] ? `Found: ${files[family]?.name}` : "Missing"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <IngestProgress active={loading} />
          {result && <FileValidationStatus result={result} />}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => {
              setOpen(false);
              onDone(false, []);
            }}
            className="rounded-lg border border-[rgb(var(--border))] px-3 py-2 text-sm"
          >
            Skip Upload
          </button>
          <button
            disabled={!ready || loading}
            onClick={handleValidate}
            className="rounded-lg bg-[rgb(var(--amber-core))] px-3 py-2 text-sm font-semibold text-[rgb(var(--indigo-dark))] disabled:opacity-50"
          >
            Validate and Continue
          </button>
        </div>
      </div>
    </div>
  );
}
