import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ClienteModel } from "@/models/Cliente";
import { HistoryModel } from "@/models/History";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  try {
    const { id } = await context.params;
    const { date } = await request.json();

    if (!date) {
      return NextResponse.json(
        { error: "Data não fornecida" },
        { status: 400 }
      );
    }

    const cliente = await ClienteModel.findById(id);
    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    const history = await HistoryModel.findOne({ phone: cliente.phone });
    if (!history) {
      return NextResponse.json(
        { error: "Histórico não encontrado" },
        { status: 404 }
      );
    }

    const targetDate = new Date(date);
    const index = history.dates.findIndex((d: string | Date) => {
      const dDate = new Date(d);
      return (
        dDate.getFullYear() === targetDate.getFullYear() &&
        dDate.getMonth() === targetDate.getMonth() &&
        dDate.getDate() === targetDate.getDate()
      );
    });

    if (index === -1) {
      return NextResponse.json(
        { error: "Data não encontrada no histórico" },
        { status: 404 }
      );
    }

    history.dates.splice(index, 1);
    history.services.splice(index, 1);
    history.barbers.splice(index, 1);
    history.prices.splice(index, 1);
    if (history.times) {
      history.times.splice(index, 1);
    }

    history.amount = Math.max(0, history.amount - 1);

    history.markModified("dates");
    history.markModified("services");
    history.markModified("barbers");
    history.markModified("prices");
    history.markModified("amount");
    if (history.times) {
      history.markModified("times");
    }

    await history.save();

    await ClienteModel.findOneAndDelete({
      phone: cliente.phone,
      date: targetDate.toISOString().split("T")[0],
      time: cliente.time,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir data do histórico" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();

  try {
    const { id } = await context.params;
    const body = await request.json();

    const original = await ClienteModel.findById(id);
    if (!original) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    const updated = await ClienteModel.findByIdAndUpdate(id, body, {
      new: true,
    });

    const history = await HistoryModel.findOne({ phone: updated.phone });
    if (history) {
      const targetDate = new Date(original.date).toISOString().split("T")[0];

      const index = history.dates.findIndex((d: string | Date, i: number) => {
        const dLocal = new Date(d).toISOString().split("T")[0];
        const timeMatch = history.times?.[i] === original.time;
        const dateMatch = dLocal === targetDate;
        return dateMatch && timeMatch;
      });

      if (index !== -1) {
        if (body.service) history.services[index] = body.service;
        if (body.barber) history.barbers[index] = body.barber;
        if (body.price !== undefined) history.prices[index] = body.price;
        if (body.time && history.times) history.times[index] = body.time;

        history.markModified("services");
        history.markModified("barbers");
        history.markModified("prices");
        if (history.times) history.markModified("times");

        await history.save();
      }
    }

    return NextResponse.json(updated, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar cliente" },
      { status: 500 }
    );
  }
}
