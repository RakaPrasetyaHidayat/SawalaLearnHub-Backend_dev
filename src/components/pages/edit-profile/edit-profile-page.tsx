"use client";

import BackButton from "@/components/atoms/ui/back-button";
import { ProfilePictureSection } from "./profile-picture-section";
import { ProfileForm } from "./profile-form";
import Image from 'next/image'

export function EditProfilePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-4">
        <BackButton>
          <Image src="/assets/icons/arrow-left.png" alt="Back" className="h-4 ml-1 cursor-pointer hover:bg-gray-100" width={12} height={24}/>
        </BackButton>   
        <h1 className="text-xl font-bold text-gray-900 ml-3">
          Edit Profile
        </h1>
      </div>

      {/* Profile Picture Section */}
      <div className="flex justify-center py-6">
        <ProfilePictureSection />
      </div>

      {/* Profile Form */}
      <div className="px-4">
        <ProfileForm />
      </div>
    </div>
  );
}

