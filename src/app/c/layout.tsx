export default function CarteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-black">{children}</body>
    </html>
  );
}

export const metadata = {
  robots: "noindex, nofollow",
};