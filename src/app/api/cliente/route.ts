import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ClienteModel } from "@/models/Cliente";
import { HistoryModel } from "@/models/History";
import { DateTime } from "luxon";
import { services } from "@/db/services";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const body = await req.json();
  const { name, date, time, service, barber, phone } = body;

  if (!name || !date || !time || !service || !barber || !phone) {
    return NextResponse.json(
      { message: "Todos os campos são obrigatórios!" },
      { status: 422 }
    );
  }

  try {
    const dataAtual = DateTime.now().setZone("America/Sao_Paulo");
    const dataAgendada = DateTime.fromISO(`${date}T${time}`, {
      zone: "America/Sao_Paulo",
    });

    if (!dataAgendada.isValid || dataAgendada <= dataAtual) {
      return NextResponse.json(
        { message: "A data e o horário devem ser no futuro!" },
        { status: 422 }
      );
    }

    const agendamentosExistentes = await ClienteModel.find({ date, barber });

    const novoInicio = DateTime.fromISO(`${date}T${time}`, {
      zone: "America/Sao_Paulo",
    });
    const novoFim = novoInicio.plus({
      minutes: services.find((s) => s.name === service)?.duration || 0,
    });

    for (const ag of agendamentosExistentes) {
      const inicioExistente = DateTime.fromISO(`${ag.date}T${ag.time}`, {
        zone: "America/Sao_Paulo",
      });
      const fimExistente = inicioExistente.plus({
        minutes: services.find((s) => s.name === ag.service)?.duration || 0,
      });

      const sobrepoe = novoInicio < fimExistente && novoFim > inicioExistente;

      if (sobrepoe) {
        return NextResponse.json(
          {
            message: `Conflito com agendamento de ${
              ag.time
            } até ${fimExistente.toFormat("HH:mm")}`,
          },
          { status: 409 }
        );
      }
    }

    const cliente = await ClienteModel.create({
      name,
      date,
      time,
      service,
      barber,
      phone,
    });

    const historyExistente = await HistoryModel.findOne({ phone });

    if (historyExistente) {
      historyExistente.amount = (historyExistente.amount ?? 0) + 1;
      historyExistente.dates.push(dataAgendada.toJSDate());
      historyExistente.services.push(service);
      historyExistente.barbers.push(barber);
      historyExistente.times.push(time);
      await historyExistente.save();
    } else {
      await HistoryModel.create({
        name: cliente.name,
        phone: cliente.phone,
        amount: 1,
        dates: [dataAgendada.toJSDate()],
        times: [time],
        services: [service],
        barbers: [barber],
      });
    }

    return NextResponse.json(cliente, { status: 201 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Erro desconhecido!";
    console.error(`Erro no sistema: ${errorMessage}`);
    return NextResponse.json(
      { error: "Por favor, tente mais tarde!" },
      { status: 500 }
    );
  }
}

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
