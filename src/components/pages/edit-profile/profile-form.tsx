"use client";

import { useState } from "react";
import { Input } from "@/components/atoms/ui/input";
import { Button } from "@/components/atoms/ui/button";

interface ProfileData {
  name: string;
  division: string;
  school: string;
}

export function ProfileForm() {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "",
    division: "",
    school: "",
  });

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend/database
    console.log("Saving profile:", profileData);
    // For now, just show success message
    alert("Profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900">
          Name
        </label>
        <Input
          type="text"
          value={profileData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Name"
          className="w-full border-gray-300 rounded-lg"
        />
      </div>

      {/* Division Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900">
          Division
        </label>
        <Input
          type="text"
          value={profileData.division}
          onChange={(e) => handleInputChange("division", e.target.value)}
          placeholder="Division"
          className="w-full border-gray-300 rounded-lg"
        />
      </div>

      {/* School Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900">
          School
        </label>
        <Input
          type="text"
          value={profileData.school}
          onChange={(e) => handleInputChange("school", e.target.value)}
          placeholder="School"
          className="w-full border-gray-300 rounded-lg"
        />
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <Button 
          onClick={handleSave}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg"
        >
          Save Change
        </Button>
      </div>
    </div>
  );
}

