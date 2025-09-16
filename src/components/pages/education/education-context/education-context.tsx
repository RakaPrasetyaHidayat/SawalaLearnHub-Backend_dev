"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getCurrentUser } from "@/services/authService";
import { getAuthState } from "@/utils/auth";

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
    value: "-",
  },
  {
    id: 2,
    field: "Major",
    value: "RPL",
  },
  {
    id: 3,
    field: "Year",
    value: "-",
  },
];

const EducationContext = createContext<EducationContextType | undefined>(
  undefined
);

export function EducationProvider({ children }: { children: ReactNode }) {
  const [education, setEducation] = useState<Education[]>(defaultEducation);

  // Load education with preference to locally edited values, then merge with backend
  useEffect(() => {
    const load = async () => {
      try {
        // 1) Start from defaults
        let schoolName = "-";
        let major = "RPL";
        let yearValue = "-";

        // 2) Local edits (if any) from auth state/localStorage
        try {
          const auth = getAuthState();
          const localUser = (auth?.user as any) || null;
          if (localUser) {
            schoolName =
              localUser.school_name || localUser.school || schoolName;
            // If you store major/year locally in future, they can be read here too
          }
        } catch {}

        // 3) Merge with backend data (if available)
        try {
          const data = await getCurrentUser();
          if (data) {
            schoolName =
              data?.school_name ||
              data?.school ||
              data?.institution ||
              schoolName;
            const angkatan = data?.angkatan as number | undefined;
            yearValue =
              typeof angkatan === "number" && !isNaN(angkatan)
                ? `${angkatan}-${angkatan + 1}`
                : yearValue;
          }
        } catch (e) {
          // keep local/defaults if backend not reachable
          console.warn(
            "Using local/default education values due to fetch error",
            e
          );
        }

        setEducation((prev) =>
          prev.map((item) => {
            if (item.field === "School") return { ...item, value: schoolName };
            if (item.field === "Major") return { ...item, value: major };
            if (item.field === "Year") return { ...item, value: yearValue };
            return item;
          })
        );
      } catch (e) {
        console.error("Failed to load education", e);
      }
    };
    load();
  }, []);

  const updateEducation = (newEducation: Education[]) => {
    setEducation(newEducation);
  };

  const updateField = (id: number, value: string) => {
    setEducation((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  return (
    <EducationContext.Provider
      value={{ education, updateEducation, updateField }}
    >
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
