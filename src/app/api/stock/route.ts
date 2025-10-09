import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Stock } from "@/models/Stock";

// Conecta ao banco antes de qualquer operação
await connectToDatabase();

// GET: Retorna todos os produtos do estoque
export async function GET() {
  try {
    const stock = await Stock.find({});
    return NextResponse.json(stock);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar o estoque." },
      { status: 500 }
    );
  }
}

// POST: Atualiza a quantidade dos produtos
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Atualiza o documento mais recente (ou cria se não existir)
    const updatedStock = await Stock.findOneAndUpdate(
      {}, // Seleciona o primeiro documento
      { $set: body }, // Incrementa os campos enviados
      { new: true, upsert: true } // Cria se não existir
    );

    return NextResponse.json(updatedStock);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar o estoque." },
      { status: 500 }
    );
  }
}
