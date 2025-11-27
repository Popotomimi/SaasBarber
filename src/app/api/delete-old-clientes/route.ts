import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ClienteModel } from "@/models/Cliente";
import { DateTime } from "luxon";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  /*const doisDiasAtras = DateTime.now()
    .setZone("America/Sao_Paulo")
    .minus({ days: 2 })
    .startOf("day");

  const result = await ClienteModel.deleteMany({
    date: { $lte: doisDiasAtras.toFormat("yyyy-MM-dd") },
  });

  return NextResponse.json(
    { message: `Clientes excluídos: ${result.deletedCount}` },
    { status: 200 }
  );*/
}
