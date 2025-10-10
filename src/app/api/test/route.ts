import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Erro de conexão:", error);
    return NextResponse.json(
      { error: "Falha na conexão com MongoDB" },
      { status: 500 }
    );
  }
}
