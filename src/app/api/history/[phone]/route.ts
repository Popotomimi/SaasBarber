import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { HistoryModel } from "@/models/History";

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("55") ? digits.slice(2) : digits;
}

export async function GET(
  request: Request,
  context: { params: { phone: string } }
) {
  await connectToDatabase();

  try {
    // Aguarde explicitamente o acesso ao params
    const rawPhone = (await Promise.resolve(context.params)).phone;
    const normalized = normalizePhone(rawPhone);

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
