"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCarte = pathname.startsWith("/c/");

  useEffect(() => {
    if (isCarte) {
      // Retire le manifest global de KhedmaPro sur les cartes
      const link = document.querySelector('link[rel="manifest"][href="/manifest.json"]');
      if (link) link.remove();
    }
  }, [isCarte]);

  if (isCarte) {
    return <div className="min-h-screen bg-black">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 animate-fade-in">{children}</main>
      <Footer />
    </>
  );
}