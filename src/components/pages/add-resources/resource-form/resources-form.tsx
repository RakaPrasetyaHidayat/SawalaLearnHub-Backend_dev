"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/atoms/ui/input";
import { Button } from "@/components/atoms/ui/button";
import UploadDropzone from "@/components/molecules/upload/upload-dropzone";
import FileItem from "@/components/molecules/upload/file-item";
import { getAuthToken } from "@/services/fetcher";
import { createResource } from "@/services/resourcesService";
import { logout } from "@/utils/auth";

interface ResourcesData {
  title: string;
  description: string;
  url: string; // public URL to the resource
  type: "ARTICLE" | "VIDEO" | "DOCUMENT" | "LINK" | "";
  file: File | null;
}

export function ResourcesForm() {
  const [resourcesData, setResourcesData] = useState<ResourcesData>({
    title: "",
    description: "",
    url: "",
    type: "",
    file: null,
  });
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleInputChange = (
    field: keyof ResourcesData,
    value: string | File | null
  ) => {
    setResourcesData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
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
    // Backend requires URL; make it mandatory
    if (!resourcesData.url.trim()) {
      setError("URL is required.");
      return;
    }
    if (!isValidUrl(resourcesData.url)) {
      setError("URL must be a valid address.");
      return;
    }
    if (
      !resourcesData.type ||
      !["ARTICLE", "VIDEO", "DOCUMENT", "LINK"].includes(resourcesData.type)
    ) {
      setError("Type must be one of: ARTICLE, VIDEO, DOCUMENT, LINK.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const currentUrl = new URL(window.location.href);
      const divisionId = currentUrl.searchParams.get("division_id") || "";
      const year = currentUrl.searchParams.get("year") || "";

      const token = getAuthToken();

      // File size validation: UI indicates max 25MB
      const MAX_BYTES = 25 * 1024 * 1024;
      if (resourcesData.file && resourcesData.file.size > MAX_BYTES) {
        throw new Error("File too large. Maximum allowed size is 25 MB.");
      }

      // Build payload (FormData when file present)
      let payload: Record<string, any> | FormData = {};
      if (resourcesData.file) {
        const formData = new FormData();
        formData.append("title", resourcesData.title.trim());
        formData.append("description", resourcesData.description.trim());
        formData.append("url", resourcesData.url.trim());
        formData.append("type", resourcesData.type);
        formData.append("file", resourcesData.file);
        if (divisionId) formData.append("division_id", divisionId);
        if (year) {
          const yearNum = Number(year);
          formData.append("year", Number.isFinite(yearNum) ? String(yearNum) : year);
        }
        payload = formData;
      } else {
        const json: Record<string, any> = {
          title: resourcesData.title.trim(),
          description: resourcesData.description.trim(),
          url: resourcesData.url.trim(),
          type: resourcesData.type,
        };
        if (divisionId) json.division_id = divisionId;
        if (year) json.year = Number.isFinite(Number(year)) ? Number(year) : year;
        payload = json;
      }

      // Attempt create with one retry for transient errors
      let lastErr: any = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          await createResource(payload as any);
          // success -> navigate back
          router.back();
          return;
        } catch (err: any) {
          lastErr = err;
          const msg = String(err?.message || "").toLowerCase();
          const isTimeout = msg.includes("timeout") || msg.includes("request timeout");
          const isNetwork = msg.includes("failed to fetch") || msg.includes("network error");
          const isServer5xx = /5\d{2}/.test(String(err?.status || ""));
          // If unauthorized, force logout and redirect to login
          if (err?.status === 401) {
            try {
              logout();
            } catch {}
            router.push("/login");
            throw new Error("Unauthorized. Please login to continue.");
          }
          // retry only on timeout/network/5xx
          if (attempt === 0 && (isTimeout || isNetwork || isServer5xx)) {
            // small backoff
            await new Promise((r) => setTimeout(r, 500));
            continue;
          }
          // otherwise rethrow
          throw err;
        }
      }

      // If we exited loop with lastErr, surface it
      if (lastErr) throw lastErr;

      // Success: go back to the previous page (resources list)
      router.back();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message || "Failed to save resource"
          : "Failed to save resource";
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
        <label className="text-sm font-medium text-gray-900">Title</label>
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
        <label className="text-sm font-medium text-gray-900">Description</label>
        <textarea
          value={resourcesData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Description"
          className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* URL Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900">URL</label>
        <Input
          type="url"
          value={resourcesData.url}
          onChange={(e) => handleInputChange("url", e.target.value)}
          placeholder="https://example.com/resource"
          className="w-full border-gray-300 rounded-lg"
        />
      </div>

      {/* Type Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900">Type</label>
        <select
          value={resourcesData.type}
          onChange={(e) => handleInputChange("type", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 bg-white"
        >
          <option value="">Select type</option>
          <option value="ARTICLE">ARTICLE</option>
          <option value="VIDEO">VIDEO</option>
          <option value="DOCUMENT">DOCUMENT</option>
          <option value="LINK">LINK</option>
        </select>
      </div>

      {/* File Upload Section (optional) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900">
          File (optional)
        </label>
        <div className="mt-2">
          <UploadDropzone
            onFilesAdded={(files) =>
              handleInputChange("file", files[0] ?? null)
            }
          />
        </div>
      </div>
      {resourcesData.file && (
        <div className="grid gap-2">
          <FileItem
            name={resourcesData.file.name}
            sizeLabel={`${Math.ceil(
              resourcesData.file.size / (1024 * 1024)
            )} MB`}
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
          {submitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
