// src/app/api/qr/route.ts
import { NextResponse } from "next/server";
import { initWhatsApp, getQRStatus } from "@/lib/whatsapp";

export async function GET() {
  initWhatsApp();
  const { qr, connected } = getQRStatus();

  if (connected) {
    return NextResponse.json({ connected: true });
  }

  if (!qr) {
    return NextResponse.json(
      { message: "QR Code ainda não gerado" },
      { status: 202 }
    );
  }

  return NextResponse.json({ qr, connected: false });
}
