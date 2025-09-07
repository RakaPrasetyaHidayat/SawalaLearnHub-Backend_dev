import React from 'react'

interface DivisionCardSkeletonProps {
  className?: string
}

const DivisionCardSkeleton: React.FC<DivisionCardSkeletonProps> = ({
  className = ''
}) => {
  return (
    <div 
      className={`
        relative bg-white rounded-lg p-4 max-[349px]:p-3
        min-h-[61px] max-[349px]:min-h-[56px]
        flex items-center justify-center mb-4 max-[349px]:mb-3
        animate-pulse
        ${className}
      `}
    >
      {/* Dashed border effect */}
      <div className="absolute inset-0 border-gray-200 rounded-lg pointer-events-none bg-gray-100" />
      
      <div className="flex items-center justify-between relative z-10 w-full">
        <div className="flex items-center space-x-3 max-[349px]:space-x-2">
          {/* Logo skeleton */}
          <div className="flex-shrink-0">
            <div className="w-[42px] h-[42px] max-[349px]:w-8 max-[349px]:h-8 bg-gray-300 rounded-md" />
          </div>
          
          {/* Text content skeleton */}
          <div className="flex flex-col space-y-2">
            <div className="h-4 bg-gray-300 rounded w-24" />
            <div className="h-3 bg-gray-300 rounded w-16" />
          </div>
        </div>
        
        {/* Chevron skeleton */}
        <div className="flex-shrink-0">
          <div className="w-5 h-5 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  )
}

export default DivisionCardSkeleton