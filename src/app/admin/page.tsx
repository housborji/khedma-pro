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
import crypto from "crypto";

// Types
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

interface Ad {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  alt_text: string;
  is_active: boolean;
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

export default function AdminPage() {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [openRequests, setOpenRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // État pour la gestion des pubs
  const [ads, setAds] = useState<Ad[]>([]);
  const [newAd, setNewAd] = useState({ title: "", image_url: "", link_url: "", alt_text: "Publicité" });

  const loadAll = async () => {
    setLoading(true);
    try {
      const { data: pendingData } = await supabase
        .from("service_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      setPendingRequests(pendingData || []);

      const { data: openData } = await supabase
        .from("service_requests")
        .select("*")
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(50);
      setOpenRequests(openData || []);

      // Charger les pubs
      const { data: adsData } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });
      setAds(adsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const storedHash = process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH;
    if (!storedHash) {
      toast.error("Erreur de configuration");
      return;
    }
    const enteredHash = crypto.createHash("sha256").update(password).digest("hex");
    if (`sha256:${enteredHash}` === storedHash) {
      setAuthenticated(true);
      loadAll();
    } else {
      toast.error("Mot de passe incorrect");
    }
  };

  const approve = async (id: string) => {
    const { error } = await supabase.from("service_requests").update({ status: "open" }).eq("id", id);
    if (error) toast.error("Erreur");
    else { toast.success("Approuvée"); loadAll(); }
  };

  const reject = async (id: string, photos: string[] | null) => {
    await deletePhotosFromStorage(photos);
    await supabase.from("contact_logs").delete().eq("request_id", id);
    await supabase.from("service_requests").delete().eq("id", id);
    toast.success("Rejetée");
    loadAll();
  };

  const deleteOpen = async (id: string, photos: string[] | null) => {
    await deletePhotosFromStorage(photos);
    await supabase.from("contact_logs").delete().eq("request_id", id);
    await supabase.from("service_requests").delete().eq("id", id);
    toast.success("Supprimée");
    loadAll();
  };

  // Gestion des pubs
  const addAd = async () => {
    if (!newAd.title || !newAd.image_url || !newAd.link_url) {
      toast.error("Tous les champs sont requis");
      return;
    }
    const { error } = await supabase.from("ads").insert(newAd);
    if (error) toast.error("Erreur ajout pub");
    else {
      toast.success("Pub ajoutée");
      setNewAd({ title: "", image_url: "", link_url: "", alt_text: "Publicité" });
      loadAll();
    }
  };

  const toggleAd = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("ads").update({ is_active: !currentStatus }).eq("id", id);
    if (error) toast.error("Erreur");
    else { toast.success(currentStatus ? "Pub désactivée" : "Pub activée"); loadAll(); }
  };

  const deleteAd = async (id: string) => {
    const { error } = await supabase.from("ads").delete().eq("id", id);
    if (error) toast.error("Erreur suppression");
    else { toast.success("Pub supprimée"); loadAll(); }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>🔐 Admin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button className="w-full bg-red-600" onClick={handleLogin}>Connexion</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster position="top-center" richColors />
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold">🛡️ Administration</h1>

        {/* Demandes en attente */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📥 Demandes en attente</h2>
          {pendingRequests.length === 0 ? <p>Aucune</p> : (
            <div className="grid md:grid-cols-2 gap-4">
              {pendingRequests.map((req) => (
                <Card key={req.id}>
                  <CardHeader>
                    <CardTitle>{req.title}</CardTitle>
                    <CardDescription>{req.category} • {req.city} • {req.client_name} ({req.client_phone})</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {/* Affichage des photos */}
                    {req.photos && req.photos.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {req.photos.map((url, idx) => (
                          <img key={idx} src={url} alt={`Photo ${idx + 1}`} className="w-16 h-16 object-cover rounded" />
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-green-600" onClick={() => approve(req.id)}>✅ Approuver</Button>
                      <Button variant="outline" className="flex-1" onClick={() => reject(req.id, req.photos)}>❌ Rejeter</Button>
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
          {openRequests.length === 0 ? <p>Aucune</p> : (
            <div className="grid md:grid-cols-2 gap-4">
              {openRequests.map((req) => (
                <Card key={req.id}>
                  <CardHeader>
                    <CardTitle>{req.title}</CardTitle>
                    <CardDescription>{req.category} • {req.city} • {req.client_name} ({req.client_phone})</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {/* Affichage des photos */}
                    {req.photos && req.photos.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {req.photos.map((url, idx) => (
                          <img key={idx} src={url} alt={`Photo ${idx + 1}`} className="w-16 h-16 object-cover rounded" />
                        ))}
                      </div>
                    )}
                    <Button variant="outline" className="w-full" onClick={() => deleteOpen(req.id, req.photos)}>🗑️ Supprimer</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Gestion des publicités */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📢 Gestion des publicités</h2>
          <Card className="mb-6">
            <CardHeader><CardTitle>Ajouter une publicité</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              <Input placeholder="Nom de l'annonceur" value={newAd.title} onChange={(e) => setNewAd({ ...newAd, title: e.target.value })} />
              <Input placeholder="URL de l'image" value={newAd.image_url} onChange={(e) => setNewAd({ ...newAd, image_url: e.target.value })} />
              <Input placeholder="Lien du site" value={newAd.link_url} onChange={(e) => setNewAd({ ...newAd, link_url: e.target.value })} />
              <Button onClick={addAd}>Ajouter la publicité</Button>
            </CardContent>
          </Card>
          <div className="grid md:grid-cols-2 gap-4">
            {ads.map((ad) => (
              <Card key={ad.id} className={!ad.is_active ? "opacity-50" : ""}>
                <CardHeader>
                  <CardTitle className="flex justify-between">
                    {ad.title}
                    <Badge variant={ad.is_active ? "default" : "secondary"}>
                      {ad.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="truncate">{ad.link_url}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => toggleAd(ad.id, ad.is_active)}>
                    {ad.is_active ? "Désactiver" : "Activer"}
                  </Button>
                  <Button variant="outline" className="flex-1 text-red-600" onClick={() => deleteAd(ad.id)}>
                    Supprimer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}