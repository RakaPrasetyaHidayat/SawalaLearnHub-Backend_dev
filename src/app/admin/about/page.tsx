import { Suspense } from "react";
import { AboutClient } from "@/app/main-Page/about/about-client";

export default async function AdminAboutIntern({ searchParams }: { searchParams?: Promise<{ year?: string }> }) {
  const resolvedParams = (await searchParams) || {};
  const yearParam = resolvedParams.year || '2025';

  // Build a base URL for server-side fetch to our proxy route.
  const host = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || `http://localhost:${process.env.PORT || 3000}`;
  const base = host.startsWith('http') ? host : `https://${host}`;

  let counts: any = null;
  try {
    const res = await fetch(`${base}/api/proxy/divisions?year=${encodeURIComponent(yearParam)}`, { cache: 'no-store' });
    if (res.ok) {
      const j = await res.json();
      if (j?.ok && j.counts) counts = j.counts;
    }
  } catch (e) {
    // ignore - client will fallback
  }

  return (
    <Suspense fallback={<div />}>
      <AboutClient initialCounts={counts} />
    </Suspense>
  );
}
