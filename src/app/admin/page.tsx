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

export default function AdminPage() {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [openRequests, setOpenRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      // Demandes en attente
      const { data: pendingData, error: pendingError } = await supabase
        .from("service_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (pendingError) throw pendingError;
      setPendingRequests(pendingData || []);

      // Demandes ouvertes
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

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === "admin123") {
      setAuthenticated(true);
      loadAll();
    } else {
      toast.error("Mot de passe incorrect");
    }
  };

  // Approuver
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

  // Rejeter
  const reject = async (id: string) => {
    await supabase.from("contact_logs").delete().eq("request_id", id);
    const { error } = await supabase.from("service_requests").delete().eq("id", id);
    if (error) toast.error("Erreur rejet");
    else {
      toast.success("Demande rejetée");
      loadAll();
    }
  };

  // Supprimer une demande déjà approuvée
  const deleteOpen = async (id: string) => {
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
            {/* Demandes en attente */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">📥 Demandes en attente</h2>
              {pendingRequests.length === 0 ? (
                <Card className="py-8 text-center text-gray-500">Aucune demande en attente</Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingRequests.map((req) => (
                    <Card key={req.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{req.title}</CardTitle>
                        <CardDescription>
                          {req.category} • {req.city} • {req.client_name} ({req.client_phone})
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {req.description && <p className="text-sm">{req.description}</p>}
                        <div className="flex gap-2">
                          <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => approve(req.id)}>
                            ✅ Approuver
                          </Button>
                          <Button variant="outline" className="flex-1 text-red-600" onClick={() => reject(req.id)}>
                            ❌ Rejeter
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Demandes approuvées */}
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
                      <CardContent>
                        {req.description && <p className="text-sm mb-2">{req.description}</p>}
                        <Button
                          variant="outline"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => deleteOpen(req.id)}
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