import type { Metadata } from "next";

export const metadata: Metadata = {
  manifest: "/manifest.json",
};

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mentions légales</h1>

        <h2 className="text-xl font-semibold mt-8">Éditeur du site</h2>
        <p>
          Le site KhedmaPro est édité par Houssem Borji, entrepreneur individuel, accessible via khedmapro.com.
          <br />
          Contact : houssem241@outlook.fr | +212 658 04 83 69
        </p>

        <h2 className="text-xl font-semibold mt-8">Hébergement</h2>
        <p>
          Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA.
        </p>

        <h2 className="text-xl font-semibold mt-8">Propriété intellectuelle</h2>
        <p>
          Tous les contenus présents sur ce site (textes, logos, images) sont la propriété exclusive de KhedmaPro, sauf mention contraire. Toute reproduction est interdite sans autorisation.
        </p>

        <h2 className="text-xl font-semibold mt-8">Données personnelles</h2>
        <p>
          Conformément à la loi 09-08, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour l&apos;exercer, contactez-nous à l&apos;adresse ci-dessus.
        </p>

        <h2 className="text-xl font-semibold mt-8">Responsabilité</h2>
        <p>
          KhedmaPro ne peut être tenu responsable des transactions entre les utilisateurs et les artisans. Chaque partie reste libre de ses choix.
        </p>
      </div>
    </main>
  );
}