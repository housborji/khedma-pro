import CarteVisite from "@/components/CarteVisite";

const clients: Record<string, {
  nom: string;
  metier: string;
  photo: string;
  telephone: string;
  email: string;
  site?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  bio?: string;
}> = {
  ahmed: {
    nom: "Ahmed Alaoui",
    metier: "Plombier Professionnel",
    photo: "https://i.pravatar.cc/300?img=11",
    telephone: "0612345678",
    email: "ahmed@example.com",
    site: "www.ahmed-plombier.ma",
    instagram: "ahmed.plombier",
    facebook: "https://facebook.com/ahmed.plombier",
    whatsapp: "0612345678",
    bio: "Fort de 10 ans d'expérience, je propose mes services de plomberie pour tous vos travaux de dépannage, installation et rénovation. Intervention rapide et devis gratuit."
  },
  fatima: {
    nom: "Fatima Zahra",
    metier: "Électricienne",
    photo: "https://i.pravatar.cc/300?img=5",
    telephone: "0623456789",
    email: "fatima@example.com",
    instagram: "fatima.elec",
    whatsapp: "0623456789",
    bio: "Spécialiste en installation et dépannage électrique. Plus de 8 ans d'expérience à votre service."
  },
};

export default async function CartePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = clients[id];
  if (!client) return <div className="min-h-screen flex items-center justify-center">Client introuvable</div>;
  return <CarteVisite client={client} />;
}