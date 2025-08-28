"use client"
import DivisionCard from "@/components/molecules/cards/division-card/division"
import { useRouter } from "next/navigation"

export function InternOfYears() {
    const router = useRouter()

  const handleCardClick = (title: string) => {
    router.push(`/main-Page/about/division-of?title=${encodeURIComponent(title)}`)
  }

  return (
    <>
      <DivisionCard
        logo="/assets/logos/logo1.png"
        logoAlt="Logo"
        title="All Division"
        members="4 Member"
        logoSize={48}
        chevronSize={22}
        onClick={() => handleCardClick("All Division")}
      />
      <DivisionCard
        logo="/assets/logos/logo-purple.png"
        logoAlt="Logo"
        title="UI/UX Designer"
        members="2 Member"
        logoSize={48}
        chevronSize={22}
        onClick={() => handleCardClick("UI/UX Designer")}
      />
      <DivisionCard
        logo="/assets/logos/logo-green.png"
        logoAlt="Logo"
        title="Frontend Dev"
        members="1 Member"
        logoSize={48}
        chevronSize={22}
        onClick={() => handleCardClick("Frontend Dev")}
      /> 
      <DivisionCard
        logo="/assets/logos/logo-yellow.png"
        logoAlt="Logo"
        title="Backend Dev"
        members="1 Member"
        logoSize={48}
        chevronSize={22}
        onClick={() => handleCardClick("Backend Dev")}
      />
      <DivisionCard
        logo="/assets/logos/logo-black.png"
        logoAlt="Logo"
        title="DevOps"
        members="0 Member"
        logoSize={48}
        chevronSize={22}
        onClick={() => handleCardClick("DevOps")}
      />
    </>
  )
}
