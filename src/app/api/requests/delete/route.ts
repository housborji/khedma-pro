import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { requestId, password } = await request.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 403 });
    }

    // Supprimer d'abord les logs de contact liés à cette demande
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