import schedule from "node-schedule";
import { connectToDatabase } from "@/lib/mongodb";
import { ClienteModel } from "@/models/Cliente";
import { DateTime } from "luxon";

// Agendamento diário às 03:00 da manhã
schedule.scheduleJob("0 3 * * *", async () => {
  try {
    await connectToDatabase();

    const limite = DateTime.now()
      .minus({ days: 2 })
      .setZone("America/Sao_Paulo");

    const clientesParaExcluir = await ClienteModel.find({
      $expr: {
        $lt: [
          {
            $dateFromString: {
              dateString: "$date",
              timezone: "America/Sao_Paulo",
            },
          },
          limite.toISODate(),
        ],
      },
    });

    if (clientesParaExcluir.length > 0) {
      await ClienteModel.deleteMany({
        _id: { $in: clientesParaExcluir.map((c) => c._id) },
      });

      console.log(
        `🧹 ${clientesParaExcluir.length} clientes excluídos por expiração.`
      );
    } else {
      console.log("✅ Nenhum cliente expirado para excluir hoje.");
    }
  } catch (error) {
    console.error("❌ Erro ao executar limpeza de clientes:", error);
  }
});
