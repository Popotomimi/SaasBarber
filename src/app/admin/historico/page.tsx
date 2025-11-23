"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import History from "@/interfaces/History";
import BackAdmin from "@/components/back/back";
import { DateTime } from "luxon";

export default function HistoricoPage() {
  const [historicos, setHistoricos] = useState<History[]>([]);
  const hoje = DateTime.now().setZone("America/Sao_Paulo");
  const [dataInicial, setDataInicial] = useState<DateTime | null>(
    hoje.minus({ days: 7 })
  );
  const [dataFinal, setDataFinal] = useState<DateTime | null>(hoje);
  const router = useRouter();

  useEffect(() => {
    const atualizar = () => {
      fetch("/api/history")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setHistoricos(data);
          } else {
            console.error("Resposta inesperada da API:", data);
            setHistoricos([]);
          }
        })
        .catch((err) => {
          console.error("Erro ao buscar históricos:", err);
          setHistoricos([]);
        });
    };

    atualizar();
    window.addEventListener("agendaAtualizada", atualizar);

    return () => {
      window.removeEventListener("agendaAtualizada", atualizar);
    };
  }, []);

  const clientesUnicos = Array.isArray(historicos)
    ? Object.values(
        historicos.reduce((acc: Record<string, History>, h) => {
          const normalized = h.phone.replace(/\D/g, "").replace(/^55/, "");
          if (!acc[normalized]) {
            acc[normalized] = h;
          } else {
            acc[normalized].amount += h.amount;
          }
          return acc;
        }, {})
      )
    : [];

  const calcularLucroPorBarbeiro = (
    historico: History[],
    barbeiro: string,
    inicio: DateTime | null,
    fim: DateTime | null
  ) => {
    if (!inicio || !fim) return 0;

    let total = 0;

    historico.forEach((h) => {
      h.dates.forEach((data, index) => {
        const dataServico = DateTime.fromJSDate(new Date(data));
        const barbeiroAtual = h.barbers?.[index];
        const preco = h.prices?.[index] ?? 0;

        if (
          dataServico >= inicio &&
          dataServico <= fim &&
          barbeiroAtual === barbeiro
        ) {
          total += preco;
        }
      });
    });

    return total;
  };

  const lucroNatan = calcularLucroPorBarbeiro(
    historicos,
    "Natan",
    dataInicial,
    dataFinal
  );
  const lucroArtista = calcularLucroPorBarbeiro(
    historicos,
    "Artista do Corte",
    dataInicial,
    dataFinal
  );

  return (
    <div className="min-h-screen p-6">
      <BackAdmin />
      <h1 className="text-2xl font-bold mb-4 text-white">
        Histórico de Clientes
      </h1>
      <div className="rounded-lg overflow-hidden border border-zinc-700">
        <Table className="bg-zinc-800 text-white">
          <TableHeader className="bg-zinc-900">
            <TableRow>
              <TableHead className="text-white">Nome</TableHead>
              <TableHead className="text-white">Telefone</TableHead>
              <TableHead className="text-white">
                Total de atendimentos
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesUnicos.map((cliente) => {
              const normalizedPhone = cliente.phone
                .replace(/\D/g, "")
                .replace(/^55/, "");
              return (
                <TableRow
                  key={cliente._id}
                  className="cursor-pointer hover:bg-zinc-700 transition"
                  onClick={() =>
                    router.push(`/admin/historico/${normalizedPhone}`)
                  }>
                  <TableCell>{cliente.name}</TableCell>
                  <TableCell>{cliente.phone}</TableCell>
                  <TableCell>{cliente.amount}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Lucro por barbeiro
        </h2>

        <div className="flex gap-6 mb-4">
          <div className="flex flex-col">
            <label className="text-white mb-1">Data de início</label>
            <input
              type="date"
              className="bg-zinc-800 text-white p-2 rounded"
              onChange={(e) => setDataInicial(DateTime.fromISO(e.target.value))}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white mb-1">Data de fim</label>
            <input
              type="date"
              className="bg-zinc-800 text-white p-2 rounded"
              onChange={(e) => setDataFinal(DateTime.fromISO(e.target.value))}
            />
          </div>
        </div>

        <div className="rounded-lg overflow-hidden border border-zinc-700">
          <Table className="bg-zinc-800 text-white">
            <TableHeader className="bg-zinc-900">
              <TableRow>
                <TableHead className="text-white">Barbeiro</TableHead>
                <TableHead className="text-white">Lucro no período</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Natan</TableCell>
                <TableCell>
                  R${lucroNatan.toFixed(2).replace(".", ",")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Artista do Corte</TableCell>
                <TableCell>
                  R${lucroArtista.toFixed(2).replace(".", ",")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
