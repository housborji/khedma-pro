import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "KhedmaPro - Trouvez un artisan qualifié près de chez vous au Maroc",
  description:
    "KhedmaPro connecte directement les particuliers et les artisans au Maroc. Publiez votre demande gratuitement et recevez des devis directement sur WhatsApp, sans inscription.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${arabic.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/home1.png" sizes="192x192" type="image/png" />
        <meta name="theme-color" content="#dc2626" />
        <meta property="og:title" content="KhedmaPro - Trouvez un artisan qualifié près de chez vous au Maroc" />
        <meta property="og:description" content="KhedmaPro connecte directement les particuliers et les artisans. Publiez votre demande gratuitement et recevez des devis sur WhatsApp, sans inscription." />
        <meta property="og:image" content="https://www.khedmapro.com/icons/home.png" />
        <meta property="og:url" content="https://www.khedmapro.com" />
        <meta property="og:type" content="website" />
        <meta name="google-site-verification" content="1RbsxssRWP16l9Y764wB-fboBGOEgD0AXkmHKr8qySA" />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 animate-fade-in">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}