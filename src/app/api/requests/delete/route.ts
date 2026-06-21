import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import crypto from "crypto";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function sha256(message: string): string {
  return crypto.createHash("sha256").update(message).digest("hex");
}

export async function POST(request: Request) {
  try {
    const { requestId, password } = await request.json();

    const storedHash = process.env.ADMIN_PASSWORD_HASH;
    if (!storedHash) {
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }
    const enteredHash = sha256(password);
    if (`sha256:${enteredHash}` !== storedHash) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 403 });
    }

    // Supprimer d'abord les logs de contact liés
    const { error: logError } = await supabaseAdmin
      .from("contact_logs")
      .delete()
      .eq("request_id", requestId);

    if (logError) {
      console.error("Erreur suppression contact_logs:", logError);
      return NextResponse.json({ error: logError.message }, { status: 500 });
    }

    // Ensuite supprimer la demande
    const { error } = await supabaseAdmin
      .from("service_requests")
      .delete()
      .eq("id", requestId);

    if (error) {
      console.error("Erreur suppression service_requests:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}