import React from 'react'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

interface EntityCardProps {
  logo: string
  logoAlt: string
  title: string
  subtitle: string
  onClick?: () => void
  className?: string
  logoSize?: number
  chevronSize?: number
}

const EntityCard: React.FC<EntityCardProps> = ({
  logo,
  logoAlt,
  title,
  subtitle,
  onClick,
  className = '',
  logoSize = 40,
  chevronSize = 20
}) => {
  return (
    <div 
      className={`
        relative bg-white border border-gray-200 rounded-lg p-4 cursor-pointer
        hover:shadow-md transition-all duration-200 hover:border-blue-300
        ${onClick ? 'hover:scale-[1.02]' : ''}
        ${className}
      `}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {/* Dashed border effect */}
      <div className="absolute inset-0 border-2 border-dashed border-blue-200 rounded-lg pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image 
              src={logo} 
              alt={logoAlt}
              width={logoSize} 
              height={logoSize}
              className="object-contain"
            />
          </div>
          
          {/* Text content */}
          <div className="flex flex-col">
            <h3 className="font-bold text-gray-900 text-lg leading-tight">
              {title}
            </h3>
            <p className="text-gray-600 text-sm leading-tight">
              {subtitle}
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
