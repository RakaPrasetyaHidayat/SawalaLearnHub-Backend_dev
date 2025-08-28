"use client";

import { useEducation } from "../education-context";

export function EducationList() {
  const { education } = useEducation();

  return (
    <div className="space-y-0">
      {education.map((item, index) => (
        <div key={item.id}>
          <div className="flex items-center py-4">
            <span className="text-gray-900 font-medium min-w-[80px]">
              {item.field} :
            </span>
            <span className="text-gray-900 ml-2">
              {item.value}
            </span>
          </div>
          {index < education.length - 1 && (
            <div className="border-b border-gray-200"></div>
          )}
        </div>
      ))}
    </div>
  );
}
