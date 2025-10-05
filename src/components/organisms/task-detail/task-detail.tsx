"use client";

import React, { useState, useEffect } from "react";
import UploadDropzone from "@/components/molecules/upload/upload-dropzone";
import FileItem from "@/components/molecules/upload/file-item";
import TextareaWithLabel from "@/components/molecules/inputs/textarea/textarea-with-label";

type TaskDetailProps = {
  title: string;
  deadline: string;
  description: string;
  onOpen?: () => void;
  onSubmit?: (payload: { files: File[]; description: string }) => Promise<any>;
  onShowSuccess?: (submissionData?: any) => void;
  onShowError?: (error: string) => void;
  onShowComments?: () => void;
  className?: string;
};

export default function TaskDetail({
  title,
  deadline,
  description,
  onOpen,
  onSubmit,
  onShowSuccess,
  onShowError,
  className = "",
}: TaskDetailProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [desc, setDesc] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (files.length > 0 || desc.trim()) {
      setError(undefined);
    }
  }, [files, desc]);

  function handleAdd(newFiles: File[]) {
    setFiles((prev) => [...prev, ...newFiles]);
  }
  function handleRemove(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }
  
  async function handleSubmit() {
    if (files.length === 0 && !desc.trim()) {
      setError("Fill in at least one column");
      return;
    }

    if (!onSubmit) return;

    setIsSubmitting(true);
    setError(undefined);

    try {
      const result = await onSubmit({ files, description: desc });
      
      // Jika berhasil, tampilkan hasil submission
      if (onShowSuccess) {
        onShowSuccess(result);
      }
    } catch (error: any) {
      // Tampilkan error yang detail
      let errorMessage = "Submit failed";
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      setError(errorMessage);
      
      if (onShowError) {
        onShowError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className={`w-full space-y-4 ${className}`}>
      <div>
        <h1 className="text-base font-semibold">{title}</h1>
        <p className="text-sm text-gray-600">Deadline: {deadline}</p>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{description}</p>

      <div>
        <h2 className="text-sm font-semibold">
          Submit Assignment (Your Answer)
        </h2>
        <div className="mt-2">
          <UploadDropzone onFilesAdded={handleAdd} />
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid gap-2">
          {files.map((f, idx) => (
            <FileItem
              key={`${f.name}-${idx}`}
              name={f.name}
              sizeLabel={`${Math.ceil(f.size / (1024 * 1024))} MB`}
              onRemove={() => handleRemove(idx)}
            />
          ))}
        </div>
      )}

      <TextareaWithLabel
        placeholder="Description"
        value={desc}
        onChange={setDesc}
        error={error}
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-9 px-4 border rounded-md text-sm"
          onClick={onOpen}
        >
          Open
        </button>
        <button
          type="button"
          className="h-9 px-4 bg-blue-600 text-white rounded-md text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit now"}
        </button>
      </div>
    </section>
  );
}
