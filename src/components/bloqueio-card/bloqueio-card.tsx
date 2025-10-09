"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Bloqueio from "@/interfaces/Bloqueio";

const BloqueioCard = () => {
  const [bloqueios, setBloqueios] = useState<(Bloqueio & { _id: string })[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBloqueios = async () => {
      try {
        const res = await fetch("/api/bloqueio");
        const data = await res.json();
        setBloqueios(data);
      } catch (error) {
        toast.error("Erro ao carregar bloqueios.");
      } finally {
        setLoading(false);
      }
    };

    fetchBloqueios();
  }, []);

  const handleDelete = async (id: string) => {
    toast.info(
      <div>
        <p className="mb-2">Tem certeza que deseja excluir este bloqueio?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await fetch(`/api/bloqueio/${id}`, {
                  method: "DELETE",
                });
                setBloqueios((prev) => prev.filter((b) => b._id !== id));
                toast.dismiss();
                toast.success("Bloqueio excluído com sucesso!");
              } catch (error) {
                toast.dismiss();
                toast.error("Erro ao excluir bloqueio.");
              }
            }}
            className="px-2 py-1 bg-red-500 text-white rounded text-sm">
            Confirmar
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-2 py-1 bg-gray-300 text-black rounded text-sm">
            Cancelar
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  if (loading)
    return <p className="p-6 text-center">Carregando bloqueios...</p>;
  if (bloqueios.length === 0)
    return <p className="p-6 text-center">Nenhum bloqueio encontrado.</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      {bloqueios.map((bloqueio) => (
        <Card
          key={bloqueio._id}
          className="shadow-sm bg-zinc-900 text-white w-full max-w-sm flex flex-col items-center text-center">
          <CardHeader className="w-full flex justify-center">
            <h3 className="text-lg font-semibold text-center">
              Bloqueio de {bloqueio.barber}
            </h3>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Motivo:</strong> {bloqueio.motivo}
            </p>
            <p>
              <strong>Início:</strong> {bloqueio.startDate} às{" "}
              {bloqueio.startTime}
            </p>
            <p>
              <strong>Fim:</strong> {bloqueio.endDate} às {bloqueio.endTime}
            </p>
          </CardContent>
          <CardFooter className="w-full flex justify-center">
            <Button
              variant="destructive"
              onClick={() => handleDelete(bloqueio._id)}
              className="flex items-center gap-2">
              <Trash2 size={18} />
              Excluir bloqueio
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BloqueioCard;
