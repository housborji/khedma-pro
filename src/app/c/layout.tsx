"use client";

import { useParams } from "next/navigation";

export default function CarteLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const id = params?.id;

  return (
    <html lang="fr">
      <head>
        {id && <link rel="manifest" href={`/api/manifest/${id}`} />}
        <meta name="theme-color" content="#1b4282" />
      </head>
      <body className="bg-black">{children}</body>
    </html>
  );
}

export const metadata = {
  robots: "noindex, nofollow",
};