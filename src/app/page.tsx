import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Wrench, Phone, Shield, Zap } from "lucide-react";
import AdBanner from "@/components/ads/AdBanner"; // ← Import

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 to-red-800 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 text-white border-white/30 text-sm px-4 py-1.5">
            Sans inscription • 100% gratuit
          </Badge>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Trouvez l&apos;artisan qu&apos;il vous faut en 1 clic
          </h1>
          <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
            Publiez votre demande gratuitement, recevez des contacts d&apos;artisans vérifiés près de chez vous, directement sur WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demander" aria-label="Publier une demande de service">
              <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-6">
                <Search className="mr-2 h-5 w-5" aria-hidden="true" />
                Je cherche un artisan
              </Button>
            </Link>

            <Link href="/demandes" aria-label="Voir les demandes de service">
              <Button
                size="lg"
                className="bg-white/10 backdrop-blur border border-white text-white hover:bg-white/20 text-lg px-8 py-6"
              >
                <Wrench className="mr-2 h-5 w-5" aria-hidden="true" />
                Je suis artisan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bloc de contenu SEO */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 leading-relaxed">
          <strong>Khedma</strong> est la plateforme marocaine qui met en relation directe les particuliers et les professionnels 
          de la réparation et de la rénovation. En quelques clics, décrivez votre besoin, ajoutez des photos, et recevez 
          des propositions d&apos;artisans vérifiés directement sur WhatsApp. Simple, rapide, et sans aucun frais d&apos;inscription.
        </p>
      </section>

      {/* Bannière publicitaire avant la section Pourquoi */}
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <AdBanner
          imageUrl="https://via.placeholder.com/800x100?text=Votre+Pub+Ici"
          linkUrl="https://example.com"
          altText="Publicité"
        />
      </div>

      {/* Pourquoi Khedma ? */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir Khedma ?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="mx-auto bg-red-100 w-14 h-14 rounded-full flex items-center justify-center" aria-hidden="true">
                <Zap className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold">Rapide & sans inscription</h3>
              <p className="text-gray-600">Publiez une demande en moins d&apos;une minute, sans créer de compte.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto bg-red-100 w-14 h-14 rounded-full flex items-center justify-center" aria-hidden="true">
                <Shield className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold">Artisans de confiance</h3>
              <p className="text-gray-600">Nous vérifions l&apos;identité et les avis pour vous garantir un service fiable.</p>
            </div>
            <div className="text-center space-y-3">
              <div className="mx-auto bg-red-100 w-14 h-14 rounded-full flex items-center justify-center" aria-hidden="true">
                <Phone className="h-7 w-7 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold">Contact direct</h3>
              <p className="text-gray-600">Discutez avec l&apos;artisan via WhatsApp, sans intermédiaire.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16 bg-red-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h2 className="text-3xl font-bold">Prêt à trouver le bon artisan ?</h2>
          <p className="text-red-100">Rejoignez des centaines de personnes qui utilisent Khedma chaque jour.</p>
          <Link href="/demander">
            <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-6">
              Publier une demande gratuite
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}