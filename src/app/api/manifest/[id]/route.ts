import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data: client } = await supabase
    .from("clients")
    .select("nom")
    .eq("id", id)
    .single();

  if (!client) {
    return new Response("Client introuvable", { status: 404 });
  }

  const manifest = {
    name: client.nom,
    short_name: client.nom.split(" ")[0],
    description: `Carte de visite digitale de ${client.nom}`,
    start_url: `/c/${id}`,
    display: "standalone",
    background_color: "#000000",
    theme_color: "#1b4282",
    icons: [
      {
        src: "/icons/home1.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/home.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  return Response.json(manifest);
}