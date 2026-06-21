import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";
import AdBanner from "@/components/ads/AdBanner";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
        <p className="text-lg text-gray-600">
          Une question, une suggestion, ou vous souhaitez référencer votre entreprise ? Écrivez-nous directement.
        </p>
      </div>
      <div className="max-w-2xl mx-auto mb-8">
        <AdBanner />
      </div>
      <div className="max-w-2xl mx-auto grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-red-600" /> WhatsApp
            </CardTitle>
            <CardDescription>Contactez-nous par message</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="https://wa.me/212658048369?text=Bonjour%20KhedmaPro%20!" target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-green-500 hover:bg-green-600">
                Ouvrir WhatsApp
              </Button>
            </a>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-red-600" /> Email
            </CardTitle>
            <CardDescription>Envoyez-nous un email</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="mailto:houssem241@outlook.fr">
              <Button variant="outline" className="w-full">
                houssem241@outlook.fr
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
      <div className="max-w-md mx-auto mt-8 text-center text-gray-500 flex items-center justify-center gap-2">
        <MapPin className="h-4 w-4" /> Rabat, Maroc
      </div>
    </div>
  );
}