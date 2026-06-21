import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PenTool, MessageCircle, CheckCircle } from "lucide-react";

export default function CommentCaMarchePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <Badge variant="secondary" className="mb-4 text-sm">
          📘 Guide rapide
        </Badge>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Comment fonctionne KhedmaPro ?
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Trouver un artisan qualifié près de chez vous n&apos;a jamais été aussi simple. Tout se fait en trois étapes, sans inscription.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-3">
        {/* Étape 1 */}
        <Card className="text-center border-t-4 border-red-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="mx-auto bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <PenTool className="h-7 w-7 text-red-600" />
            </div>
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <span className="text-red-600 font-bold">1.</span> Je publie ma demande
            </CardTitle>
            <CardDescription className="text-gray-600">
              Décrivez votre besoin en quelques mots, ajoutez éventuellement des photos, et indiquez votre ville. C&apos;est gratuit et sans inscription.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Étape 2 */}
        <Card className="text-center border-t-4 border-red-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="mx-auto bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="h-7 w-7 text-red-600" />
            </div>
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <span className="text-red-600 font-bold">2.</span> Les artisans me contactent
            </CardTitle>
            <CardDescription className="text-gray-600">
              Les professionnels vérifiés de votre secteur reçoivent votre demande et vous contactent directement sur WhatsApp pour discuter du projet.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Étape 3 */}
        <Card className="text-center border-t-4 border-red-500 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="mx-auto bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-7 w-7 text-red-600" />
            </div>
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              <span className="text-red-600 font-bold">3.</span> Je choisis le meilleur
            </CardTitle>
            <CardDescription className="text-gray-600">
              Comparez les propositions, discutez avec les artisans, et retenez celui qui vous convient. En toute simplicité.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );
}