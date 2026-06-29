"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import ImageUpload from "@/components/ImageUpload";

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

interface Client {
  id: string;
  nom: string;
  metier: string;
  photo: string;
  telephone: string;
  email: string;
  site: string;
  instagram: string;
  facebook: string;
  whatsapp: string;
  bio: string;
  created_at: string;
}

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
    if (error) console.error("Erreur suppression fichiers:", error);
  }
}

async function deleteClientPhoto(photoUrl: string | null) {
  if (!photoUrl) return;
  const parts = photoUrl.split("/public/photos/");
  if (parts.length > 1) {
    const filePath = parts[1];
    const { error } = await supabase.storage.from("photos").remove([filePath]);
    if (error) console.error("Erreur suppression photo client:", error);
  }
}

const RATE_LIMIT_KEY = "admin_login_attempts";
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000;

function getRateLimitData(): { attempts: number; blockedUntil: number } {
  if (typeof window === "undefined") return { attempts: 0, blockedUntil: 0 };
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { attempts: 0, blockedUntil: 0 };
}

function updateRateLimitData(data: { attempts: number; blockedUntil: number }) {
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
}

export default function AdminPage() {
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [openRequests, setOpenRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [ads, setAds] = useState<Ad[]>([]);
  const [newAd, setNewAd] = useState({ title: "", image_url: "", link_url: "", alt_text: "Publicité" });

  const [clients, setClients] = useState<Client[]>([]);
  const [newClient, setNewClient] = useState({
    nom: "", metier: "", photo: "", telephone: "", email: "",
    site: "", instagram: "", facebook: "", whatsapp: "", bio: ""
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const [tab, setTab] = useState<"demandes" | "pubs" | "cartes">("demandes");

  const loadAll = async () => {
    setLoading(true);
    try {
      const { data: pendingData } = await supabase.from("service_requests").select("*").eq("status", "pending").order("created_at", { ascending: false });
      setPendingRequests(pendingData || []);
      const { data: openData } = await supabase.from("service_requests").select("*").eq("status", "open").order("created_at", { ascending: false }).limit(50);
      setOpenRequests(openData || []);
      const { data: adsData } = await supabase.from("ads").select("*").order("created_at", { ascending: false });
      setAds(adsData || []);
      const { data: clientsData } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
      setClients(clientsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    const { attempts, blockedUntil } = getRateLimitData();
    const now = Date.now();
    if (blockedUntil > 0 && now < blockedUntil) {
      const minutesLeft = Math.ceil((blockedUntil - now) / 60000);
      toast.error(`Trop de tentatives. Réessayez dans ${minutesLeft} minute(s).`);
      return;
    }
    const storedHash = process.env.NEXT_PUBLIC_ADMIN_PASSWORD_HASH;
    if (!storedHash) { toast.error("Erreur de configuration"); return; }
    const enteredHash = crypto.createHash("sha256").update(password).digest("hex");
    if (`sha256:${enteredHash}` === storedHash) {
      updateRateLimitData({ attempts: 0, blockedUntil: 0 });
      setAuthenticated(true);
      loadAll();
    } else {
      const newAttempts = attempts + 1;
      const newBlockedUntil = newAttempts >= MAX_ATTEMPTS ? now + BLOCK_DURATION_MS : 0;
      updateRateLimitData({ attempts: newAttempts, blockedUntil: newBlockedUntil });
      const remaining = MAX_ATTEMPTS - newAttempts;
      toast.error(remaining > 0 ? `Mot de passe incorrect. Il vous reste ${remaining} tentative(s).` : "Compte bloqué pour 15 minutes.");
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

  const addOrUpdateClient = async () => {
    if (!newClient.nom || !newClient.telephone) {
      toast.error("Nom et téléphone obligatoires");
      return;
    }
    if (editingId) {
      const { error } = await supabase.from("clients").update(newClient).eq("id", editingId);
      if (error) toast.error("Erreur mise à jour");
      else {
        toast.success("Client mis à jour");
        setEditingId(null);
        setNewClient({ nom: "", metier: "", photo: "", telephone: "", email: "", site: "", instagram: "", facebook: "", whatsapp: "", bio: "" });
        loadAll();
      }
    } else {
      const array = new Uint8Array(4);
      window.crypto.getRandomValues(array);
      const id = Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");

      const { error } = await supabase.from("clients").insert({ id, ...newClient });
      if (error) toast.error("Erreur création");
      else {
        toast.success("Client créé");
        const qrUrl = `/api/qr/${id}`;
        toast.custom(
          (t) => (
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <img src={qrUrl} alt="QR Code" className="w-32 h-32 mx-auto" />
              <p className="text-center text-sm mt-2">
                <a href={qrUrl} download className="text-blue-600 hover:underline">Télécharger</a>
              </p>
            </div>
          ),
          { duration: Infinity }
        );
        setNewClient({ nom: "", metier: "", photo: "", telephone: "", email: "", site: "", instagram: "", facebook: "", whatsapp: "", bio: "" });
        loadAll();
      }
    }
  };

  const deleteClient = async (id: string) => {
    if (!confirm("Supprimer ce client ?")) return;
    const { data: clientData } = await supabase.from("clients").select("photo").eq("id", id).single();
    if (clientData?.photo) {
      await deleteClientPhoto(clientData.photo);
    }
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) toast.error("Erreur suppression");
    else {
      toast.success("Client supprimé");
      loadAll();
    }
  };

  const editClient = (client: Client) => {
    setEditingId(client.id);
    setNewClient({
      nom: client.nom, metier: client.metier || "", photo: client.photo || "",
      telephone: client.telephone, email: client.email || "", site: client.site || "",
      instagram: client.instagram || "", facebook: client.facebook || "",
      whatsapp: client.whatsapp || "", bio: client.bio || ""
    });
  };

  useEffect(() => {
    if (authenticated) loadAll();
  }, [authenticated]);

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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🛡️ Administration</h1>

        <div className="flex gap-2 mb-8">
          <Button variant={tab === "demandes" ? "default" : "outline"} onClick={() => setTab("demandes")} className="text-sm">📋 Demandes</Button>
          <Button variant={tab === "pubs" ? "default" : "outline"} onClick={() => setTab("pubs")} className="text-sm">📢 Publicités</Button>
          <Button variant={tab === "cartes" ? "default" : "outline"} onClick={() => setTab("cartes")} className="text-sm">📇 Cartes de visite</Button>
        </div>

        {tab === "demandes" && (
          <div className="space-y-10">
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
                        {req.photos && req.photos.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {req.photos.map((url, idx) => (<img key={idx} src={url} alt={`Photo ${idx + 1}`} className="w-16 h-16 object-cover rounded" />))}
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
                        {req.photos && req.photos.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {req.photos.map((url, idx) => (<img key={idx} src={url} alt={`Photo ${idx + 1}`} className="w-16 h-16 object-cover rounded" />))}
                          </div>
                        )}
                        <Button variant="outline" className="w-full" onClick={() => deleteOpen(req.id, req.photos)}>🗑️ Supprimer</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {tab === "pubs" && (
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
                      <Badge variant={ad.is_active ? "default" : "secondary"}>{ad.is_active ? "Active" : "Inactive"}</Badge>
                    </CardTitle>
                    <CardDescription className="truncate">{ad.link_url}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => toggleAd(ad.id, ad.is_active)}>{ad.is_active ? "Désactiver" : "Activer"}</Button>
                    <Button variant="outline" className="flex-1 text-red-600" onClick={() => deleteAd(ad.id)}>Supprimer</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {tab === "cartes" && (
          <section>
            <h2 className="text-2xl font-bold mb-4">📇 Cartes de visite</h2>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingId ? "Modifier" : "Ajouter"} une carte</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Input placeholder="Nom *" value={newClient.nom} onChange={(e) => setNewClient({ ...newClient, nom: e.target.value })} />
                <Input placeholder="Métier" value={newClient.metier} onChange={(e) => setNewClient({ ...newClient, metier: e.target.value })} />
                <label className="text-sm font-medium">Photo</label>
                <ImageUpload onUpload={(url) => setNewClient({ ...newClient, photo: url })} currentUrl={newClient.photo} />
                <Input placeholder="Téléphone *" value={newClient.telephone} onChange={(e) => setNewClient({ ...newClient, telephone: e.target.value })} />
                <Input placeholder="Email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
                <Input placeholder="Site web" value={newClient.site} onChange={(e) => setNewClient({ ...newClient, site: e.target.value })} />
                <Input placeholder="Instagram (pseudo)" value={newClient.instagram} onChange={(e) => setNewClient({ ...newClient, instagram: e.target.value })} />
                <Input placeholder="Facebook (URL)" value={newClient.facebook} onChange={(e) => setNewClient({ ...newClient, facebook: e.target.value })} />
                <Input placeholder="WhatsApp" value={newClient.whatsapp} onChange={(e) => setNewClient({ ...newClient, whatsapp: e.target.value })} />
                <Textarea placeholder="Bio" value={newClient.bio} onChange={(e) => setNewClient({ ...newClient, bio: e.target.value })} />
                <div className="flex gap-2">
                  <Button onClick={addOrUpdateClient} className="flex-1">{editingId ? "Mettre à jour" : "Créer la carte"}</Button>
                  {editingId && (
                    <Button variant="outline" onClick={() => { setEditingId(null); setNewClient({ nom: "", metier: "", photo: "", telephone: "", email: "", site: "", instagram: "", facebook: "", whatsapp: "", bio: "" }); }}>Annuler</Button>
                  )}
                </div>
              </CardContent>
            </Card>
            <div className="grid md:grid-cols-2 gap-4">
              {clients.map((c) => (
                <Card key={c.id}>
                  <CardHeader>
                    <CardTitle>{c.nom}</CardTitle>
                    <CardDescription>{c.metier} • {c.telephone}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(`/api/qr/${c.id}`, "_blank")}>QR Code</Button>
                    <Button variant="outline" size="sm" onClick={() => editClient(c)}>Modifier</Button>
                    <Button variant="outline" size="sm" className="text-red-600" onClick={() => deleteClient(c.id)}>Supprimer</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}