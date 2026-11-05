"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function SiteShellContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideSharedLayout =
    pathname === "/dashboard" || pathname === "/studios";

  if (hideSharedLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

export default function SiteShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<>{children}</>}>
      <SiteShellContent>{children}</SiteShellContent>
    </Suspense>
  );
}