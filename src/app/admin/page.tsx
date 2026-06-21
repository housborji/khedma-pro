"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast, Toaster } from "sonner";

interface Request {
  id: string;
  client_name: string;
  client_phone: string;
  title: string;
  description: string | null;
  category: string;
  city: string;
  neighborhood: string | null;
  budget_max: number | null;
  is_urgent: boolean;
  photos: string[] | null;
  status: string;
  created_at: string;
}

// Fonction pour supprimer les fichiers du bucket photos
async function deletePhotosFromStorage(photos: string[] | null) {
  if (!photos || photos.length === 0) return;

  const filesToDelete = photos
    .map((url) => {
      const parts = url.split("/public/photos/");
      return parts.length > 1 ? parts[1] : null;
    })
    .filter(Boolean) as string[];

  if (filesToDelete.length > 0) {
    const { error } = await supabase.storage.from("photos").remove(filesToDelete);
    if (error) {
      console.error("Erreur suppression fichiers:", error);
    }
  }
}

// Fonction pour hasher en SHA-256 (API native du navigateur)
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function AdminPage() {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [openRequests, setOpenRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const { data: pendingData, error: pendingError } = await supabase
        .from("service_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (pendingError) throw pendingError;
      setPendingRequests(pendingData || []);

      const { data: openData, error: openError } = await supabase
        .from("service_requests")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(50);

      if (openError) throw openError;
      setOpenRequests(openData || []);
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur chargement");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const storedHash = process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH;
    console.log("Hash stocké :", storedHash);
    console.log("Mot de passe tapé :", password);

    if (!storedHash) {
      toast.error("Hash admin introuvable (variable mal chargée)");
      return;
    }

    try {
      const enteredHash = await sha256(password);
      const isCorrect = storedHash === `sha256:${enteredHash}`;
      console.log("Hash entré :", enteredHash);
      console.log("Résultat comparaison :", isCorrect);

      if (isCorrect) {
        setAuthenticated(true);
        loadAll();
      } else {
        toast.error("Mot de passe incorrect");
      }
    } catch (err) {
      console.error("Erreur :", err);
      toast.error("Erreur technique, voir console");
    }
  };

  const approve = async (id: string) => {
    const { error } = await supabase
      .from("service_requests")
      .update({ status: "open" })
      .eq("id", id);
    if (error) toast.error("Erreur approbation");
    else {
      toast.success("Demande approuvée");
      loadAll();
    }
  };

  const reject = async (id: string, photos: string[] | null) => {
    await deletePhotosFromStorage(photos);
    await supabase.from("contact_logs").delete().eq("request_id", id);
    const { error } = await supabase.from("service_requests").delete().eq("id", id);
    if (error) toast.error("Erreur rejet");
    else {
      toast.success("Demande rejetée");
      loadAll();
    }
  };

  const deleteOpen = async (id: string, photos: string[] | null) => {
    await deletePhotosFromStorage(photos);
    await supabase.from("contact_logs").delete().eq("request_id", id);
    const { error } = await supabase.from("service_requests").delete().eq("id", id);
    if (error) toast.error("Erreur suppression");
    else {
      toast.success("Demande supprimée");
      loadAll();
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold text-center">🔐 Admin</h1>
          <Input
            type="password"
            placeholder="Mot de passe admin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full bg-red-600 hover:bg-red-700" onClick={handleLogin}>
            Connexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🛡️ Panneau d&apos;administration</h1>

        {loading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : (
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">📥 Demandes en attente</h2>
              {pendingRequests.length === 0 ? (
                <Card className="py-8 text-center text-gray-500">Aucune demande en attente</Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingRequests.map((req) => (
                    <Card key={req.id}>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {req.title}
                          {req.is_urgent && <Badge variant="destructive">URGENT</Badge>}
                        </CardTitle>
                        <CardDescription>
                          {req.category} • {req.city} {req.neighborhood && `, ${req.neighborhood}`}
                          <br />
                          {req.client_name} ({req.client_phone})
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {req.description && <p className="text-sm">{req.description}</p>}
                        {req.photos && req.photos.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {req.photos.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`Photo ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded border cursor-pointer hover:scale-105 transition"
                                onClick={() => window.open(url, "_blank")}
                              />
                            ))}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => approve(req.id)}>
                            ✅ Approuver
                          </Button>
                          <Button variant="outline" className="flex-1 text-red-600" onClick={() => reject(req.id, req.photos)}>
                            ❌ Rejeter
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">✅ Demandes approuvées</h2>
              {openRequests.length === 0 ? (
                <Card className="py-8 text-center text-gray-500">Aucune demande approuvée</Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {openRequests.map((req) => (
                    <Card key={req.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{req.title}</CardTitle>
                        <CardDescription>
                          {req.category} • {req.city} • {req.client_name} ({req.client_phone})
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {req.description && <p className="text-sm">{req.description}</p>}
                        {req.photos && req.photos.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {req.photos.map((url, idx) => (
                              <img
                                key={idx}
                                src={url}
                                alt={`Photo ${idx + 1}`}
                                className="w-16 h-16 object-cover rounded border cursor-pointer hover:scale-105 transition"
                                onClick={() => window.open(url, "_blank")}
                              />
                            ))}
                          </div>
                        )}
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => deleteOpen(req.id, req.photos)}
                        >
                          🗑️ Supprimer
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}