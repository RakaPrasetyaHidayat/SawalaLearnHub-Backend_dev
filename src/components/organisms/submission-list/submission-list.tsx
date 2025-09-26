"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import SubmissionListItem from "@/components/molecules/submission-list-item/submission-list-item";

type Submission = {
  id: string;
  fileName: string;
  date: string;
  status: "submitted" | "approved" | "pending" | "rejected";
};

type SubmissionListProps = {
  title?: string;
  description?: string;
  files?: File[];
  submissions?: Submission[];
  onBack?: () => void;
  onSubmissionClick?: (submission: Submission) => void;
  className?: string;
};

const defaultSubmissions: Submission[] = [
  {
    id: "1",
    fileName: "Tugas.pdf",
    date: "14 Aug 2024, 14:28",
    status: "submitted",
  },
  {
    id: "2",
    fileName: "Tugas-2.pdf",
    date: "16 Aug 2024, 17:25",
    status: "approved",
  },
];

export default function SubmissionList({
  title,
  description,
  files,
  submissions = defaultSubmissions,
  onBack,
  onSubmissionClick,
  className = "",
}: SubmissionListProps) {
  console.log("SubmissionList rendered with submissions:", submissions);

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
      <div className="p-4 space-y-6">

        {/* Submissions List */}
        <div className="space-y-4">
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <SubmissionListItem
                key={submission.id}
                fileName={submission.fileName}
                date={submission.date}
                status={submission.status}
                onClick={() => onSubmissionClick?.(submission)}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No submissions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}