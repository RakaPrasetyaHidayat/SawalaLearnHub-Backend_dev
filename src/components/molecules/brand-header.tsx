"use client"

import Image from "next/image"
import React from "react"

interface BrandHeaderProps {
    imageSrc?: string
    imageAlt?: string
    title?: string
    subtitle?: string
    containerClassName?: string
    imageContainerClassName?: string
    textContainerClassName?: string
}

export default function BrandHeader({
    imageSrc,
    imageAlt = "App Logo",
    title = "Sawala",
    subtitle = "Learnhub",
    containerClassName = "",
    imageContainerClassName = "",
    textContainerClassName = "",
}: BrandHeaderProps) {
    return (
        <div>
            <div className={`flex items-center ${containerClassName}`}>
                <div>
                    <Image
                        src={imageSrc || "/assets/logos/logo1.png"}
                        alt={imageAlt}
                        width={30}
                        height={30}
                        className={`${imageContainerClassName}`}
                    />
                </div>
                <div className={`ml-3 leading-tight ${textContainerClassName}`}>
                    <div className="font-bold text-black text-sm">{title}</div>
                    <div className="font-bold text-black text-sm">{subtitle}</div>
                </div>
            </div>
            <div className="flex items-center w-full">
                <div className="flex-grow border-t border-gray-300"></div>
                {/* <span className="mx-2 text-sm text-gray-500">Or Sign In with</span> */}
                <div className="flex-grow border-t border-gray-300 w-[0.5px]"></div>
            </div>
        </div>
    )
}


