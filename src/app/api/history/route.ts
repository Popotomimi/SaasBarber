import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { HistoryModel } from "@/models/History";

export async function GET() {
  await connectToDatabase();

  try {
    const histories = await HistoryModel.find();
    return NextResponse.json(histories, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar todos os históricos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar históricos." },
      { status: 500 }
    );
  }
}
