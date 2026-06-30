import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
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
  title: "KhedmaPro - Trouvez un Snay3i, M3alem, Artisan ou Professionnel au Maroc",
  description:
    "Publiez votre demande et trouvez rapidement un snay3i, m3alem, khaddam, artisan ou technicien qualifié pour vos services à domicile, dépannage et réparations partout au Maroc (صنايعي، معلم، خدمات).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${arabic.variable}`}>
      <head>
        {/* Manifest global retiré pour éviter le conflit avec les cartes */}
        <link rel="icon" href="/icons/home1.png" sizes="192x192" type="image/png" />
        <meta name="theme-color" content="#dc2626" />
        <meta property="og:title" content="KhedmaPro - Trouvez un Snay3i, M3alem, Artisan ou Professionnel au Maroc" />
        <meta property="og:description" content="Publiez votre demande et trouvez rapidement un snay3i, m3alem, khaddam, artisan ou technicien qualifié pour vos services à domicile, dépannage et réparations partout au Maroc." />
        <meta property="og:image" content="https://www.khedmapro.com/icons/home.png" />
        <meta property="og:url" content="https://www.khedmapro.com" />
        <meta property="og:type" content="website" />
        <meta name="google-site-verification" content="1RbsxssRWP16l9Y764wB-fboBGOEgD0AXkmHKr8qySA" />
      </head>
      <body className="min-h-screen flex flex-col bg-white">
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
        <Analytics />
      </body>
    </html>
  );
}