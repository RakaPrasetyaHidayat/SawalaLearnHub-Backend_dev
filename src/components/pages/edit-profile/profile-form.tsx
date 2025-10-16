"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/atoms/ui/input";
import { Button } from "@/components/atoms/ui/button";
import { getCurrentUser } from "@/services/authService";
import { getAuthState } from "@/utils/auth";
import { getDisplayDivision } from "@/services/division";

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

  // Prefill form with data shown in Profile Header
  useEffect(() => {
    const loadUser = async () => {
      try {
        const backend = await getCurrentUser();

        // Merge backend with local auth state overrides (same strategy as ProfileHeader)
        let merged: any = backend || {};
        try {
          const local = (getAuthState()?.user as any) || null;
          if (local) merged = { ...(backend || {}), ...local };
        } catch {}

        setProfileData({
          name:
            merged?.name ||
            merged?.username ||
            merged?.full_name ||
            (typeof merged?.email === "string"
              ? merged.email.split("@")[0]
              : "") ||
            "",
          division: getDisplayDivision(merged) || "",
          school:
            merged?.school_name || merged?.school || merged?.institution || "",
        });
      } catch (error) {
        console.error("Failed to load user for edit profile:", error);
      }
    };

    loadUser();
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // TODO: Integrate with backend update endpoint
    console.log("Saving profile:", profileData);
    alert("Profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-900">Name</label>
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
        <label className="text-sm font-medium text-gray-900">Division</label>
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
        <label className="text-sm font-medium text-gray-900">School</label>
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
