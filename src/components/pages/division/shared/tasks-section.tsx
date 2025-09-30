"use client";

import TaskCard from "@/components/molecules/cards/task-card/task-card";
import type { DivisionTaskVM } from "@/hooks/useDivisionTasks";
import { useRouter } from "next/navigation";

interface TasksSectionProps {
  tasks: DivisionTaskVM[];
  onViewDetail: (taskId: DivisionTaskVM["id"]) => void;
  emptyMessage?: string;
}

export default function TasksSection({
  tasks,
  onViewDetail,
  emptyMessage = "Tidak ada tugas.",
}: TasksSectionProps) {
  const router = useRouter();

  if (!tasks.length) {
    return <div className="text-sm text-gray-600 ">{emptyMessage}</div>;
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          status={task.status}
          title={task.title}
          deadline={task.deadline}
          unread={task.unread}
          onViewDetail={() => onViewDetail(task.id)}
          statusIcons={{
            submitted: "/assets/icons/submitted.png",
            revision: "/assets/icons/revisi.png",
            approved: "/assets/icons/approved.png",
          }}
        />
      ))}
      <button
        onClick={() => {
          router.push("/tasks/add");
        }}
        className="fixed bottom-20 left-[58%] translate-x-[-45%] max-md:left-[80%] max-sm:translate-x-[-20%] md:right-[calc((100vw-1024px)/2+12px)] h-11 w-11 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 z-30 flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
}
