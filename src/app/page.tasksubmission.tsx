"use client"

import React, { useState } from "react"
import TaskDetail from "@/components/organisms/task-detail/task-detail"
import TaskSuccess from "@/components/organisms/task-success/task-success"
import SubmissionList from "@/components/organisms/submission-list/submission-list"
import SubmissionDetail from "@/components/organisms/submission-detail/submission-detail"
import TaskComments from "@/components/organisms/task-comments/task-comments"
import TaskCard from "@/components/molecules/cards/task-card/task-card"

type ViewState = "cardView" | "detail" | "success" | "submissions" | "submissionDetail" | "comments"

type Submission = {
  id: string
  fileName: string
  date: string
  status: "submitted" | "approved" | "pending" | "rejected"
}

export default function TaskSubmissionPreview() {
  const [currentView, setCurrentView] = useState<ViewState>("cardView")
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)

  const handleSubmit = (payload: { files: File[]; description: string }) => {
    console.log("Task submitted:", payload)
    // Simulate submission logic here
  }

  const handleShowSuccess = () => {
    setCurrentView("success")
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
          <p className="text-sm text-blue-800">
            <strong>Demo:</strong> Klik tombol "Comment" pada TaskCard manapun untuk melihat halaman komentar.
            TaskCard ini mensimulasikan TaskCard yang ada di halaman divisi (UI-UX, Backend, dll).
          </p>
        </div>
      </div>
    </div>
  )
}