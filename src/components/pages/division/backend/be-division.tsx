"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavigationBar from "@/components/molecules/navigationbar/navigationbar";
import UserCard from "@/components/molecules/cards/user-card/user-card";
import TaskCard from "@/components/molecules/cards/task-card/task-card";
import { Resource as Resources } from "@/components/organisms/resources/resources";
import { useDivisionMembers } from "@/hooks/useDivisionMembers";

export default function BackendDivision({
  imageSrc = "/assets/images/download.png",
  imageAlt = "Backend Division Landing Preview",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState("people");
  const items = [
    { key: "people", label: "People" },
    { key: "tasks", label: "Tasks" },
    { key: "resources", label: "Resources" },
  ];

  const yearParam = searchParams.get("year") || undefined;
  const { members, loading, error } = useDivisionMembers("backend", yearParam);

  const peopleSection = useMemo(() => {
    if (loading)
      return (
        <div className="mt-4 text-sm text-gray-600">Loading members...</div>
      );
    if (error)
      return (
        <div className="mt-4 text-sm text-red-600">
          Failed to load members: {error}
        </div>
      );
    if (!members.length)
      return (
        <div className="mt-4 text-sm text-gray-600">
          Tidak ada member untuk tahun ini.
        </div>
      );

    return (
      <div className="mt-4 space-y-3">
        {members.map((m) => (
          <UserCard
            key={m.id}
            username={m.username}
            division="Backend Developer"
            school={m.school}
            avatarSrc={m.avatarSrc}
          />
        ))}
      </div>
    );
  }, [loading, error, members]);

  return (
    <div className="w-full relative">
      <div className="mx-auto w-full max-w-4xl px-4">
        <div className="overflow-hidden shadow-md">
          <div className="relative w-full aspect-[16/9] overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        <NavigationBar
          items={items}
          value={tab}
          onChange={setTab}
          className="mt-4"
        />

        {tab === "people" && peopleSection}

        {tab === "tasks" && (
          <div className="mt-4 space-y-3">
            <TaskCard
              status="submitted"
              title="Backend API Development"
              deadline="14 Aug 2024, 18:00"
              statusIcons={{ submitted: "/assets/icons/submitted.png" }}
              onViewDetail={() =>
                router.push("/main-Page/about/division-of/detail-task")
              }
            />
            <TaskCard
              status="revision"
              title="Database Schema Design"
              deadline="14 Aug 2024, 18:00"
              unread
              statusIcons={{ revision: "/assets/icons/revisi.png" }}
              onViewDetail={() =>
                router.push("/main-Page/about/division-of/detail-task")
              }
            />
          </div>
        )}

        {tab === "resources" && <Resources />}
      </div>
    </div>
  );
}
