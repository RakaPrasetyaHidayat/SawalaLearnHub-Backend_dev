import React from 'react'

interface YearSelectorProps {
  selectedYear: string
  onYearChange: (year: string) => void
  availableYears?: string[]
  className?: string
  label?: string
}

export default function YearSelector({ 
  selectedYear, 
  onYearChange, 
  availableYears = ['2023', '2024', '2025'],
  className = '',
  label = 'Select Year:'
}: YearSelectorProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select 
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {availableYears.map(year => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  )
}