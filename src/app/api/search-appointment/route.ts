import { connectToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ClienteModel } from "@/models/Cliente";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { error: "Número de telefone é obrigatório" },
        { status: 400 }
      );
    }

    const appointment = await ClienteModel.findOne({ phone });

    if (!appointment) {
      return NextResponse.json(
        { message: "Nenhum agendamento encontrado. Realize um agendamento." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      date: appointment.date,
      time: appointment.time,
      service: appointment.service,
      barber: appointment.barber,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamento" },
      { status: 500 }
    );
  }
}
