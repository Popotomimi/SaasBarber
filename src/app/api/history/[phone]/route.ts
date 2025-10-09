import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { HistoryModel } from "@/models/History";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("55") ? digits.slice(2) : digits;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ phone: string }> }
) {
  await connectToDatabase();

  try {
    const { phone } = await context.params;
    const normalized = normalizePhone(phone);

    const histories = await HistoryModel.find();
    const filtrados = histories.filter(
      (h) => normalizePhone(h.phone) === normalized
    );

    return NextResponse.json(filtrados, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar histórico por telefone:", error);
    return NextResponse.json(
      { error: "Erro ao buscar histórico." },
      { status: 500 }
    );
  }
}
