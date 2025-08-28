import { Suspense } from "react";
import { AboutClient } from "./about-client";

export default function AboutIntern() {
  return (
    <Suspense fallback={<div />}> 
      <AboutClient />
    </Suspense>
  )
}
