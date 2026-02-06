"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import type { ReactNode } from "react";

export function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isKitchenDashboard = pathname === "/kitchen-dashboard";

  // Kitchen dashboard renders its own header/footer so it can hide them in fullscreen
  if (isKitchenDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
