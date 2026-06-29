"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCarte = pathname.startsWith("/c/");

  if (isCarte) {
    // Aucun header, aucun footer pour les cartes privées
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 animate-fade-in">{children}</main>
      <Footer />
    </>
  );
}