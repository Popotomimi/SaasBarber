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

  useEffect(() => {
    if (!phone) return;

    fetch(`/api/history/${phone}`)
      .then((res) => res.json())
      .then((data) => setHistoricos(data))
      .catch(() => setHistoricos([]))
      .finally(() => setLoading(false));
  }, [phone]);

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

  return (
    <div className="min-h-screen flex flex-col p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-white">
          Histórico de {historicos[0]?.name}
        </h1>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="text-white bg-zinc-800 border-white">
          <ArrowLeft size={18} className="mr-2" />
          Voltar
        </Button>
      </div>

      <div className="rounded-lg overflow-auto border border-zinc-700">
        <Accordion type="multiple" className="w-full">
          {historicos.map((h, index) => (
            <AccordionItem key={h._id} value={`item-${index}`}>
              <AccordionTrigger className="text-white bg-zinc-800 px-4 py-2 rounded">
                Atendimento em {new Date(h.dates[0]).toLocaleDateString()} com{" "}
                {h.barbers.join(", ")}
              </AccordionTrigger>
              <AccordionContent className="bg-zinc-900 text-white px-4 py-2">
                <p>
                  <strong>Serviços:</strong> {h.services.join(", ")}
                </p>
                <p>
                  <strong>Barbeiros:</strong> {h.barbers.join(", ")}
                </p>
                <p>
                  <strong>Datas:</strong>{" "}
                  {h.dates
                    .map((d) => new Date(d).toLocaleDateString())
                    .join(", ")}
                </p>
                <p>
                  <strong>Total de atendimentos:</strong> {h.amount}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
