"use client";

import { useState } from "react";
import { Input } from "@/components/atoms/ui/input";
import { Button } from "@/components/atoms/ui/button";
import { FileUploadSection } from "../file-upload-section";

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

  const handleInputChange = (field: keyof ResourcesData, value: string | File | null) => {
    setResourcesData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend/database
    console.log("Saving resources:", resourcesData);
    // For now, just show success message
    alert("Resources added successfully!");
  };

  return (
    <div className="space-y-6">
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
        <FileUploadSection 
          onFileSelect={(file) => handleInputChange("file", file)}
        />
      </div>

      {/* Save Button */}
      <div className="pt-4 flex justify-center">
        <Button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
