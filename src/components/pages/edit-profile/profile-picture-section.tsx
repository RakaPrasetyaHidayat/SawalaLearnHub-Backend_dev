"use client";

import { Pencil } from "lucide-react";
import Image from 'next/image'

export function ProfilePictureSection() {
  const handleEditPicture = () => {
    // Here you would typically open file picker or camera
    console.log("Edit profile picture clicked");
  };

  return (
    <div className="relative">
      {/* Profile Picture */}
      <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-200">
        <Image
          src="/assets/images/profile-placeholder.jpg"
          alt="Profile"
          className="w-full h-full object-cover"
          width={100}
          height={100}
          unoptimized
          onError={(e) => {
            // Fallback jika gambar tidak ada
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
          }}
        />
      </div>
      
      {/* Edit Picture Button */}
      <button
        onClick={handleEditPicture}
        className="absolute bottom-0 right-0 w-8 h-8 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-lg transition-colors"
      >
        <Pencil className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}
