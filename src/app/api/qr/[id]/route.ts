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

  // Convertir le Buffer en Uint8Array pour compatibilité TypeScript
  return new Response(new Uint8Array(qrBuffer), {
    headers: { "Content-Type": "image/png" },
  });
}