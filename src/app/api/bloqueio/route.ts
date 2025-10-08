import { NextResponse } from "next/server";
import { Bloqueio } from "@/models/Bloqueio";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  await connectToDatabase();
  try {
    const bloqueios = await Bloqueio.find();
    return NextResponse.json(bloqueios, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar bloqueios." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const { barber, startDate, endDate, startTime, endTime, motivo } =
      await req.json();

    if (endDate && new Date(endDate) < new Date(startDate)) {
      return NextResponse.json(
        { error: "Data de fim não pode ser anterior à data de início." },
        { status: 400 }
      );
    }

    const newBloqueio = new Bloqueio({
      barber,
      startDate,
      endDate,
      startTime,
      endTime,
      motivo,
    });
    await newBloqueio.save();

    return NextResponse.json(
      { message: "Bloqueio Adicionado com sucesso!" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar bloqueio." },
      { status: 500 }
    );
  }
}
