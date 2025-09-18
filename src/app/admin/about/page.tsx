import { Suspense } from "react";
import { AboutClient } from "@/app/main-Page/about/about-client";

export default function AdminAboutIntern() {
  return (
    <Suspense fallback={<div />}>
      <AboutClient />
    </Suspense>
  );
}
