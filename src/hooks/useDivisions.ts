import { useState, useEffect } from 'react'
import { Division, DivisionService } from '@/services/division'

export interface UseDivisionsResult {
  divisions: Division[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  retryCount: number
}

/**
 * Custom hook to fetch divisions with member count
 */
export function useDivisions(year: string): UseDivisionsResult {
  const [divisions, setDivisions] = useState<Division[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchDivisions = async (isRetry = false) => {
    try {
      setLoading(true)
      if (!isRetry) {
        setError(null)
        setRetryCount(0)
      }
      
      console.log(`Fetching divisions for year: ${year}`)
      
      const divisionsData = await DivisionService.getDivisionsWithMemberCount(year)
      
      // Handle "All Division" special case - get total count
      const updatedDivisions = await Promise.all(
        divisionsData.map(async (division) => {
          if (division.id === 'all') {
            const totalCount = await DivisionService.getTotalMemberCount(year)
            return {
              ...division,
              memberCount: totalCount
            }
          }
          return division
        })
      )
      
      console.log('Successfully fetched divisions:', updatedDivisions)
      setDivisions(updatedDivisions)
      setError(null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while fetching divisions'
      setError(errorMessage)
      console.error('Error in useDivisions:', {
        error: err,
        year,
        retryCount
      })
      
      // Auto retry for network errors (max 2 retries)
      if (retryCount < 2 && errorMessage.includes('Network')) {
        console.log(`Auto-retrying... attempt ${retryCount + 1}`)
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          fetchDivisions(true)
        }, 2000 * (retryCount + 1)) // Exponential backoff
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (year) {
      fetchDivisions()
    }
  }, [year])

  const refetch = async () => {
    setRetryCount(0)
    await fetchDivisions()
  }

  return {
    divisions,
    loading,
    error,
    refetch,
    retryCount
  }
}

/**
 * Hook to get current year for intern program
 */
export function useCurrentInternYear(): string {
  const currentYear = new Date().getFullYear()
  return `intern-of-sawala-${currentYear}`
}

/**
 * Utility to format year for API calls
 */
export function formatYearForAPI(year: string | number): string {
  if (typeof year === 'number') {
    return `intern-of-sawala-${year}`
  }
  
  // If already formatted, return as is
  if (year.startsWith('intern-of-sawala-')) {
    return year
  }
  
  // If just a year number as string, format it
  if (/^\d{4}$/.test(year)) {
    return `intern-of-sawala-${year}`
  }
  
  return year
}

/**
 * Utility to extract year number from formatted year string
 */
export function extractYearFromFormatted(formattedYear: string): string {
  const match = formattedYear.match(/intern-of-sawala-(\d{4})/)
  return match ? match[1] : formattedYear
}

/**
 * Hook to format member count display
 */
export function useFormatMemberCount() {
  return (count: number): string => {
    if (count === 0) return '0 Member'
    if (count === 1) return '1 Member'
    return `${count} Members`
  }
}