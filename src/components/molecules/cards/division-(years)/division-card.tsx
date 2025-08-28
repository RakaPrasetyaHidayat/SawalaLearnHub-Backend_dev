import React from 'react'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

interface EntityCardProps {
  logo: string
  logoAlt: string
  title: string
  years: string
  onClick?: () => void
  className?: string
  logoSize?: number
  chevronSize?: number
}

const EntityCard: React.FC<EntityCardProps> = ({
  logo,
  logoAlt,
  title,
  years,
  onClick,
  className = '',
  logoSize = 40,
  chevronSize = 20
}) => {
  return (
    <div 
      className={`
        relative bg-white border border-gray-200 rounded-lg p-4 max-[349px]:p-3 cursor-pointer
        hover:shadow-md transition-all duration-200 hover:border-gray-300 h-[61px] max-[349px]:h-[56px]
        flex items-center justify-center mb-4 max-[349px]:mb-3
        ${onClick ? 'hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Dashed border effect */}
      <div className="absolute inset-0 border-black-200 rounded-lg pointer-events-none bg-gray-100 justify-center items-center p-0" />
      
      <div className="flex items-center justify-between relative z-10 w-full">
        <div className="flex items-center space-x-3 max-[349px]:space-x-2 ">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image 
              src={logo} 
              alt={logoAlt}
              width={logoSize} 
              height={logoSize}
              className="object-contain h-[42px] max-[349px]:h-8 ml-[-5px]"
            />
          </div>
          
          {/* Text content */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900 text-lg max-[349px]:text-base leading-tight">
              {title}
            </h3>
            <p className="text-gray-600 text-sm max-[349px]:text-xs leading-tight">
              {years}
            </p>
          </div>
        </div>
        
        {/* Chevron icon */}
        <div className="flex-shrink-0 text-gray-400">
          <ChevronRight size={chevronSize} />
        </div>
      </div>
    </div>
  )
}

export default EntityCard
