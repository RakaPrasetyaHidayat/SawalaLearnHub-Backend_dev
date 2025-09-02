"use client";
import Image from 'next/image'
import BackButton from "@/components/atoms/ui/back-button";
import { ResourcesForm } from "../resource-form";

export function AddResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-4">
        <BackButton>
          <Image src="/assets/icons/arrow-left.png" alt="Back" width={12} height={24} className="h-4 ml-1 cursor-pointer hover:bg-gray-100" />
        </BackButton>   
        <h1 className="text-xl font-bold text-gray-900 ml-3">
          Add new Resources
        </h1>
      </div>

      {/* Resources Form */}
      <div className="px-4">
        <ResourcesForm />
      </div>
    </div>
  );
}
