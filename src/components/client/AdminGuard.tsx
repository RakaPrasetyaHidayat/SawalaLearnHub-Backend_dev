"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthState } from "@/utils/auth";

interface AdminGuardProps {
  children: ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const { isAuthenticated, user } = getAuthState();

      // Belum login → pindah ke login
      if (!isAuthenticated) {
        router.replace("/login");
        setAllowed(false);
        return;
      }

      // Bukan admin → arahkan ke halaman utama user
      if (user?.role !== "admin") {
        router.replace("/main-Page");
        setAllowed(false);
        return;
      }

      setAllowed(true);
    } catch {
      router.replace("/login");
      setAllowed(false);
    }
  }, [router]);

  // Hindari flicker: jangan render apapun saat pengecekan
  if (allowed !== true) return null;

  return <>{children}</>;
}
