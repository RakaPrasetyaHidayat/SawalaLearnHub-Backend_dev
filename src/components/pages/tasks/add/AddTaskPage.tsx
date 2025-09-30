"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function AddTaskPage() {
  const [deadline, setDeadline] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ deadline, title, description, file });
    // Add logic to submit the task
  };

  return (
    <div className="add-task-page h-1000">
      <div className="flex items-center space-x-2 h-1000">
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">Add new Tasks</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="deadline">Deadline</label>
          <Input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            className="h-11"
          />
        </div>
        <div>
          <label htmlFor="title">Title</label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-37"
          />
        </div>
        <div>
          <label htmlFor="description">Description or Link</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="file">File</label>
          <input
            type="file"
            id="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
