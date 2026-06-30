import { createClient } from "@supabase/supabase-js";
import CarteVisite from "@/components/CarteVisite";
import type { Metadata } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getClient(id: string) {
  const { data } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    manifest: `/api/manifest/${id}`,
    robots: "noindex, nofollow",
    themeColor: "#000000",
  };
}

export default async function CartePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);

  // Carte inexistante
  if (!client) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Carte introuvable
      </div>
    );
  }

  // Brouillon -> introuvable
  if (client.draft) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Carte introuvable
      </div>
    );
  }

  // Date d'expiration dépassée -> expirée
  if (client.expiry_date) {
    const now = new Date();
    const expiry = new Date(client.expiry_date);
    if (now > expiry) {
      return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
          Carte expirée
        </div>
      );
    }
  }

  return <CarteVisite client={client} />;
}