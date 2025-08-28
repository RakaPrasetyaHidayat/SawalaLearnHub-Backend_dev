"use client";

import BackButton from "@/components/atoms/ui/back-button";
import { EducationList } from "../education-list";
import { FloatingEditButton } from "../floating-edit-button";
import { EducationProvider } from "../education-context";
import Image from 'next/image'

export function EducationPage() {
  return (
    <EducationProvider>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="flex items-center p-4">
          <BackButton>
            <Image src="/assets/icons/arrow-left.png" alt="Back" width={16} height={16} className="h-4 ml-1 cursor-pointer hover:bg-gray-100" />
          </BackButton>   
          <h1 className="text-xl font-bold text-gray-900 ml-3">
            Education
          </h1>
        </div>

        {/* Education List */}
        <div className="p-4">
          <EducationList />
        </div>

        {/* Floating Edit Button */}
        <FloatingEditButton />
      </div>
    </EducationProvider>
  );
}
