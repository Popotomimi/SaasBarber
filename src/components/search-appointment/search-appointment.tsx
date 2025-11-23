"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import Cleave from "cleave.js/react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Search,
  Calendar,
  Clock,
  Scissors,
  User,
  AlertCircle,
} from "lucide-react";
import Cliente from "@/interfaces/Cliente";

const SearchAppointment = () => {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<Cliente | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false); // novo estado

  const handleSearch = async () => {
    setResult(null);
    setSearched(false);
    setLoading(true);

    if (!phone) {
      toast.error("Digite um número de telefone!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/search-appointment?phone=${phone}`);
      const data = await res.json();

      if (!res.ok) {
        toast.warn(data.message || data.error);
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      toast.error("Erro na requisição");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="w-[90%] md:max-w-2xl mx-auto mb-5 text-white p-6 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] shadow-lg rounded-xl animate-fade-in">
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2 animate-bounce-in">
        <Search className="w-8 h-8 text-blue-400 animate-pulse" />
        Buscar Agendamento
      </h2>

      <div className="flex flex-col md:flex-row gap-2 animate-fade-in-up">
        <Cleave
          value={phone}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPhone(e.target.value)
          }
          options={{
            delimiters: ["(", ") ", "-", ""],
            blocks: [0, 2, 5, 4],
            numericOnly: true,
          }}
          className="flex-1 bg-[#222] text-white px-4 py-3 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="(11) 99999-9999"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2 animate-jump-in disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5"></span>
          ) : (
            <>
              <Search className="w-5 h-5" /> Buscar
            </>
          )}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 flex items-center justify-center text-blue-400 gap-2 animate-pulse">
          <Search className="w-5 h-5 animate-spin" />
          <span>Buscando agendamento...</span>
        </div>
      )}

      {/* Resultado */}
      {result && !loading && (
        <div className="mt-6 p-6 rounded-lg bg-gradient-to-br from-[#111] to-[#2a2a2a] border border-gray-700 shadow-xl space-y-4 animate-fade-in-up">
          <p className="flex items-center gap-2 text-gray-200">
            <Calendar className="w-5 h-5 text-blue-400 drop-shadow" />
            <span className="font-semibold">Data:</span>{" "}
            {format(parseISO(result.date), "dd/MM/yyyy", { locale: ptBR })}
          </p>
          <p className="flex items-center gap-2 text-gray-200">
            <Clock className="w-5 h-5 text-green-400 drop-shadow" />
            <span className="font-semibold">Hora:</span> {result.time}
          </p>
          <p className="flex items-center gap-2 text-gray-200">
            <Scissors className="w-5 h-5 text-pink-400 drop-shadow" />
            <span className="font-semibold">Serviço:</span> {result.service}
          </p>
          <p className="flex items-center gap-2 text-gray-200">
            <User className="w-5 h-5 text-purple-400 drop-shadow" />
            <span className="font-semibold">Barbeiro:</span> {result.barber}
          </p>
        </div>
      )}

      {/* Nenhum resultado */}
      {!result && searched && !loading && (
        <div className="mt-6 flex items-center gap-2 text-red-400 justify-center animate-shake">
          <AlertCircle className="w-5 h-5" />
          <span>Nenhum agendamento encontrado</span>
        </div>
      )}
    </div>
  );
};

export default SearchAppointment;
