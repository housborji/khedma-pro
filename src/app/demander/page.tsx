"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast, Toaster } from "sonner";
import AdBanner from "@/components/ads/AdBanner";

const CATEGORIES = [
  "Plomberie (Plombier - معلم الماء)",
  "Électricité (كهربائي)",
  "Peinture (صباغ)",
  "Menuiserie (نجار)",
  "Nettoyage (خدمة التنظيف)",
  "Jardinage (بستاني)",
  "Climatisation (تصليح التكييف)",
  "Déménagement (نقل الأثاث)",
  "Autre / إصلاحات عامة",
];

const CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
];

interface FormData {
  client_name: string;
  client_phone: string;
  title: string;
  description: string;
  category: string;
  city: string;
  neighborhood: string;
  is_urgent: boolean;
}

const MAX_PHOTOS = 3;
const MAX_SIZE = 8 * 1024 * 1024; // 8 Mo

export default function DemanderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    client_name: "",
    client_phone: "",
    title: "",
    description: "",
    category: "Plomberie (Plombier - معلم الماء)",
    city: "Casablanca",
    neighborhood: "",
    is_urgent: false,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const currentTotal = selectedFiles.length;
    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(files).forEach((file) => {
      if (currentTotal + newFiles.length >= MAX_PHOTOS) {
        toast.error(`Vous ne pouvez pas ajouter plus de ${MAX_PHOTOS} photos.`);
        return;
      }
      if (file.size > MAX_SIZE) {
        toast.error(`Le fichier ${file.name} dépasse 8 Mo et a été ignoré.`);
        return;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    if (newFiles.length === 0 && files.length > 0) {
      toast.error("Aucun fichier valide (taille max 8 Mo ou nombre max 3 photos atteint).");
      return;
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];

    const uploadPromises = selectedFiles.map(async (file) => {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const { data, error } = await supabase.storage
        .from("photos")
        .upload(`demandes/${fileName}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("Erreur upload photo:", error);
        throw new Error(`Upload échoué: ${error.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("photos")
        .getPublicUrl(`demandes/${fileName}`);

      return publicUrlData.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/\s/g, "");
    return /^0[5-7][0-9]{8}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.client_name || !form.client_phone || !form.title) {
      toast.error("Veuillez remplir le nom, téléphone et titre");
      return;
    }

    if (!isValidPhone(form.client_phone)) {
      toast.error("Numéro de téléphone invalide (ex: 0612345678)");
      return;
    }

    setLoading(true);

    try {
      let photoUrls: string[] = [];
      if (selectedFiles.length > 0) {
        photoUrls = await uploadPhotos();
      }

      const { error } = await supabase.from("service_requests").insert({
        client_name: form.client_name,
        client_phone: form.client_phone,
        title: form.title,
        description: form.description || undefined,
        category: form.category,
        city: form.city,
        neighborhood: form.neighborhood || undefined,
        is_urgent: form.is_urgent,
        photos: photoUrls,
        status: "pending",
      });

      if (error) {
        const message = error?.message || "Erreur inconnue";
        const details = error?.details || "";
        throw new Error(`${message}${details ? ` (${details})` : ""}`);
      }

      toast.success("Demande envoyée pour validation !");
      setTimeout(() => {
        router.push("/demandes");
      }, 2000);
    } catch (err: any) {
      console.error("Erreur complète :", err);
      toast.error(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <Toaster position="top-center" richColors />

      <div className="max-w-2xl mx-auto mb-8">
        <AdBanner />
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">🔨 Publier une demande (Snay3i)</CardTitle>
          <CardDescription>
            Décrivez votre besoin, ajoutez jusqu&apos;à {MAX_PHOTOS} photos (8 Mo max par fichier). Votre demande sera validée avant d&apos;être visible.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Votre nom <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  placeholder="Ahmed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Téléphone WhatsApp <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  required
                  value={form.client_phone}
                  onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
                  placeholder="0612345678"
                />
                <p className="text-xs text-gray-500">Format: 06XXXXXXXX ou 07XXXXXXXX (10 chiffres)</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Titre de la demande <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Robinet qui fuit dans la cuisine"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie / Service (Snay3i)</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ville</label>
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quartier</label>
              <Input
                value={form.neighborhood}
                onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                placeholder="Maarif, Gauthier..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Décrivez votre problème en détail..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">📸 Photos (optionnel, max {MAX_PHOTOS} photos, 8 Mo par image)</label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {previewUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20">
                      <img
                        src={url}
                        alt={`Aperçu ${idx}`}
                        className="w-20 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        onClick={() => removePhoto(idx)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500">
                Vous pouvez ajouter jusqu&apos;à {MAX_PHOTOS} photos (8 Mo maximum par image).
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="urgent"
                checked={form.is_urgent}
                onCheckedChange={(checked) =>
                  setForm({ ...form, is_urgent: checked === true })
                }
              />
              <label htmlFor="urgent" className="text-sm font-medium">
                🚨 Demande urgente
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? "Publication en cours..." : "📤 Publier la demande (Snay3i)"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}