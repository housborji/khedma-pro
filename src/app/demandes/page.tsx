"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Phone, MapPin, Calendar } from "lucide-react";
import { Toaster, toast } from "sonner";
import AdBanner from "@/components/ads/AdBanner";

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

const CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
];

const CATEGORIES = [
  "Plomberie",
  "Électricité",
  "Peinture",
  "Menuiserie",
  "Nettoyage",
  "Jardinage",
  "Climatisation",
  "Déménagement",
  "Autre",
];

export default function DemandesPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterCity, setFilterCity] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [dateDebut, setDateDebut] = useState<string>("");
  const [dateFin, setDateFin] = useState<string>("");

  useEffect(() => {
    loadRequests();
  }, [filterCity, filterCategory, dateDebut, dateFin]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const troisMoisAvant = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

      let query = supabase
        .from("service_requests")
        .select("*")
        .eq("status", "open")
        .gte("created_at", troisMoisAvant)
        .order("is_urgent", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(50);

      if (filterCity && filterCity !== "all") {
        query = query.eq("city", filterCity);
      }
      if (filterCategory && filterCategory !== "all") {
        query = query.eq("category", filterCategory);
      }
      if (dateDebut) {
        query = query.gte("created_at", new Date(dateDebut).toISOString());
      }
      if (dateFin) {
        const fin = new Date(dateFin);
        fin.setDate(fin.getDate() + 1);
        query = query.lte("created_at", fin.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Erreur chargement demandes:", error);
      toast.error("Impossible de charger les demandes");
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (request: Request) => {
    const phone = request.client_phone.startsWith("0")
      ? "212" + request.client_phone.slice(1)
      : request.client_phone;
    const message = `Bonjour ${request.client_name}, je vous contacte concernant votre demande "${request.title}". Je suis disponible pour en discuter.`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    supabase.from("contact_logs").insert({
      request_id: request.id,
      provider_name: "Artisan",
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster position="top-center" richColors />

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              📋 Demandes de service
            </h1>
            <p className="text-gray-600">
              Contactez directement les clients via WhatsApp
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Badge variant="secondary" className="text-sm">
              {requests.length} demande{requests.length !== 1 ? "s" : ""}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">Du :</label>
            <Input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              className="w-36"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">Au :</label>
            <Input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              className="w-36"
            />
          </div>

          <Select value={filterCity} onValueChange={(value) => setFilterCity(value ?? "all")}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Toutes les villes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={(value) => setFilterCategory(value ?? "all")}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <AdBanner placeholder />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <div className="animate-spin text-4xl mb-4">⏳</div>
            <p>Chargement des demandes...</p>
          </div>
        ) : requests.length === 0 ? (
          <Card className="py-12">
            <CardContent className="text-center text-gray-500">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-lg">Aucune demande pour le moment</p>
              <p className="text-sm mt-2">
                Revenez plus tard ou modifiez les filtres.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((req) => (
              <Card
                key={req.id}
                className={`overflow-hidden transition-shadow hover:shadow-md ${
                  req.is_urgent ? "border-l-4 border-red-500" : ""
                }`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {req.title}
                        {req.is_urgent && (
                          <Badge variant="destructive" className="text-xs">
                            URGENT
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                        <span className="inline-flex items-center text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {req.city}
                          {req.neighborhood && `, ${req.neighborhood}`}
                        </span>
                        <span className="inline-flex items-center text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {format(new Date(req.created_at), "dd MMM HH:mm", {
                            locale: fr,
                          })}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {req.category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {req.description && (
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {req.description}
                    </p>
                  )}

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

                  {req.budget_max && (
                    <p className="text-sm font-medium text-green-600">
                      Budget max: {req.budget_max} MAD
                    </p>
                  )}

                  <Button
                    onClick={() => handleContact(req)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Contacter {req.client_name} via WhatsApp
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}