"use client"
import DivisionCard from "@/components/molecules/cards/division-card/division"
import DivisionCardSkeleton from "@/components/molecules/cards/division-card/division-skeleton"
import React from 'react'
import { useRouter } from "next/navigation"
import { useDivisions, useCurrentInternYear, useFormatMemberCount, formatYearForAPI, extractYearFromFormatted } from '@/hooks/useDivisions'

interface InternOfYearsProps {
  year?: string // Optional prop to specify year, defaults to current year
}

export function InternOfYears({ year }: InternOfYearsProps) {
  const router = useRouter()
  const currentYear = useCurrentInternYear()
  const targetYear = formatYearForAPI(year || currentYear)
  const { divisions, loading, error, refetch, retryCount } = useDivisions(targetYear)
  const formatMemberCount = useFormatMemberCount()
  const displayYear = extractYearFromFormatted(targetYear)

  const handleCardClick = (title: string) => {
    router.push(`/main-Page/about/division-of?title=${encodeURIComponent(title)}&year=${encodeURIComponent(targetYear)}`)
  }

  const handleRetry = () => {
    refetch()
  }

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
    )
  }

  if (error) {
    return (
      <div className="h-[700px] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-2 font-semibold">Failed to load divisions</p>
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
              If this persists, the API might not be available. Check console for details.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[700px]">
      {/* Display current year info */}
      <div className="mb-4 text-center">
        <p className="text-sm text-gray-600">
          Showing member data for year: <span className="font-semibold">{displayYear}</span>
        </p>
      </div>

      {/* Render division cards */}
      {divisions.map((division) => (
        <DivisionCard
          key={division.id}
          logo={division.logo}
          logoAlt={division.logoAlt}
          title={division.name}
          members={formatMemberCount(division.memberCount)}
          logoSize={48}
          chevronSize={22}
          onClick={() => handleCardClick(division.name)}
        />
      ))}

      {/* Show message if no divisions */}
      {divisions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No divisions found for {targetYear}</p>
        </div>
      )}
    </div>
  )
}