import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ClienteModel } from "@/models/Cliente";

export async function GET() {
  try {
    await connectToDatabase();
    const clientes = await ClienteModel.find();
    return NextResponse.json(clientes, { status: 200 });
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(`Erro no sistema: ${e.message}`);
    } else {
      console.error("Erro desconhecido", e);
    }
    return NextResponse.json(
      { error: "Por favor, tente mais tarde!" },
      { status: 500 }
    );
  }
}
