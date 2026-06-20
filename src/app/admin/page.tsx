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
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const loadPending = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
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
      loadPending();
    } else {
      toast.error("Mot de passe incorrect");
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
      loadPending();
    }
  };

  const reject = async (id: string) => {
    await supabase.from("contact_logs").delete().eq("request_id", id);
    const { error } = await supabase.from("service_requests").delete().eq("id", id);
    if (error) toast.error("Erreur rejet");
    else {
      toast.success("Demande rejetée");
      loadPending();
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
        <h1 className="text-3xl font-bold mb-6">🛡️ Modération des demandes</h1>
        {loading ? (
          <p className="text-center text-gray-500">Chargement...</p>
        ) : requests.length === 0 ? (
          <Card className="py-12 text-center text-gray-500">Aucune demande en attente</Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <Card key={req.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start gap-2">
                    <span>{req.title}</span>
                    {req.is_urgent && <Badge variant="destructive">URGENT</Badge>}
                  </CardTitle>
                  <CardDescription>
                    {req.category} • {req.city} {req.neighborhood && `, ${req.neighborhood}`} • {req.client_name} ({req.client_phone})
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {req.description && <p className="text-sm">{req.description}</p>}
                  {req.photos && req.photos.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {req.photos.map((url, idx) => (
                        <img key={idx} src={url} alt={`Photo ${idx}`} className="w-16 h-16 object-cover rounded border" />
                      ))}
                    </div>
                  )}
                  {req.budget_max && <p className="text-sm font-medium text-green-600">Budget: {req.budget_max} MAD</p>}
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => approve(req.id)}>
                      ✅ Approuver
                    </Button>
                    <Button variant="outline" className="flex-1 text-red-600 border-red-300 hover:bg-red-50" onClick={() => reject(req.id)}>
                      ❌ Rejeter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}