"use client"

import React, { useMemo, useState } from "react"

type NavigationItem = {
  key: string
  label: string
}

interface NavigationBarProps {
  items?: NavigationItem[]
  value?: string
  defaultValue?: string
  onChange?: (key: string) => void
  className?: string
}

/**
 * A simple, reusable top navigation bar with tab-like behavior.
 * - Defaults to two items: "Intern" and "Post".
 * - Supports controlled (value + onChange) and uncontrolled (defaultValue) usage.
 * - Emits the selected key via onChange so pages can conditionally render content.
 */
function NavigationBar({
  items,
  value,
  defaultValue,
  onChange,
  className,
}: NavigationBarProps) {
  const resolvedItems = useMemo<NavigationItem[]>(
    () => items ?? [
      { key: "intern", label: "Intern" },
      { key: "post", label: "Post" },
    ],
    [items]
  )

  const initial = defaultValue ?? resolvedItems[0]?.key
  const [internalValue, setInternalValue] = useState<string | undefined>(initial)

  const selectedKey = value !== undefined ? value : internalValue

  function handleSelect(nextKey: string) {
    if (value === undefined) setInternalValue(nextKey)
    onChange?.(nextKey)
  }

  return (
    <nav className={`${className ?? ""} w-full`} aria-label="Section navigation">
      <ul className="flex items-center justify-between w-full pb-2 border-b-1">
        {resolvedItems.map((item) => {
          const isActive = item.key === selectedKey
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => handleSelect(item.key)}
                className={
                  `${isActive ? "text-blue-600" : "text-black"} font-medium focus:outline-none cursor-pointer`
                }
                aria-current={isActive ? "page" : undefined}
              >
                <div className="flex flex-col items-start">
                  <span>{item.label}</span>
                  <span className={`${isActive ? "block" : "invisible"} h-[2px] w-full bg-blue-600 rounded-sm mt-1`}></span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default NavigationBar


