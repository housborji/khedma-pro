import { createClient } from "@supabase/supabase-js";
import CarteVisite from "@/components/CarteVisite";
import type { Metadata } from "next";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getClient(id: string) {
  const { data } = await supabase.from("clients").select("*").eq("id", id).single();
  return data;
}

// 🆕 Génère un manifest personnalisé pour ce client
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    manifest: `/api/manifest/${id}`,
  };
}

export default async function CartePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);
  if (!client) return <div className="min-h-screen flex items-center justify-center">Carte introuvable</div>;
  return <CarteVisite client={client} />;
}