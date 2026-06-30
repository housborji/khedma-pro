"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCarte = pathname.startsWith("/c/");

  // Pour les pages de carte de visite : fond noir, pas de header/footer
  if (isCarte) {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  // Pour le reste du site : header + contenu + footer
  return (
    <>
      <Navbar />
      <main className="flex-1 animate-fade-in">{children}</main>
      <Footer />
    </>
  );
}