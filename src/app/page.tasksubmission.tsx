"use client"

import React, { useState } from "react"
import TaskDetail from "@/components/organisms/task-detail/task-detail"
import TaskSuccess from "@/components/organisms/task-success/task-success"
import SubmissionSuccess from "@/components/organisms/submission-success/submission-success"
import SubmissionList from "@/components/organisms/submission-list/submission-list"
import SubmissionDetail from "@/components/organisms/submission-detail/submission-detail"
import TaskComments from "@/components/organisms/task-comments/task-comments"
import TaskCard from "@/components/molecules/cards/task-card/task-card"
import { TasksService } from "@/services/tasksService"

type ViewState = "cardView" | "detail" | "success" | "submissionSuccess" | "submissions" | "submissionDetail" | "comments" | "error"

type Submission = {
  id: string
  fileName: string
  date: string
  status: "submitted" | "approved" | "pending" | "rejected"
}

export default function TaskSubmissionPreview() {
  const [currentView, setCurrentView] = useState<ViewState>("cardView")
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [submissionResult, setSubmissionResult] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleSubmit = async (payload: { files: File[]; description: string }) => {
    console.log("Task submitted:", payload)
    
    // Simulate different scenarios for demo
    const shouldSimulateError = payload.description.toLowerCase().includes("error")
    const shouldSimulateSuccess = !shouldSimulateError
    
    if (shouldSimulateError) {
      // Simulate API error
      throw new Error("Network error: Unable to connect to server. Please check your internet connection and try again.")
    }
    
    if (shouldSimulateSuccess) {
      // Simulate successful submission
      const mockResult = {
        id: "sub_" + Date.now(),
        taskId: "task_123",
        task: {
          title: "Pre Test 1 for All Intern",
          description: "Complete the assigned tasks and submit your work before the deadline."
        },
        description: payload.description,
        files: payload.files.map((file, index) => ({
          id: `file_${index}`,
          name: file.name,
          size: file.size,
          url: `https://example.com/files/${file.name}`
        })),
        status: "submitted",
        submitted_at: new Date().toISOString(),
        user: {
          id: "user_123",
          name: "John Doe"
        }
      }
      
      return mockResult
    }
    
    try {
      // Real API call - replace with actual task ID when ready
      const taskId = "sample-task-id"
      const result = await TasksService.submitTask(taskId, {
        description: payload.description,
        files: payload.files
      })
      
      return result
    } catch (error: any) {
      console.error("Submit failed:", error)
      throw error
    }
  }

  const handleShowSuccess = (submissionData?: any) => {
    if (submissionData) {
      setSubmissionResult(submissionData)
      setCurrentView("submissionSuccess")
    } else {
      setCurrentView("success")
    }
  }

  const handleShowError = (error: string) => {
    setErrorMessage(error)
    setCurrentView("error")
  }

  const handleBack = () => {
    setCurrentView("cardView")
  }

  const handleViewSubmission = () => {
    setCurrentView("submissions")
  }

  const handleNewSubmission = () => {
    setCurrentView("cardView")
  }

  const handleSubmissionClick = (submission: Submission) => {
    setSelectedSubmission(submission)
    setCurrentView("submissionDetail")
  }

  const handleBackFromDetail = () => {
    setCurrentView("submissions")
  }

  const handleBackToTasks = () => {
    setCurrentView("cardView")
  }

  const handleFileClick = () => {
    console.log("File clicked")
  }

  const handleShowComments = () => {
    setCurrentView("comments")
  }

  const handleAddComment = (comment: string) => {
    console.log("New comment added:", comment)
  }

  const handleViewDetailFromCard = () => {
    setCurrentView("detail")
  }

  const handleCommentFromCard = () => {
    setCurrentView("comments")
  }

  if (currentView === "success") {
    return (
      <TaskSuccess
        taskTitle="Pre Test 1 for All Intern"
        onViewSubmission={handleViewSubmission}
        onNewSubmission={handleNewSubmission}
        onBack={handleBack}
      />
    )
  }

  if (currentView === "submissionSuccess") {
    return (
      <SubmissionSuccess
        submissionData={submissionResult}
        onBack={handleBack}
        onViewSubmissions={handleViewSubmission}
        onNewSubmission={handleNewSubmission}
      />
    )
  }

  if (currentView === "error") {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="bg-white px-4 py-3 flex items-center gap-3 border-b">
          <button 
            onClick={handleBack}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-medium text-gray-900">Submission Failed</h1>
        </div>
        
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h2 className="text-red-800 font-medium">Submission Failed</h2>
                <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleBack}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "submissions") {
    return (
      <SubmissionList
        onBack={handleBack}
        onSubmissionClick={handleSubmissionClick}
      />
    )
  }

  if (currentView === "submissionDetail" && selectedSubmission) {
    return (
      <SubmissionDetail
        submissionId={selectedSubmission.id}
        // Fallback props for backward compatibility
        date={selectedSubmission.date}
        description="Lorem ipsum dolor sit amet consectetur. Quis consectetur adipiscing amet sed viverra sem. Pellentesque habitant morbi tristique senectus et mauris. Eget lorem dolor feugiat morbi. Dolor libero quam mauris amet ut. Ut ut risus quam."
        fileName={selectedSubmission.fileName}
        fileSize="20 MB"
        status={selectedSubmission.status}
        feedback={selectedSubmission.status === "approved" ? "Great Work!" : undefined}
        onBack={handleBackFromDetail}
        onFileClick={handleFileClick}
        onBackToTasks={handleBackToTasks}
      />
    )
  }

  if (currentView === "comments") {
    return (
      <TaskComments
        taskTitle="Pre Test 1 for All Intern"
        deadline="14 Aug 2024, 18:00"
        onBack={handleBack}
        onAddComment={handleAddComment}
      />
    )
  }

  if (currentView === "detail") {
    return (
      <div className="min-h-screen bg-white p-4">
        <TaskDetail
          title="Pre Test 1 for All Intern"
          deadline="December 31, 2024"
          description="Complete the assigned tasks and submit your work before the deadline. Make sure to include all required files and provide a detailed description of your solution."
          onOpen={() => console.log("Open clicked")}
          onSubmit={handleSubmit}
          onShowSuccess={handleShowSuccess}
          onShowError={handleShowError}
          onShowComments={handleShowComments}
        />
      </div>
    )
  }

  // Default Card View - Simulating Division Page (UI-UX, Backend, etc.)
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <button className="p-1 hover:bg-gray-100 rounded-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">UI-UX Division Tasks</h1>
        </div>
        
        <TaskCard
          status="submitted"
          title="Pre Test 1 for All Intern"
          deadline="14 Aug 2024, 18:00"
          unread={true}
          statusIcons={{
            submitted: "/assets/icons/submitted.png",
            revision: "/assets/icons/revisi.png",
            approved: "/assets/icons/approved.png",
          }}
          onViewDetail={handleViewDetailFromCard}
          onComment={handleCommentFromCard}
        />
        
        <TaskCard
          status="approved"
          title="UI/UX Design Wireframe"
          deadline="12 Aug 2024, 16:00"
          statusIcons={{
            submitted: "/assets/icons/submitted.png",
            revision: "/assets/icons/revisi.png",
            approved: "/assets/icons/approved.png",
          }}
          onViewDetail={handleViewDetailFromCard}
          onComment={handleCommentFromCard}
        />
        
        <TaskCard
          status="revision"
          title="User Research Analysis"
          deadline="10 Aug 2024, 14:00"
          unread={true}
          statusIcons={{
            submitted: "/assets/icons/submitted.png",
            revision: "/assets/icons/revisi.png",
            approved: "/assets/icons/approved.png",
          }}
          onViewDetail={handleViewDetailFromCard}
          onComment={handleCommentFromCard}
        />

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 mb-2">
            <strong>Demo Features:</strong>
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Klik "View Detail" untuk submit task dengan error handling</li>
            <li>• Submit berhasil akan menampilkan detail submission</li>
            <li>• Submit gagal akan menampilkan pesan error yang detail</li>
            <li>• Ketik "error" di description untuk simulasi error</li>
            <li>• View submission menggunakan API Get Task Submission by ID</li>
            <li>• Klik "Comment" untuk melihat halaman komentar</li>
          </ul>
        </div>
      </div>
    </div>
  )
}