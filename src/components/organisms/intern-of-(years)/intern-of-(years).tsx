"use client";
import DivisionCard from "@/components/molecules/cards/division-card/division";
import DivisionCardSkeleton from "@/components/molecules/cards/division-card/division-skeleton";
import React from "react";
import { useRouter } from "next/navigation";
import {
  useDivisions,
  useCurrentInternYear,
  useFormatMemberCount,
  formatYearForAPI,
  extractYearFromFormatted,
} from "@/hooks/useDivisions";
import { fetchDivisionCounts } from '@/services/userService';
import { getAuthToken } from '@/services/fetcher';

interface InternOfYearsProps {
  year?: string; // Optional prop to specify year, defaults to current year
  initialCounts?: Record<string, number> | null;
}

export function InternOfYears({ year, initialCounts = null }: InternOfYearsProps) {
  const router = useRouter();
  const currentYear = useCurrentInternYear();
  const targetYear = formatYearForAPI(year || currentYear);
  const { divisions, loading, error, refetch, retryCount } =
    useDivisions(targetYear);
  const [overrideCounts, setOverrideCounts] = React.useState<Record<string, number>>(() => (initialCounts ? initialCounts : {}));
  const [proxyStatus, setProxyStatus] = React.useState<'ok' | 'unauthorized' | 'unavailable' | null>(null);
  const formatMemberCount = useFormatMemberCount();
  const displayYear = extractYearFromFormatted(targetYear);

  // Slugify division names: make lowercase, replace non-alphanumerics with hyphen, trim hyphens
  const toSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleCardClick = (title: string) => {
    const slug = toSlug(title);
    const isAdminPath =
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/admin");
    const base = isAdminPath ? "/admin" : "/main-Page";
    router.push(
      `${base}/about/division-of/${encodeURIComponent(
        slug
      )}?year=${encodeURIComponent(targetYear)}`
    );
  };

  const handleRetry = () => {
    refetch();
  };

  // Try to fetch live counts from the API on the client as a best-effort.
  // This will succeed when the user has a valid auth token in localStorage
  // (apiFetcher attaches it). Failures will be logged for debugging.
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!divisions || divisions.length === 0) return;
        const ids = divisions.map(d => d.id);
        console.log('Attempting client-side fetchDivisionCounts for', ids, 'year', targetYear, 'hasToken=', !!getAuthToken());

        // Prefer server proxy if available on this app
        let countsResult: Record<string, any> | null = null;
        try {
          const proxyUrl = `/api/proxy/divisions?year=${encodeURIComponent(extractYearFromFormatted(targetYear))}`;
          const r = await fetch(proxyUrl);
          if (r.ok) {
            const j = await r.json();
            if (j?.ok && j.counts) {
              countsResult = j.counts;
              setProxyStatus('ok');
            } else if (j?.counts) {
              // proxy returned but had errors per-division
              // mark unauthorized if any division reports unauthorized
              const anyUnauth = Object.values(j.counts).some((v: any) => v && v.error === 'unauthorized');
              setProxyStatus(anyUnauth ? 'unauthorized' : 'unavailable');
              countsResult = j.counts;
            } else {
              setProxyStatus('unavailable');
            }
          } else {
            setProxyStatus('unavailable');
          }
        } catch (e) {
          // proxy not available or failed — we'll fallback to direct client fetch
          setProxyStatus('unavailable');
        }

        let counts = countsResult ?? null;
        // If proxy unavailable, but user has token, attempt direct backend fetch using exact slugs
        if (!counts && typeof window !== 'undefined' && !!getAuthToken()) {
          try {
            const slugMap: Record<string,string> = { all: 'all', frontend: 'frontend', backend: 'backend', uiux: 'UI_UX', devops: 'devops' };
            const slugs = ids.map(id => slugMap[id] ?? id);
            console.log('Attempting direct backend fetch with token for slugs', slugs);
            const raw = await (await import('@/services/userService')).fetchAllDivisionData(slugs, extractYearFromFormatted(targetYear));
            // Normalize counts from raw responses
            const normalized: Record<string, number | { error: string }> = {};
            for (const k of Object.keys(raw)) {
              const r = raw[k];
              if (r && typeof r.status === 'number' && r.status === 200) {
                const body = r.body;
                // determine count from common shapes
                const cnt = Array.isArray(body) ? body.length : Array.isArray(body?.data) ? body.data.length : Array.isArray(body?.users) ? body.users.length : 0;
                // map back to division id
                const idKey = k === 'UI_UX' ? 'uiux' : (k);
                normalized[idKey] = cnt;
              } else if (r && r.status === 401) {
                const idKey = k === 'UI_UX' ? 'uiux' : (k);
                normalized[idKey] = { error: 'unauthorized' };
              } else {
                const idKey = k === 'UI_UX' ? 'uiux' : (k);
                normalized[idKey] = 0;
              }
            }
            counts = normalized;
            setProxyStatus('ok');
          } catch (e) {
            console.warn('Direct backend fetch failed:', e);
          }
        }

        if (!counts) counts = await fetchDivisionCounts(ids, extractYearFromFormatted(targetYear));
        if (!mounted) return;
        console.log('fetchDivisionCounts result:', counts);
        const normalized: Record<string, number> = {};
        for (const k of Object.keys(counts)) {
          const v = counts[k];
          if (typeof v === 'number') normalized[k] = v;
        }
        setOverrideCounts(normalized);
      } catch (e) {
        console.warn('fetchDivisionCounts failed (client):', e);
      }
    })();
    return () => { mounted = false; };
  }, [divisions, targetYear]);

  if (loading) {
    return (
      <div className="h-[700px]">
        <div className="mb-4 text-center">
          <div className="h-4 bg-gray-300 rounded w-48 mx-auto animate-pulse" />
        </div>
        {/* Show skeleton cards */}
        {Array.from({ length: 5 }).map((_, index) => (
          <DivisionCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[700px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-600 mb-2 font-semibold">
            Failed to load divisions
          </p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          {retryCount > 0 && (
            <p className="text-gray-500 text-xs mb-4">
              Retry attempts: {retryCount}/2
            </p>
          )}
          <div className="space-y-2">
            <button
              onClick={handleRetry}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors block w-full"
            >
              Try Again
            </button>
            <p className="text-xs text-gray-500">
              If this persists, the API might not be available. Check console
              for details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[700px]">
      {proxyStatus === 'unauthorized' && (
        <div className="mb-3 text-center text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
          Proxy available but unauthorized. Set server token (LEARNHUB_SERVER_TOKEN) or ensure users are logged in to view counts.
        </div>
      )}
      {proxyStatus === 'unavailable' && (
        <div className="mb-3 text-center text-sm text-gray-700 bg-gray-50 p-2 rounded">
          Proxy unavailable — falling back to direct API calls (may require login).
        </div>
      )}
      {/* Display current year info */}
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600">
          Menampilkan data anggota untuk angkatan:{" "}
          <span className="font-semibold">{displayYear}</span>
        </p>
      </div>

      {/* Render division cards */}
      {divisions.map((division) => (
        <DivisionCard
          key={division.id}
          logo={division.logo}
          logoAlt={division.logoAlt}
          title={division.name}
          members={formatMemberCount(overrideCounts[division.id] ?? division.memberCount)}
          logoSize={48}
          chevronSize={22}
          onClick={() => handleCardClick(division.name)}
        />
      ))}

      {/* Show message if no divisions */}
      {divisions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">
            Tidak ada divisi untuk angkatan {displayYear}
          </p>
        </div>
      )}
    </div>
  );
}
