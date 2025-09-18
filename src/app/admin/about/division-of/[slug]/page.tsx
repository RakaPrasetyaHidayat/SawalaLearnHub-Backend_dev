import React, { Suspense } from "react";
import { FrontendDivision } from "@/components/pages/division/frontend";
import { BackendDivision } from "@/components/pages/division/backend";
import { UiUxSection } from "@/components/pages/division/ui-ux";
import { DivisionHeader } from "@/components/client/division-header";
import { DevOpsDivision } from "@/components/pages/division/devops";
import { AllDivision } from "@/components/pages/division/all";

// Helper to normalize slug/title into a stable key
const normalizeToKey = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") // remove separators
    .replace(/(designer|developer|dev)$/g, ""); // strip trailing role suffixes

export default async function AdminDivisionDynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const decodedSlug = decodeURIComponent(rawSlug);
  const key = normalizeToKey(decodedSlug);

  let content: React.ReactNode;
  switch (key) {
    case "frontend":
      content = <FrontendDivision />;
      break;
    case "backend":
      content = <BackendDivision />;
      break;
    case "uiux":
      content = <UiUxSection />;
      break;
    case "devops":
      content = <DevOpsDivision />;
      break;
    case "alldivision":
    case "all":
      content = <AllDivision />;
      break;
    default:
      content = (
        <div className="p-4">Division “{rawSlug}” tidak ditemukan.</div>
      );
  }

  return (
    <div className="justify-center items-center h-full">
      <DivisionHeader />
      <div className="space-y-3 p-4">
        <Suspense
          fallback={
            <div className="mt-4 text-sm text-gray-600">
              Loading division...
            </div>
          }
        >
          {content}
        </Suspense>
      </div>
    </div>
  );
}
