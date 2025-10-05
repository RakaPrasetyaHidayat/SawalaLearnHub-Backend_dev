"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, FileText, Calendar, User } from "lucide-react";
import { TasksService } from "@/services/tasksService";

type SubmissionSuccessProps = {
  submissionData?: any;
  submissionId?: string | number;
  onBack?: () => void;
  onViewSubmissions?: () => void;
  onNewSubmission?: () => void;
  className?: string;
};

export default function SubmissionSuccess({
  submissionData,
  submissionId,
  onBack,
  onViewSubmissions,
  onNewSubmission,
  className = "",
}: SubmissionSuccessProps) {
  const [detailedSubmission, setDetailedSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Jika ada submissionId, fetch detail submission
    if (submissionId && !submissionData) {
      fetchSubmissionDetail();
    } else if (submissionData) {
      setDetailedSubmission(submissionData);
    }
  }, [submissionId, submissionData]);

  const fetchSubmissionDetail = async () => {
    if (!submissionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await TasksService.getTaskSubmissionById(submissionId);
      setDetailedSubmission(data);
    } catch (err: any) {
      console.error("Error fetching submission detail:", err);
      setError("Failed to load submission details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className={`w-full min-h-screen bg-gray-50 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading submission details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full min-h-screen bg-gray-50 ${className}`}>
        <div className="bg-white px-4 py-3 flex items-center gap-3 border-b">
          <button 
            onClick={onBack}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-base font-medium text-gray-900">Submission Result</h1>
        </div>
        
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const submission = detailedSubmission || submissionData;

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
        <h1 className="text-base font-medium text-gray-900">Submission Result</h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <h2 className="text-green-800 font-medium">Submission Successful!</h2>
              <p className="text-green-700 text-sm">Your task has been submitted successfully.</p>
            </div>
          </div>
        </div>

        {/* Submission Details */}
        {submission && (
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Submission Details</h3>
            
            {/* Submission ID */}
            {submission.id && (
              <div className="flex items-start gap-3">
                <FileText className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Submission ID</p>
                  <p className="text-sm text-gray-600">{submission.id}</p>
                </div>
              </div>
            )}

            {/* Task Title */}
            {(submission.task?.title || submission.taskTitle) && (
              <div className="flex items-start gap-3">
                <FileText className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Task</p>
                  <p className="text-sm text-gray-600">{submission.task?.title || submission.taskTitle}</p>
                </div>
              </div>
            )}

            {/* Submitted Date */}
            {(submission.submitted_at || submission.createdAt || submission.created_at) && (
              <div className="flex items-start gap-3">
                <Calendar className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Submitted At</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(submission.submitted_at || submission.createdAt || submission.created_at)}
                  </p>
                </div>
              </div>
            )}

            {/* User Info */}
            {(submission.user?.name || submission.userName) && (
              <div className="flex items-start gap-3">
                <User className="text-gray-400 mt-0.5" size={16} />
                <div>
                  <p className="text-sm font-medium text-gray-900">Submitted By</p>
                  <p className="text-sm text-gray-600">{submission.user?.name || submission.userName}</p>
                </div>
              </div>
            )}

            {/* Description */}
            {submission.description && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Description</p>
                <p className="text-sm text-gray-600 leading-relaxed">{submission.description}</p>
              </div>
            )}

            {/* Files */}
            {submission.files && submission.files.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-2">Attached Files</p>
                <div className="space-y-2">
                  {submission.files.map((file: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                      <FileText className="text-gray-400" size={16} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{file.name || file.filename}</p>
                        {file.size && (
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        )}
                      </div>
                      {file.url && (
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          View
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status */}
            {submission.status && (
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                  submission.status === 'revision' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {submission.status}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {onViewSubmissions && (
            <button
              onClick={onViewSubmissions}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View All Submissions
            </button>
          )}
          
          {onNewSubmission && (
            <button
              onClick={onNewSubmission}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Submit Another Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}