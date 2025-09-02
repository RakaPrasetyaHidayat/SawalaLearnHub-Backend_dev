"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/atoms/ui/input";
import { Button } from "@/components/atoms/ui/button";
import UploadDropzone from '@/components/molecules/upload/upload-dropzone';
import FileItem from "@/components/molecules/upload/file-item";

interface ResourcesData {
  title: string;
  description: string;
  file: File | null;
}

export function ResourcesForm() {
  const [resourcesData, setResourcesData] = useState<ResourcesData>({
    title: "",
    description: "",
    file: null,
  });
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (field: keyof ResourcesData, value: string | File | null) => {
    setResourcesData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!resourcesData.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!resourcesData.description.trim()) {
      setError("Description is required.");
      return;
    }
    if (!resourcesData.file) {
      setError("File is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();
      formData.append("title", resourcesData.title);
      formData.append("description", resourcesData.description);
      if (resourcesData.file) {
        formData.append("file", resourcesData.file);
      }

      const res = await fetch('/api/resources', {
        method: 'POST',
        body: formData,
      });

      const contentType = res.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await res.json().catch(() => null) : null;

      if (!res.ok) {
        const message = (data && (data.message || data.error)) || `Failed to save (status ${res.status})`;
        throw new Error(message);
      }

      // Success: go back to the previous page (resources list)
      router.back();
    } catch (err: unknown) {
      const message = err instanceof Error ? (err.message || 'Failed to save resource') : 'Failed to save resource'
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-red-600 text-sm font-medium mb-2">{error}</div>
      )}
      {/* Title Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900">
          Title
        </label>
        <Input
          type="text"
          value={resourcesData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="Title"
          className="w-full border-gray-300 rounded-lg"
        />
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900">
          Description
        </label>
        <textarea
          value={resourcesData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Description"
          className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* File Upload Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900">
          File
        </label>
        <div className="mt-2">
          <UploadDropzone onFilesAdded={(files) => handleInputChange("file", files[0] ?? null)} />
        </div>
      </div>
      {resourcesData.file && (
        <div className="grid gap-2">
          <FileItem
            name={resourcesData.file.name}
            sizeLabel={`${Math.ceil(resourcesData.file.size / (1024 * 1024))} MB`}
            onRemove={() => handleInputChange("file", null)}
          />
        </div>
      )}

      {/* Save Button */}
      <div className="pt-4 flex justify-center">
        <Button
          onClick={handleSave}
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-8 rounded-lg  w-full"
        >
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
