"use client"

import { Suspense, useState } from 'react'
import { InternOfYears } from '@/components/organisms/intern-of-(years)/intern-of-(years)'

export default function YearBasedDivisionsPreview() {
  const [selectedYear, setSelectedYear] = useState('2025')
  
  const availableYears = ['2023', '2024', '2025']
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header with year selector */}
        <div className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-2xl font-bold text-center mb-4">
            Intern Division Preview
          </h1>
          
          {/* Year Selector */}
          <div className="flex justify-center space-x-2 mb-4">
            <label className="text-sm font-medium text-gray-700">
              Select Year:
            </label>
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          {/* Current selection display */}
          <div className="text-center">
            <h2 className="font-bold text-xl text-gray-800">
              Intern of sawala {selectedYear}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Member data will be filtered for this year
            </p>
          </div>
        </div>

        {/* Division List */}
        <div className="p-4">
          <Suspense fallback={
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          }>
            <InternOfYears year={`intern-of-sawala-${selectedYear}`} />
          </Suspense>
        </div>

        {/* Info Panel */}
        <div className="p-4 bg-blue-50 border-t border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Select different years to see member count changes</li>
            <li>• Each year shows only members from that specific year</li>
            <li>• Data is fetched from API endpoint: <code className="bg-blue-100 px-1 rounded">/api/users/division/:id</code></li>
            <li>• Currently using mock data for demonstration</li>
          </ul>
        </div>
      </div>
    </div>
  )
}