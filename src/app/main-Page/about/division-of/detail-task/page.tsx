"use client";

import Image from "next/image";
import TaskDetail from "@/components/organisms/task-detail/task-detail";
import TaskSuccess from "@/components/organisms/task-success/task-success";
import SubmissionList from "@/components/organisms/submission-list/submission-list";
import SubmissionDetail from "@/components/organisms/submission-detail/submission-detail";
import BackButton from "@/components/atoms/ui/back-button";
import { useState, useEffect } from "react";

type Submission = {
  id: string;
  fileName: string;
  date: string;
  status: "submitted" | "approved" | "pending" | "rejected";
};

export default function DetailTaskPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<{
    files: File[];
    description: string;
  } | null>(null);
  const [viewSubmission, setViewSubmission] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const handleSubmit = (payload: { files: File[]; description: string }) => {
    // Here you can handle the submission, e.g., send to API
    console.log("Submitted:", payload);
    setSubmittedPayload(payload);
    setSubmitted(true);
  };

  const handleShowSuccess = () => {
    // Already shown
  };

  const handleViewSubmission = () => {
    console.log("handleViewSubmission called, current states:", {
      selectedSubmission,
      viewSubmission,
      submittedPayload,
    });
    setSelectedSubmission(null); // Reset selected submission when viewing list
    setViewSubmission(true);
    console.log("After setState:", {
      selectedSubmission: null,
      viewSubmission: true,
    });
  };

  // Ensure proper navigation by resetting states when needed
  useEffect(() => {
    if (viewSubmission && selectedSubmission) {
      setSelectedSubmission(null);
    }
  }, [viewSubmission, selectedSubmission]);

  const handleBackFromSubmission = () => {
    setViewSubmission(false);
  };

  if (selectedSubmission && !viewSubmission && submittedPayload) {
    console.log(
      "Rendering SubmissionDetail, selectedSubmission:",
      selectedSubmission,
      "viewSubmission:",
      viewSubmission
    );
    const file = submittedPayload.files.find(
      (f) => f.name === selectedSubmission.fileName
    );

    return (
      <SubmissionDetail
        date={selectedSubmission.date}
        description={submittedPayload.description}
        fileName={selectedSubmission.fileName}
        fileSize={`${(file?.size || 0) / 1024} KB`}
        status={selectedSubmission.status}
        onBack={() => {
          setSelectedSubmission(null);
          setViewSubmission(true);
        }}
        onFileClick={() => {
          if (file) {
            const url = URL.createObjectURL(file);
            window.open(url);
          }
        }}
        onBackToTasks={() => {
          setSelectedSubmission(null);
          setViewSubmission(false);
        }}
      />
    );
  }

  if (viewSubmission && submittedPayload) {
    console.log(
      "Rendering SubmissionList, viewSubmission:",
      viewSubmission,
      "selectedSubmission:",
      selectedSubmission,
      "submittedPayload:",
      submittedPayload
    );
    return (
      <SubmissionList
        title="Pre Test 1 for All Intern"
        description={submittedPayload.description}
        files={submittedPayload.files}
        onBack={handleBackFromSubmission}
        onSubmissionClick={(submission) => {
          setSelectedSubmission(submission);
          setViewSubmission(false);
        }}
      />
    );
  }

  if (submitted) {
    console.log("Rendering TaskSuccess");
    return (
      <TaskSuccess
        taskTitle="Pre Test 1 for All Intern"
        onViewSubmission={handleViewSubmission}
        onNewSubmission={() => setSubmitted(false)}
        onBack={() => console.log("Back")}
      />
    );
  }

  return (
    <div className="justify-center items-center h-full">
      <div className="justify-center items-center h-full flex relative">
        <div className=" items-center flex h-full relative w-[350px] max-[340px]:w-full pt-4 pb-2">
          <BackButton className="ml-2 p-2 rounded-full">
            <Image
              src="/assets/icons/arrow-left.png"
              alt="Back"
              width={8}
              height={8}
              style={{ width: "auto", height: "auto" }}
            />
          </BackButton>
          <h1 className="font-bold text-xl">Detail Task</h1>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <TaskDetail
          title="Pre Test 1 for All Intern"
          deadline="14 Aug 2024, 18:00"
          description="This pre-test evaluates the foundational knowledge of UI/UX design principles, including user-centered design, wireframing, visual hierarchy, and basic tools. It helps assess the intern's readiness for hands-on design tasks."
          onSubmit={handleSubmit}
          onShowSuccess={handleShowSuccess}
        />
      </div>
    </div>
  );
}
