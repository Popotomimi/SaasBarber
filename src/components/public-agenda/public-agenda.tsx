"use client";
import React, { useState, useEffect } from "react";
import Cliente from "../../interfaces/Cliente";
import Bloqueio from "../../interfaces/Bloqueio";
import { LuMessageCircleWarning } from "react-icons/lu";
import extractDuration from "../utils/agenda/extractDuration";
import calculateEndTime from "../utils/agenda/calculateEndTime";
import { fetchClientes } from "../utils/form/fetchClientes";

interface Service {
  name: string;
  duration: number;
}

interface PublicAgendaSelectorProps {
  selectedService: Service | undefined;
  selectedBarber: string;
  selectedDate: string;
  onTimeSelect: (time: string) => void;
}

const PublicAgendaSelector: React.FC<PublicAgendaSelectorProps> = ({
  selectedService,
  selectedBarber,
  selectedDate,
  onTimeSelect,
}) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [bloqueios, setBloqueios] = useState<Bloqueio[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const startTime = "09:00";
  const endTime = "21:00";

  useEffect(() => {
    fetchClientes().then(setClientes);
    fetch("/api/bloqueio")
      .then((res) => res.json())
      .then(setBloqueios)
      .catch(() => setBloqueios([]));

    const handleUpdate = () => fetchClientes().then(setClientes);
    window.addEventListener("agendaAtualizada", handleUpdate);
    return () => window.removeEventListener("agendaAtualizada", handleUpdate);
  }, []);

  useEffect(() => {
    setSelectedTime(null);
  }, [selectedService, selectedBarber, selectedDate]);

  if (!selectedService || !selectedDate || !selectedBarber) {
    return (
      <p className="text-white text-center mt-4">
        Selecione serviço, barbeiro e data para ver os horários disponíveis.
      </p>
    );
  }

  const bloqueioDoDia = bloqueios.find((bloqueio) => {
    const bloqueioInicio = new Date(bloqueio.startDate);
    const bloqueioFim = new Date(bloqueio.endDate);
    const dataSelecionada = new Date(selectedDate);
    return (
      bloqueio.barber === selectedBarber &&
      dataSelecionada >= bloqueioInicio &&
      dataSelecionada <= bloqueioFim
    );
  });

  if (bloqueioDoDia) {
    return (
      <div className="mt-6 text-center text-white">
        <h3 className="text-xl font-semibold mb-2">Agenda bloqueada</h3>
        <p className="text-sm text-gray-300 mb-2">
          Motivo: <strong>{bloqueioDoDia.motivo}</strong>
        </p>
        <LuMessageCircleWarning className="mx-auto text-6xl text-blue-400" />
      </div>
    );
  }

  const normalizedDate = new Date(selectedDate).toISOString().split("T")[0];

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.barber === selectedBarber && cliente.date === normalizedDate
  );

  const generateAvailableSlots = () => {
    const occupiedSlots = filteredClientes.map((cliente) => {
      const start = cliente.time;
      const duration =
        extractDuration(cliente.service) || selectedService.duration;
      const end = calculateEndTime(start, duration);
      return { start, end };
    });

    const slots: string[] = [];
    let current = startTime;

    while (calculateEndTime(current, selectedService.duration) <= endTime) {
      const end = calculateEndTime(current, selectedService.duration);
      const isOccupied = occupiedSlots.some(
        (slot) => !(end <= slot.start || current >= slot.end)
      );
      if (!isOccupied) slots.push(current);
      current = calculateEndTime(current, selectedService.duration);
    }

    return slots;
  };

  const availableSlots = generateAvailableSlots();

  const handleSelect = (time: string) => {
    setSelectedTime(time);
    onTimeSelect(time);
  };

  return (
    <div className="mt-6">
      <h3 className="text-white text-center mb-2 font-semibold">
        Horários disponíveis
      </h3>
      {availableSlots.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="mb-2">Nenhum horário disponível</p>
          <LuMessageCircleWarning className="mx-auto text-6xl text-blue-400" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {availableSlots.map((time) => (
            <button
              type="button"
              key={time}
              onClick={() => handleSelect(time)}
              className={`py-2 px-4 rounded font-medium transition ${
                selectedTime === time
                  ? "bg-gray-500 cursor-pointer text-white"
                  : "bg-blue-500 cursor-pointer text-white hover:bg-blue-600"
              }`}>
              {time}
            </button>
          ))}
        </div>
      )}
      {selectedTime && (
        <p className="text-center text-sm text-white mt-4">
          Horário selecionado: <strong>{selectedTime}</strong>
        </p>
      )}
    </div>
  );
};

export default PublicAgendaSelector;
