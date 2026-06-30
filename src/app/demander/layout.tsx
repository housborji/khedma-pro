import type { Metadata } from "next";

export const metadata: Metadata = {
  manifest: "/manifest.json",
};

export default function DemanderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}