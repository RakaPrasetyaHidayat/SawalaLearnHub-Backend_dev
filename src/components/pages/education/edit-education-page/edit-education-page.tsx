"use client";

import { useRouter } from "next/navigation";
import BackButton from "@/components/atoms/ui/back-button";
import { Input } from "@/components/atoms/ui/input";
import { Button } from "@/components/atoms/ui/button";
import { useEducation } from "../education-context";

export function EditEducationPage() {
  const router = useRouter();
  const { education, updateField } = useEducation();

  const handleFieldChange = (id: number, value: string) => {
    updateField(id, value);
  };

  const handleSave = () => {
    // Here you would typically save to backend/database
    console.log("Saving education:", education);
    // Go back to education page
    router.push("/main-Page/profile/education");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center p-4">
        <BackButton>
          <img src="/assets/icons/arrow-left.png" alt="Back" className="h-4 ml-1 cursor-pointer hover:bg-gray-100" />
        </BackButton>   
        <h1 className="text-xl font-bold text-gray-900 ml-3">
          Edit Education
        </h1>
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
