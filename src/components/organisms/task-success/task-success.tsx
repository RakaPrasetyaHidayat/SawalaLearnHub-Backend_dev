"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

type TaskSuccessProps = {
  taskTitle?: string;
  onViewSubmission?: () => void;
  onNewSubmission?: () => void;
  onBack?: () => void;
  className?: string;
};

export default function TaskSuccess({
  taskTitle = "Pre Test 1 for All Intern",
  onViewSubmission,
  onNewSubmission,
  onBack,
  className = "",
}: TaskSuccessProps) {
  return (
    <div className={`w-full min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-base font-medium text-gray-900">Detail Task</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-8 flex flex-col items-center text-center">
        {/* Success Illustration */}
        <div className="mb-6">
          <img
            src="https://images.unsplash.com/photo-1567473030492-533b30c5494c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxwZXJzb24lMjBjaGVja2xpc3QlMjBkb2N1bWVudCUyMGNoZWNrbWFyayUyMHN1Y2Nlc3N8ZW58MHwyfHxibHVlfDE3NTgxODA5NzF8MA&ixlib=rb-4.1.0&q=85"
            alt="Professional illustration of a person standing next to a checklist or document with checkmarks, representing task completion and success - erica steeves on Unsplash"
            width={200}
            height={200}
            className="w-48 h-48 object-cover rounded-lg"
          />
        </div>

        {/* Success Message */}
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Tasks Submitted!
        </h2>

        {/* Task Details */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">{taskTitle}</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <Badge
              variant="secondary"
              className="bg-green-100 text-green-700 border-green-200"
            >
              Submitted
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={() => {
              console.log("View Submission button clicked");
              if (onViewSubmission) onViewSubmission();
            }}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View Submission
          </button>

          <button
            onClick={onNewSubmission}
            className="w-full bg-white text-blue-600 py-3 px-4 rounded-lg font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
          >
            New Submission
          </button>
        </div>
      </div>
    </div>
  );
}
