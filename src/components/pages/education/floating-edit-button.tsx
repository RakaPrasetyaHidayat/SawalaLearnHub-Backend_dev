"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export function FloatingEditButton() {
  const router = useRouter();

  const handleEdit = () => {
    router.push("/main-Page/profile/education/edit");
  };

  return (
    <button 
      onClick={handleEdit}
      className="fixed bottom-20 left-[59%] translate-x-[-45%] max-md:left-[80%] max-sm:translate-x-[-20%] w-[32px] h-[32px] bg-[#2B7FFF] hover:bg-blue-500 rounded-full flex items-center justify-center shadow-lg transition-colors"
    >
      <Pencil className="w-[18px] h-[18px] text-white" />
    </button>
  );
}
