"use client"

import React from "react"

type Option = { label: string; value: string }

type ResourcesHeaderProps = {
  categories?: Option[]
  sorts?: Option[]
  valueCategory: string
  valueSort: string
  onChangeCategory: (val: string) => void
  onChangeSort: (val: string) => void
  className?: string
}

export default function ResourcesHeader({
  categories = [
    { label: "All", value: "all" },
    { label: "File", value: "file" },
    { label: "Link", value: "Link" },
  ],
  sorts = [
    { label: "Terbaru", value: "newest" },
    { label: "Terlama", value: "oldest" },
    { label: "Paling Disukai", value: "likes" },
  ],
  valueCategory,
  valueSort,
  onChangeCategory,
  onChangeSort,
  className = "",
}: ResourcesHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <div className="inline-flex items-center gap-2">
        <select
          value={valueCategory}
          onChange={(e) => onChangeCategory(e.target.value)}
          className="h-9 w-[130px] text-sm rounded-md border border-gray-300 bg-white px-3 text-sm"
        >
          {categories.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="inline-flex items-center gap-2">
        <span className="text-sm text-black">Sort by</span>
        <select
          value={valueSort}
          onChange={(e) => onChangeSort(e.target.value)}
          className="h-9 w-[82px] bg-white text-sm"
        >
          {sorts.map((opt) => (
            <option key={opt.value} value={opt.value} >{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}


