import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomBytes } from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const body = await request.json();

  // 1. Générer un identifiant secret
  const id = randomBytes(4).toString("hex");

  // 2. Sauvegarder le client dans Supabase
  const { error } = await supabase.from("clients").insert({
    id,
    nom: body.nom,
    metier: body.metier || null,
    photo: body.photo || null,
    telephone: body.telephone,
    email: body.email || null,
    site: body.site || null,
    instagram: body.instagram || null,
    facebook: body.facebook || null,
    whatsapp: body.whatsapp || null,
    bio: body.bio || null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 3. Renvoyer l'URL du QR code
  const qrUrl = `/api/qr/${id}`;
  return NextResponse.json({ success: true, id, qrUrl });
}