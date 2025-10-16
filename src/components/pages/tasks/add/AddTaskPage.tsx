"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { getCurrentUser } from "@/services/authService";
import { TasksService } from "@/services/tasksService";
import { useRouter } from "next/navigation";

export default function AddTaskPage() {
  const [deadline, setDeadline] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [division, setDivision] = useState("");
  const [angkatan, setAngkatan] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingUser(true);
        const user = await getCurrentUser();
        if (!mounted) return;
        const role = (user?.role || user?.roles || "").toString().toLowerCase();
        const adminFlag =
          role === "admin" || (Array.isArray(user?.roles) && user.roles.some((r: any) => String(r).toLowerCase() === "admin")) || user?.isAdmin || user?.is_admin;
        setIsAdmin(Boolean(adminFlag));
      } catch (e: any) {
        console.error("Failed to load current user:", e);
        setError("Failed to verify user. Please login again.");
      } finally {
        setLoadingUser(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (loadingUser) {
      setError("Still verifying user role, please wait...");
      return;
    }

    if (!isAdmin) {
      setError("Only admins can create tasks.");
      return;
    }

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!division) {
      setError("Division is required");
      return;
    }

    if (!angkatan.trim()) {
      setError("Angkatan is required");
      return;
    }

    try {
      setSubmitting(true);

      // Use FormData if there's a file, otherwise send JSON payload
      let payload: any;
      if (file) {
        const fd = new FormData();
        fd.append("title", title.trim());
        fd.append("description", description.trim());
        if (deadline) fd.append("deadline", deadline);
        fd.append("division_id", division);
        fd.append("channel_year", angkatan);
        fd.append("file", file);
        payload = fd;
      } else {
        payload = {
          title: title.trim(),
          description: description.trim(),
          deadline: deadline || undefined,
          division_id: division,
          channel_year: angkatan,
        };
      }

      const result = await TasksService.createTask(payload);
      console.log("Create task result:", result);

      // On success, navigate back to tasks list
      router.back();
    } catch (e: any) {
      console.error("Failed to create task:", e);
      setError("Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingUser) {
    return <div>Checking permissions...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Add new Tasks</h1>
        <div className="text-red-600 mt-4">Only admins can create tasks.</div>
      </div>
    );
  }

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
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <label htmlFor="deadline">Deadline</label>
          <Input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required={false}
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
          <label htmlFor="division">Division</label>
          <select
            id="division"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Division</option>
            <option value="DevOps">DevOps</option>
            <option value="Frontend">Frontend</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Backend">Backend</option>
          </select>
        </div>
        <div>
          <label htmlFor="angkatan">Angkatan</label>
          <Input
            type="number"
            id="angkatan"
            value={angkatan}
            onChange={(e) => setAngkatan(e.target.value)}
            required
            className="h-11"
          />
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
          disabled={submitting}
          className="bg-blue-600 text-white py-2 px-4 rounded"
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
