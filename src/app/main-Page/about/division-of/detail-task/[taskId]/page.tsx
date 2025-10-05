"use client";

import Image from "next/image";
import TaskDetail from "@/components/organisms/task-detail/task-detail";
import TaskSuccess from "@/components/organisms/task-success/task-success";
import SubmissionList from "@/components/organisms/submission-list/submission-list";
import SubmissionDetail from "@/components/organisms/submission-detail/submission-detail";
import BackButton from "@/components/atoms/ui/back-button";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { TasksService } from "@/services/tasksService";

type Submission = {
  id: string;
  fileName: string;
  date: string;
  status: "submitted" | "approved" | "pending" | "rejected";
};

export default function DetailTaskPage() {
  const params = useParams();
  const taskId = params.taskId as string;

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [submittedPayload, setSubmittedPayload] = useState<{
    files: File[];
    description: string;
  } | null>(null);
  const [viewSubmission, setViewSubmission] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const handleSubmit = async (payload: { files: File[]; description: string }) => {
    try {
      // Call the API to submit the task
      const result = await TasksService.submitTask(taskId, payload);
      console.log("Task submitted successfully:", result);
      
      setSubmittedPayload(payload);
      setSubmitted(true);
      
      return result;
    } catch (error: any) {
      console.error("Failed to submit task:", error);
      throw error; // Re-throw so TaskDetail component can handle the error
    }
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

  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;

      try {
        setLoading(true);
        setError(null);
        const taskData = await TasksService.getTaskById(taskId);
        setTask(taskData);
      } catch (e: any) {
        console.error("Failed to fetch task:", e);
        setError(e?.message || "Failed to load task details");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

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
        title={task.title || "Task"}
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

  if (loading) {
    return (
      <div className="justify-center items-center h-full">
        <div className="justify-center items-center h-full flex relative">
          <div className="items-center flex h-full relative w-[350px] max-[340px]:w-full pt-4 pb-2">
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
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="justify-center items-center h-full">
        <div className="justify-center items-center h-full flex relative">
          <div className="items-center flex h-full relative w-[350px] max-[340px]:w-full pt-4 pb-2">
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
        <div className="flex justify-center items-center p-8">
          <div className="text-red-600 text-center">
            {error || "Task not found"}
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    console.log("Rendering TaskSuccess");
    return (
      <TaskSuccess
        taskTitle={task.title || "Task"}
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
          title={task.title || "Task"}
          deadline={task.deadline ? new Date(task.deadline).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : "No deadline"}
          description={task.description || "No description available"}
          onSubmit={handleSubmit}
          onShowSuccess={handleShowSuccess}
        />
      </div>
    </div>
  );
}
