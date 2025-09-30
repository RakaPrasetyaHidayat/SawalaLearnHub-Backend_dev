"use client";

import Image from "next/image";
import { useState } from "react";

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

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFile(files[0]);
    }
  };

  return (
    <div className="h-screen add-task-page max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="flex items-center space-x-2 mb-4">
        <button
          onClick={() => window.history.back()}
          className="text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          <Image
            src="/assets/icons/arrow-left.png"
            alt="Back"
            width={12}
            height={24}
          />
        </button>
        <h1 className="text-xl font-bold">Add new Tasks</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="deadline"
            className="block text-sm font-medium text-gray-700"
          >
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            className="h-11 w-full px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter task title"
            className="h-11 w-full px-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description or Link
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full px-3 h-30 pt-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="file"
            className="block text-sm font-medium text-gray-700"
          >
            File
          </label>
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            className="h-30 pt- mt-1 block w-full border-2 border-dashed border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-4 text-center text-gray-500"
          >
            Drag and drop or{" "}
            <span className="text-blue-600 cursor-pointer">Choose file</span> to
            upload
            <br />
            (Max. File size: 25mb)
          </div>
          {file && (
            <p className="mt-2 text-sm text-gray-600">
              Selected file: {file.name}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
