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
  const { data: client } = await supabase.from("clients").select("*").eq("id", id).single();

  if (!client) {
    return new Response("Client introuvable", { status: 404 });
  }

  const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${client.nom}
TEL;TYPE=CELL:${client.telephone}
EMAIL:${client.email || ""}
ADR:;;${client.adresse || ""};;;;
END:VCARD`;

  return new Response(vCard, {
    headers: {
      "Content-Type": "text/vcard",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(client.nom)}.vcf"`,
    },
  });
}
