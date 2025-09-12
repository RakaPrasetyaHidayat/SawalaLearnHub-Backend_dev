"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { extractYearFromFormatted } from "@/hooks/useDivisions";

function getDisplayYear(param: string | null): string {
  if (!param) return String(new Date().getFullYear());
  // If plain year like "2025"
  const plainYearMatch = param.match(/^(19|20)\d{2}$/);
  if (plainYearMatch) return plainYearMatch[0];
  // If formatted like "intern-of-sawala-2025"
  const extracted = extractYearFromFormatted(param);
  if (extracted) return extracted;
  // Fallback: find any 4-digit year in the string
  const anyYear = param.match(/(19|20)\d{2}/);
  return anyYear ? anyYear[0] : String(new Date().getFullYear());
}

export function DivisionHeader() {
  const searchParams = useSearchParams();
  const yearParam = searchParams.get("year");
  const year = getDisplayYear(yearParam);

  return (
    <div className="justify-center items-center h-full">
      <div className="justify-center items-center h-full flex relative">
        <div className=" items-center flex h-full relative w-[350px] max-[340px]:w-full pt-4 pb-2">
          <button
            className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <Image
              src="/assets/icons/arrow-left.png"
              alt="Back"
              width={8}
              height={8}
            />
          </button>
          <h1 className="font-bold text-xl">Intern of sawala {year}</h1>
        </div>
      </div>
    </div>
  );
}
