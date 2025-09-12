"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ResourceCard from "@/components/molecules/cards/resources/resource-card/resource-card";
import ResourcesHeader from "@/components/molecules/cards/resources/resource-header/resources-header";
import { useEffect, useState } from "react";
import { getAuthToken } from "@/services/fetcher";

interface ResourceItem {
  id: string;
  title: string;
  author: string;
  role?: string;
  description: string;
  date: string;
  likes: number | string;
}

export default function Resources({
  divisionId: divisionIdProp,
  year: yearProp,
}: { divisionId?: string; year?: string | number } = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const divisionIdFromUrl = searchParams.get("division_id") || "";
  const yearParamFromUrl = searchParams.get("year") || ""; // only filter by year if provided in URL
  const divisionId = divisionIdProp || divisionIdFromUrl;
  // accept values like "2025" or "intern-of-sawala-2025"
  const resolvedYearParam = (yearProp ?? yearParamFromUrl).toString();
  const year = /\d{4}$/.test(resolvedYearParam)
    ? resolvedYearParam.match(/(\d{4})$/)?.[1] || resolvedYearParam
    : resolvedYearParam;
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        // Build query using division_id and year from URL params
        const query = new URLSearchParams();
        if (divisionId) query.set("division_id", divisionId);
        if (year) query.set("year", year);

        const token = getAuthToken();
        const res = await fetch(`/api/resources?${query.toString()}`, {
          cache: "no-store",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        const contentType = res.headers.get("content-type") || "";
        const raw = contentType.includes("application/json")
          ? await res.json().catch(() => [])
          : [];
        if (!res.ok)
          throw new Error(
            (raw && (raw.message || raw.error)) || "Failed to load"
          );

        // Normalize API data to ResourceItem[] with flexible shapes
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray((raw as any)?.data?.resources)
          ? (raw as any).data.resources
          : Array.isArray((raw as any)?.resources)
          ? (raw as any).resources
          : Array.isArray((raw as any)?.data)
          ? (raw as any).data
          : [];

        const data: ResourceItem[] = list.map((r: any) => ({
          id: r.id || r._id || r.uuid,
          title: r.title || r.name || "Untitled",
          author: r.created_by || r.author || "Anonymous",
          role: r.type || r.category,
          description: r.description || r.desc || "",
          date: r.created_at
            ? new Date(r.created_at).toLocaleDateString()
            : r.date || "",
          likes: r.likes ?? r.like_count ?? 0,
        }));

        if (!ignore) setItems(data);
      } catch (e: unknown) {
        const message =
          e instanceof Error
            ? e.message || "Failed to load resources"
            : "Failed to load resources";
        if (!ignore) setError(message);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    // Only load if we have at least year; divisionId optional according to your URLs
    load();
    return () => {
      ignore = true;
    };
  }, [divisionId, year]);

  return (
    <div className="mt-4 space-y-3 relative h-full">
      <ResourcesHeader
        valueCategory="all"
        valueSort="newest"
        onChangeCategory={() => {}}
        onChangeSort={() => {}}
      />

      {loading && <div className="text-sm text-gray-500">Loading...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && items.length === 0 && (
        <div className="text-sm text-gray-600">No resources yet.</div>
      )}

      {items.map((r) => (
        <ResourceCard
          key={r.id}
          title={r.title}
          author={r.author || "Anonymous"}
          role={r.role}
          description={r.description}
          date={r.date}
          likes={r.likes}
          onView={() => router.push(`/main-Page/resources/${r.id}`)}
        />
      ))}

      <button
        onClick={() => {
          const params = new URLSearchParams();
          if (divisionId) params.set("division_id", divisionId);
          if (year) params.set("year", year);
          router.push(`/main-Page/resources/add?${params.toString()}`);
        }}
        className="fixed bottom-20 left-[58%] translate-x-[-45%] max-md:left-[80%] max-sm:translate-x-[-20%] md:right-[calc((100vw-1024px)/2+12px)] h-11 w-11 rounded-lg bg-blue-600 text-white shadow-lg hover:bg-blue-700 z-30 flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
}
