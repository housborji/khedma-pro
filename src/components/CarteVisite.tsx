"use client";

interface Client {
  id?: string;
  nom: string;
  metier: string;
  entreprise?: string;
  photo: string;
  telephone: string;
  email: string;
  adresse?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  site?: string;
  bio?: string; // laissé dans l'interface pour compatibilité, mais non affiché
}

// Icône Facebook (SVG complet)
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// Icône Instagram (SVG complet)
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

// Icône Partager (SVG complet)
const ShareIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
  </svg>
);

// Icône Téléphone
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.01l-2.2 2.2z" />
  </svg>
);

export default function CarteVisite({ client }: { client: Client }) {
  const tel = client.whatsapp || client.telephone;

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gradient-to-b from-[#dbe2e8] to-[#a4c4e8] pb-8">
        <div className="relative text-center">
          <div
            className="w-full h-[350px]"
            style={{
              maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
            }}
          >
            <img
              src={client.photo}
              alt={client.nom}
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(100%)" }}
            />
          </div>

          <div className="absolute bottom-5 left-5 text-left">
            <h1
              className="text-[32px] font-normal text-white mb-1"
              style={{ textShadow: "1px 1px 4px rgba(0,0,0,0.4)" }}
            >
              {client.nom}
            </h1>
            <h3 className="text-base font-medium text-[#333] mb-0.5">{client.metier}</h3>
            {client.entreprise && (
              <h4 className="text-sm font-bold text-[#1a1a1a]">{client.entreprise}</h4>
            )}
          </div>
        </div>

        <div className="flex justify-start gap-[15px] px-5 -mt-2.5 flex-wrap">
          <a
            href={`tel:${client.telephone}`}
            className="w-[45px] h-[45px] bg-[#1b4282] text-white rounded-full flex justify-center items-center text-lg shadow-md hover:scale-105 transition-transform"
          >
            <PhoneIcon />
          </a>

          <a
            href={`mailto:${client.email}`}
            className="w-[45px] h-[45px] bg-[#1b4282] text-white rounded-full flex justify-center items-center text-lg shadow-md hover:scale-105 transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
          </a>

          <a
            href={`https://wa.me/${tel.replace(/^0/, "212")}`}
            target="_blank" rel="noopener noreferrer"
            className="w-[45px] h-[45px] bg-[#1b4282] text-white rounded-full flex justify-center items-center text-lg shadow-md hover:scale-105 transition-transform"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>

          {client.facebook && (
            <a
              href={client.facebook}
              target="_blank" rel="noopener noreferrer"
              className="w-[45px] h-[45px] bg-[#1b4282] text-white rounded-full flex justify-center items-center text-lg shadow-md hover:scale-105 transition-transform"
            >
              <FacebookIcon />
            </a>
          )}

          {client.instagram && (
            <a
              href={`https://instagram.com/${client.instagram}`}
              target="_blank" rel="noopener noreferrer"
              className="w-[45px] h-[45px] bg-[#1b4282] text-white rounded-full flex justify-center items-center text-lg shadow-md hover:scale-105 transition-transform"
            >
              <InstagramIcon />
            </a>
          )}
        </div>
      </div>

      <div className="bg-black px-5 pt-6 pb-8">
        <div className="bg-white rounded-[20px] p-5 shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-black text-white rounded-[10px] flex justify-center items-center mr-4 text-lg">
              <PhoneIcon />
            </div>
            <h2 className="text-lg font-medium text-[#222]">Contact</h2>
          </div>

          <hr className="border-t border-dashed border-[#ccc] my-4" />

          <div className="mb-4">
            <p className="text-sm font-medium text-[#1b4282] mb-1">Téléphone</p>
            <p className="text-[13px] text-[#555]">{client.telephone}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-[#1b4282] mb-1">Email</p>
            <p className="text-[13px] text-[#555]">{client.email}</p>
          </div>

          {client.adresse && (
            <div className="mb-4">
              <p className="text-sm font-medium text-[#1b4282] mb-1">Adresse</p>
              <p className="text-[13px] text-[#555]">{client.adresse}</p>
            </div>
          )}

          <div className="flex justify-between items-center mt-5">
            <div className="flex gap-2.5">
              <a
                href={`/api/qr/${client.id || ""}`}
                target="_blank" rel="noopener noreferrer"
                className="w-[45px] h-[45px] bg-[#1b4282] text-white rounded-full flex justify-center items-center text-lg shadow-md hover:scale-105 transition-transform"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-2v3h3v2h-3v2h-2v-3h-2v-2h2v-2h3v2zm-1-1h-2v-2h2v2z" />
                </svg>
              </a>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="w-[45px] h-[45px] bg-[#1b4282] text-white rounded-full flex justify-center items-center text-lg shadow-md hover:scale-105 transition-transform"
              >
                <ShareIcon />
              </button>
            </div>
            <a
              href={`/api/vcard/${client.id || ""}`}
              className="bg-[#1b4282] text-white px-5 py-2.5 rounded-[30px] flex items-center gap-2.5 text-sm font-bold hover:bg-[#153366] transition-colors"
            >
              <span className="bg-white text-[#1b4282] w-6 h-6 rounded-full flex justify-center items-center text-lg">+</span>
              Contact
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}