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
import { Button } from "@/components/ui/button";
import BackAdmin from "@/components/back/back";
import { DateTime } from "luxon";

export default function HistoricoPage() {
  const [historicos, setHistoricos] = useState<History[]>([]);
  const [periodo, setPeriodo] = useState<"semana" | "mes" | "ano">("mes");
  const router = useRouter();

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const atualizar = () => {
      fetch("/api/history")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setHistoricos(data);
          } else {
            setHistoricos([]);
          }
        });
    };

    // Carregamento inicial
    atualizar();

    // Escuta o evento global
    window.addEventListener("agendaAtualizada", atualizar);

    return () => {
      window.removeEventListener("agendaAtualizada", atualizar);
    };
  }, []);

  // Protege contra dados inválidos
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
    periodo: "semana" | "mes" | "ano"
  ) => {
    const agora = DateTime.now().setZone("America/Sao_Paulo");
    const inicio =
      periodo === "semana"
        ? agora.startOf("week")
        : periodo === "mes"
        ? agora.startOf("month")
        : agora.startOf("year");

    let total = 0;

    historico.forEach((h) => {
      h.dates.forEach((data, index) => {
        const dataServico = DateTime.fromJSDate(new Date(data));
        const barbeiroAtual = h.barbers?.[index];
        if (
          dataServico >= inicio &&
          barbeiroAtual === barbeiro &&
          h.prices?.[index]
        ) {
          total += h.prices[index];
        }
      });
    });

    return total;
  };

  const lucroNatan = calcularLucroPorBarbeiro(historicos, "Natan", periodo);
  const lucroArtista = calcularLucroPorBarbeiro(
    historicos,
    "Artista do Corte",
    periodo
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

      {/* 🔽 Painel de lucro por barbeiro */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Lucro por barbeiro
        </h2>

        <div className="flex gap-2 mb-4">
          <Button
            className="cursor-pointer"
            variant={periodo === "semana" ? "default" : "outline"}
            onClick={() => setPeriodo("semana")}>
            Semana
          </Button>
          <Button
            className="cursor-pointer"
            variant={periodo === "mes" ? "default" : "outline"}
            onClick={() => setPeriodo("mes")}>
            Mês
          </Button>
          <Button
            className="cursor-pointer"
            variant={periodo === "ano" ? "default" : "outline"}
            onClick={() => setPeriodo("ano")}>
            Ano
          </Button>
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
