import React from 'react'

interface TitleProps {
    title: string
    subtitle?: string
    titleClassName?: string
    subtitleClassName?: string
    containerClassName?: string
    align?: 'left' | 'center' | 'right'
}

const Title: React.FC<TitleProps> = ({
    title,
    subtitle,
    titleClassName = '',
    subtitleClassName = '',
    containerClassName = '',
    align = 'left'
}) => {
    const getAlignmentClasses = () => {
        switch (align) {
            case 'center':
                return 'text-center'
            case 'right':
                return 'text-right'
            default:
                return 'text-left'
        }
    }

    return (
        <div className={`${getAlignmentClasses()} ${containerClassName}`}>
            <h1 className={`text-3xl font-bold mb-2 ${titleClassName}`}>
                {title}
            </h1>
            {subtitle && (
                <p className={`text-lg text-gray-600 ${subtitleClassName}`}>
                    {subtitle}
                </p>
            )}
        </div>
    )
}

export default Title