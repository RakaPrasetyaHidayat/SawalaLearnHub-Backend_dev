"use client";

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { InternOfYears } from '@/components/organisms/intern-of-(years)'

interface AboutClientProps { initialCounts?: Record<string, number> | null }

export function AboutClient({ initialCounts = null }: AboutClientProps) {
  const searchParams = useSearchParams()
  const year = searchParams.get('year') || '2025'
  
  // Format year for API calls (e.g., "2025" -> "intern-of-sawala-2025")
  const formattedYear = `intern-of-sawala-${year}`

  return (
    <div className='justify-center items-center h-full'>
      <div className="justify-center items-center h-full flex relative">
        <div className=" items-center flex h-full relative w-[350px] max-[340px]:w-full pt-4 pb-2">
          <button
            className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <Image src="/assets/icons/arrow-left.png" alt="Back" width={8} height={8} />
          </button>
          <h1 className='font-bold text-xl'>Intern of sawala {year}</h1>
        </div>
      </div>
      <div className='space-y-3 p-4'>
          <InternOfYears year={formattedYear} initialCounts={initialCounts} />
      </div>
    </div>
  )
}
