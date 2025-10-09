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
import Link from "next/link";
import BackAdmin from "@/components/back/back";

export default function HistoricoPage() {
  const [historicos, setHistoricos] = useState<History[]>([]);
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
    </div>
  );
}
