"use client";

import { useRouter } from "next/navigation";
import BackButton from "@/components/atoms/ui/back-button";
import { Input } from "@/components/atoms/ui/input";
import { Button } from "@/components/atoms/ui/button";
import { useEducation } from "../education-context";
import Image from "next/image";
import { getAuthState } from "@/utils/auth";

export function EditEducationPage() {
  const router = useRouter();
  const { education, updateField } = useEducation();

  const handleFieldChange = (id: number, value: string) => {
    updateField(id, value);
  };

  const handleSave = () => {
    // Persist all fields locally for immediate UI reflection
    const schoolValue = education
      .find((e) => e.field === "School")
      ?.value?.trim();
    const majorValue = education
      .find((e) => e.field === "Major")
      ?.value?.trim();
    const yearValue = education.find((e) => e.field === "Year")?.value?.trim();

    try {
      if (typeof window !== "undefined") {
        const auth = getAuthState();
        const user = (auth.user ? { ...auth.user } : {}) as any;
        if (schoolValue) {
          user.school_name = schoolValue; // primary field used by header/profile
          user.school = schoolValue; // keep fallback aligned
        }
        if (majorValue) {
          user.major = majorValue; // optional: store for future use
        }
        if (yearValue) {
          user.year = yearValue; // optional: store for future use
        }
        localStorage.setItem("user_data", JSON.stringify(user));
      }
    } catch {}

    // TODO: Persist to backend if API available
    console.log("Saving education:", education);

    // Navigate back, and ensure re-render uses latest local values
    router.push("/main-Page/profile/education");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-4">
        <BackButton>
          <Image
            src="/assets/icons/arrow-left.png"
            alt="Back"
            width={16}
            height={16}
            className="ml-1 cursor-pointer hover:bg-gray-100"
          />
        </BackButton>
        <h1 className="text-xl font-bold text-gray-900 ml-3">Edit Education</h1>
      </div>

      {/* Education Input Fields */}
      <div className="p-4 space-y-4">
        {education.map((item) => (
          <div key={item.id} className="space-y-2">
            {/* Label */}
            <label className="text-sm font-medium text-blue-600">
              {item.field}
            </label>

            {/* Input Field */}
            <Input
              type="text"
              value={item.value}
              onChange={(e) => handleFieldChange(item.id, e.target.value)}
              className="w-full border-gray-300 rounded-lg"
              placeholder={`Enter ${item.field.toLowerCase()}`}
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="p-4">
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
