"use client";

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { InternOfYears } from '@/components/organisms/intern-of-(years)'

export function AboutClient() {
  const searchParams = useSearchParams()
  const year = searchParams.get('year') || '2025'

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
        <InternOfYears />
      </div>
    </div>
  )
}
