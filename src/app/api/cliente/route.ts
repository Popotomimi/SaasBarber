import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ClienteModel } from "@/models/Cliente";
import { HistoryModel } from "@/models/History";
import { Bloqueio } from "@/models/Bloqueio";
import { DateTime } from "luxon";
import { services } from "@/db/services";
import { sendWhatsAppMessage } from "@/lib/sendWhatsAppMessage";
import { initWhatsAppSafe, isWhatsAppConnected } from "@/lib/whatsapp";

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

    // 🔒 Verificar bloqueios
    const bloqueios = await Bloqueio.find({ barber });

    for (const bloqueio of bloqueios) {
      const inicioBloqueio = DateTime.fromISO(
        `${bloqueio.startDate}T${bloqueio.startTime}`,
        {
          zone: "America/Sao_Paulo",
        }
      );

      const fimBloqueio = DateTime.fromISO(
        `${bloqueio.endDate || bloqueio.startDate}T${bloqueio.endTime}`,
        {
          zone: "America/Sao_Paulo",
        }
      );

      const dentroDoBloqueio =
        dataAgendada >= inicioBloqueio && dataAgendada < fimBloqueio;

      if (dentroDoBloqueio) {
        return NextResponse.json(
          {
            message: `Horário indisponível! Agenda bloqueada até ${fimBloqueio.toFormat(
              "dd/MM/yyyy HH:mm"
            )}. Motivo: ${bloqueio.motivo}`,
          },
          { status: 403 }
        );
      }
    }

    // ⛔ Verificar conflitos com agendamentos existentes
    const agendamentosExistentes = await ClienteModel.find({ date, barber });

    const novoInicio = dataAgendada;
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

    // ✅ Criar agendamento
    const cliente = await ClienteModel.create({
      name,
      date,
      time,
      service,
      barber,
      phone,
    });

    // Enviar mensagem para o cliente
    /*const mensagem = `Novo agendamento realizado:\n
      Nome: ${name}\n
      Data: ${date}\n
      Horário: ${time}\n
      Serviço: ${service}\n
      Barbeiro: ${barber}\n
      Telefone do cliente: ${phone}`;

    await sendWhatsAppMessage(mensagem, "5511959533499");*/

    // 📊 Atualizar histórico
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

    // Verifica e inicia o WhatsApp de forma segura
    /*if (!isWhatsAppConnected()) {
      console.log("🔄 WhatsApp não está conectado. Iniciando...");
      await initWhatsAppSafe(); // evita múltiplas inicializações simultâneas
    }*/

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
