"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import History from "@/interfaces/History";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DateTime } from "luxon";

type Atendimento = {
  date: string;
  time?: string;
  barber: string;
  service: string;
};

export default function HistoricoClientePage() {
  const params = useParams();
  const router = useRouter();
  const phone =
    typeof params.phone === "string"
      ? params.phone
      : Array.isArray(params.phone)
      ? params.phone[0]
      : "";

  const [historicos, setHistoricos] = useState<History[]>([]);
  const [loading, setLoading] = useState(true);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState("todos");

  // datas com default de última semana
  const hoje = DateTime.now().setZone("America/Sao_Paulo");
  const [dataInicial, setDataInicial] = useState<DateTime>(
    hoje.minus({ days: 7 })
  );
  const [dataFinal, setDataFinal] = useState<DateTime>(hoje);

  useEffect(() => {
    if (!phone) return;

    fetch(`/api/history/${phone}`)
      .then((res) => res.json())
      .then((data) => setHistoricos(data))
      .catch(() => setHistoricos([]))
      .finally(() => setLoading(false));
  }, [phone]);

  const expandHistoricos = (historicos: History[]): Atendimento[] => {
    const atendimentos: Atendimento[] = [];

    historicos.forEach((h) => {
      for (let i = 0; i < h.dates.length; i++) {
        const rawDate = h.dates[i];
        const formattedDate = new Date(rawDate).toLocaleDateString("pt-BR");

        atendimentos.push({
          date: formattedDate,
          time: h.times?.[i],
          barber: h.barbers[i],
          service: h.services[i],
        });
      }
    });

    return atendimentos;
  };

  const calcularTotalPorPeriodo = (
    historico: History[],
    inicio: DateTime,
    fim: DateTime,
    barbeiro: string
  ) => {
    let total = 0;

    historico.forEach((h) => {
      h.dates.forEach((data, index) => {
        const dataServico = DateTime.fromISO(
          typeof data === "string" ? data : new Date(data).toISOString()
        );
        const barbeiroAtual = h.barbers?.[index];
        if (
          dataServico >= inicio &&
          dataServico <= fim &&
          (barbeiro === "todos" || barbeiroAtual === barbeiro)
        ) {
          total += h.prices?.[index] || 0;
        }
      });
    });

    return total;
  };

  const gerarDadosGrafico = (historico: History[], barbeiro: string) => {
    const dados: { name: string; valor: number }[] = [];

    historico.forEach((h) => {
      h.dates.forEach((data, index) => {
        const barbeiroAtual = h.barbers?.[index];
        const dataServico = DateTime.fromJSDate(new Date(data));
        if (
          dataServico >= dataInicial &&
          dataServico <= dataFinal &&
          (barbeiro === "todos" || barbeiroAtual === barbeiro)
        ) {
          dados.push({
            name: dataServico.toFormat("dd/MM"),
            valor: h.prices?.[index] || 0,
          });
        }
      });
    });

    return dados;
  };

  if (loading)
    return (
      <div className="p-6 text-white min-h-screen">Carregando histórico...</div>
    );

  if (historicos.length === 0) {
    return (
      <div className="p-6 text-white min-h-screen">
        Nenhum histórico encontrado para este cliente.
      </div>
    );
  }

  const atendimentos = expandHistoricos(historicos);
  const dadosGrafico = gerarDadosGrafico(historicos, barbeiroSelecionado);
  const totalPeriodo = calcularTotalPorPeriodo(
    historicos,
    dataInicial,
    dataFinal,
    barbeiroSelecionado
  );

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">
          Histórico de {historicos[0]?.name}
        </h1>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="text-white bg-zinc-800 border-white cursor-pointer">
          <ArrowLeft size={18} className="mr-2" />
          Voltar
        </Button>
      </div>

      <p className="text-white mb-4">
        Total de atendimentos: {atendimentos.length}
      </p>

      <div className="rounded-lg overflow-auto border border-zinc-700">
        <Accordion type="multiple" className="w-full">
          {atendimentos.map((a, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-white bg-zinc-800 px-4 py-2 rounded">
                Atendimento em {a.date} com {a.barber}
              </AccordionTrigger>
              <AccordionContent className="bg-zinc-900 text-white px-4 py-2">
                <p>
                  <strong>Serviço:</strong> {a.service}
                </p>
                {a.time && (
                  <p>
                    <strong>Horário:</strong> {a.time}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* 🔽 Relatório financeiro com filtros */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">
          Relatório financeiro
        </h2>

        {/* Inputs de data com labels */}
        <div className="flex gap-6 mb-4 flex-wrap">
          <div className="flex flex-col">
            <label className="text-white mb-1">Data de início</label>
            <input
              type="date"
              className="bg-zinc-800 text-white p-2 rounded"
              value={dataInicial.toISODate() || ""}
              onChange={(e) => setDataInicial(DateTime.fromISO(e.target.value))}
            />
          </div>
          <div className="flex flex-col">
            <label className="text-white mb-1">Data de fim</label>
            <input
              type="date"
              className="bg-zinc-800 text-white p-2 rounded"
              value={dataFinal.toISODate() || ""}
              onChange={(e) => setDataFinal(DateTime.fromISO(e.target.value))}
            />
          </div>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          <Button
            className="cursor-pointer"
            variant={barbeiroSelecionado === "todos" ? "default" : "outline"}
            onClick={() => setBarbeiroSelecionado("todos")}>
            Todos
          </Button>
          <Button
            className="cursor-pointer"
            variant={
              barbeiroSelecionado === "Artista do Corte" ? "default" : "outline"
            }
            onClick={() => setBarbeiroSelecionado("Artista do Corte")}>
            Artista do Corte
          </Button>
          <Button
            className="cursor-pointer"
            variant={barbeiroSelecionado === "Natan" ? "default" : "outline"}
            onClick={() => setBarbeiroSelecionado("Natan")}>
            Natan
          </Button>
        </div>

        <p className="text-white mb-2">
          Total de lucro ({barbeiroSelecionado}) no período:{" "}
          <span className="font-bold">
            R${totalPeriodo.toFixed(2).replace(".", ",")}
          </span>
        </p>

        <div className="bg-zinc-900 p-4 rounded-lg border border-zinc-700">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dadosGrafico}>
              <XAxis dataKey="name" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{ backgroundColor: "#333", color: "#fff" }}
              />
              <Bar dataKey="valor" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
