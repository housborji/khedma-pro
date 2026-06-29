import QRCode from "qrcode";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const url = `https://www.khedmapro.com/c/${params.id}`;

  // Générer le QR code en Data URL (base64)
  const dataUrl = await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  // Extraire la partie base64 (après "data:image/png;base64,")
  const base64 = dataUrl.split(",")[1];

  // Convertir en binaire
  const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  return new Response(binary, {
    headers: { "Content-Type": "image/png" },
  });
}