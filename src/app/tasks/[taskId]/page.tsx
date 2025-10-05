"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/services/authService";
import { TasksService } from "@/services/tasksService";

interface TaskDetail {
  id: string;
  title: string;
  description: string;
  deadline?: string;
  division?: string;
  channel_year?: number;
}

export default function TaskSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.taskId as string;

  const [task, setTask] = useState<TaskDetail | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchTaskAndUser = async () => {
      try {
        setLoading(true);

        // Get current user
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // Fetch task details
        const taskData = await TasksService.getTaskById(taskId);
        setTask(taskData);
      } catch (e: any) {
        console.error("Failed to load task:", e);
        setError("Failed to load task details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTaskAndUser();
    }
  }, [taskId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!submissionUrl.trim()) {
      setError("Submission URL is required");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        submission_url: submissionUrl.trim(),
        notes: notes.trim() || undefined,
      };

      const result = await TasksService.submitTask(taskId, payload);
      console.log("Task submitted successfully:", result);

      // Navigate back to tasks list or show success
      router.back();
    } catch (e: any) {
      console.error("Failed to submit task:", e);
      setError("Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-32 bg-gray-200 rounded mb-6"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !task) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <button
              onClick={() => router.back()}
              className="mb-4 text-blue-600 hover:text-blue-800"
            >
              ← Back
            </button>
            <div className="text-red-600 text-center">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-gray-600 text-center">Task not found</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="mr-4 text-blue-600 hover:text-blue-800 text-xl"
            >
              ←
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              {task.deadline && (
                <p className="text-sm text-gray-600 mt-1">
                  Deadline: {new Date(task.deadline).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Task Details */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Task Description</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>
          </div>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div>
              <label htmlFor="submissionUrl" className="block text-sm font-medium text-gray-700 mb-2">
                Submission URL *
              </label>
              <Input
                type="url"
                id="submissionUrl"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                placeholder="https://github.com/username/repo or https://drive.google.com/..."
                required
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Provide a link to your submitted work (GitHub, Google Drive, etc.)
              </p>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes or comments about your submission..."
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}