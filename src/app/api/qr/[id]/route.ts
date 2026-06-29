import QRCode from "qrcode";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const url = `https://www.khedmapro.com/c/${params.id}`;
  const qrBuffer = await QRCode.toBuffer(url, {
    width: 300,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  });

  // On force le type pour éviter l'erreur de build (le code fonctionne)
  return new Response(qrBuffer as any, {
    headers: { "Content-Type": "image/png" },
  });
}