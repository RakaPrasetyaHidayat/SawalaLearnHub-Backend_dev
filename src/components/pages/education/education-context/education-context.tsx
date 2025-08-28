"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Education {
  id: number;
  field: string;
  value: string;
}

interface EducationContextType {
  education: Education[];
  updateEducation: (newEducation: Education[]) => void;
  updateField: (id: number, value: string) => void;
}

const defaultEducation: Education[] = [
  {
    id: 1,
    field: "School",
    value: "SMKN 1 Majalengka",
  },
  {
    id: 2,
    field: "Major",
    value: "RPL",
  },
  {
    id: 3,
    field: "Year",
    value: "2025-2026",
  },
];

const EducationContext = createContext<EducationContextType | undefined>(undefined);

export function EducationProvider({ children }: { children: ReactNode }) {
  const [education, setEducation] = useState<Education[]>(defaultEducation);

  const updateEducation = (newEducation: Education[]) => {
    setEducation(newEducation);
  };

  const updateField = (id: number, value: string) => {
    setEducation(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, value }
          : item
      )
    );
  };

  return (
    <EducationContext.Provider value={{ education, updateEducation, updateField }}>
      {children}
    </EducationContext.Provider>
  );
}

export function useEducation() {
  const context = useContext(EducationContext);
  if (context === undefined) {
    throw new Error("useEducation must be used within an EducationProvider");
  }
  return context;
}
