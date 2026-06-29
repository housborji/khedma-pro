import QRCode from "qrcode";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const url = `https://www.khedmapro.com/c/${params.id}`;
  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  // Convertir la data URL (base64) en buffer pour la réponse
  const base64 = qrDataUrl.split(",")[1];
  const binary = Buffer.from(base64, "base64");

  return new Response(binary, {
    headers: { "Content-Type": "image/png" },
  });
}