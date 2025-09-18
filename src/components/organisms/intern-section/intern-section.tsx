"use client";
import EntityCard from "@/components/molecules/cards/division-(years)/division-card";
import { useRouter } from "next/navigation";

export function Intern() {
  const router = useRouter();

  const handleCardClick = (year: string) => {
    const isAdminPath =
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/admin");
    const base = isAdminPath ? "/admin" : "/main-Page";
    router.push(`${base}/about?year=${year}`);
  };

  return (
    <>
      <EntityCard
        logo="/assets/logos/logo1.png"
        logoAlt="Logo"
        title="Sawala Learnhub"
        years="2025"
        logoSize={48}
        chevronSize={22}
        onClick={() => handleCardClick("2025")}
      />
      <EntityCard
        logo="/assets/logos/logo-purple.png"
        logoAlt="Logo"
        title="Sawala Learnhub"
        years="2024"
        logoSize={48}
        chevronSize={22}
        onClick={() => handleCardClick("2024")}
      />
      <EntityCard
        logo="/assets/logos/logo-green.png"
        logoAlt="Logo"
        title="Sawala Learnhub"
        years="2023"
        logoSize={48}
        chevronSize={22}
        onClick={() => handleCardClick("2023")}
      />
      <EntityCard
        logo="/assets/logos/logo-yellow.png"
        logoAlt="Logo"
        title="Sawala Learnhub"
        years="2022"
        logoSize={48}
        chevronSize={22}
        onClick={() => handleCardClick("2022")}
      />
      <EntityCard
        logo="/assets/logos/logo-black.png"
        logoAlt="Logo"
        title="Sawala Learnhub"
        years="2021"
        logoSize={48}
        chevronSize={22}
        onClick={() => handleCardClick("2021")}
      />
    </>
  );
}
