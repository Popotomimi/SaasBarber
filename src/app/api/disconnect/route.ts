// src/app/api/disconnect/route.ts
import { NextResponse } from "next/server";
import { disconnectWhatsApp } from "@/lib/whatsapp";

export async function POST() {
  const success = await disconnectWhatsApp();

  if (success) {
    return NextResponse.json({ message: "Desconectado com sucesso" });
  }

  return NextResponse.json({ error: "Falha ao desconectar" }, { status: 500 });
}
