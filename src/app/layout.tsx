import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
});

// Métadonnées principales pour le SEO
export const metadata: Metadata = {
  // Titre optimisé pour le SEO
  title: "Khedma - Trouvez un artisan qualifié près de chez vous au Maroc",
  description:
    "Khedma connecte directement les particuliers et les artisans au Maroc. Publiez votre demande gratuitement et recevez des devis directement sur WhatsApp, sans inscription.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${arabic.variable}`}>
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        {/* Favicon (icône de l'onglet) */}
        <link rel="icon" href="/icons/home1.png" sizes="192x192" type="image/png" />
        {/* Couleur du thème pour la barre de statut */}
        <meta name="theme-color" content="#dc2626" />

        {/* Balises Open Graph pour le partage sur les réseaux sociaux */}
        <meta property="og:title" content="Khedma - Trouvez un artisan qualifié près de chez vous au Maroc" />
        <meta property="og:description" content="Khedma connecte directement les particuliers et les artisans. Publiez votre demande gratuitement et recevez des devis sur WhatsApp, sans inscription." />
        <meta property="og:image" content="https://khedma-pro.vercel.app/icons/home.png" />
        <meta property="og:url" content="https://khedma-pro.vercel.app" />
        <meta property="og:type" content="website" />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}