"use client";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Cliente from "../../interfaces/Cliente";
import { LuMessageCircleWarning } from "react-icons/lu";
import "react-calendar/dist/Calendar.css";

const PublicAgenda = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const startTime = "09:00";
  const endTime = "21:00";

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch("/api/cliente");
        const data = await res.json();
        setClientes(data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    };
    fetchClientes();
  }, []);

  const selectedDateStr = selectedDate.toISOString().split("T")[0];

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.barber === "Artista do Corte" && cliente.date === selectedDateStr
  );

  const extractDuration = (service: string): number | null => {
    const match = service.match(/\((\d+)min\)/);
    return match ? parseInt(match[1], 10) : null;
  };

  const calculateEndTime = (startTime: string, duration: number | null) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + (duration || 0);
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateSchedule = (
    clientes: Cliente[],
    startTime: string,
    endTime: string
  ) => {
    const occupiedSlots = clientes.map((cliente) => {
      const duration = extractDuration(cliente.service);
      const slotEndTime = calculateEndTime(cliente.time, duration);
      return { start: cliente.time, end: slotEndTime, type: "occupied" };
    });

    occupiedSlots.sort((a, b) => a.start.localeCompare(b.start));

    const schedule = [];
    let lastEndTime = startTime;

    for (const slot of occupiedSlots) {
      if (slot.start > lastEndTime) {
        schedule.push({
          start: lastEndTime,
          end: slot.start,
          type: "available",
        });
      }
      schedule.push(slot);
      lastEndTime = slot.end;
    }

    if (lastEndTime < endTime) {
      schedule.push({ start: lastEndTime, end: endTime, type: "available" });
    }

    return schedule;
  };

  return (
    <section className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Agenda</h2>

      <div className="mb-6 flex justify-center">
        <Calendar
          onChange={(value) => {
            if (value instanceof Date) {
              setSelectedDate(value);
            }
          }}
          value={selectedDate}
          minDate={new Date()}
          className="rounded-lg shadow-md p-4 bg-white"
          tileClassName={({ date }) =>
            date.toISOString().split("T")[0] === selectedDateStr
              ? "bg-blue-500 text-white rounded-md"
              : "hover:bg-blue-100 rounded-md"
          }
        />
      </div>

      <p className="text-center text-sm mb-2">
        <strong>Horário de funcionamento:</strong> {startTime} às {endTime}
      </p>

      {filteredClientes.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="mb-2">Nenhum horário ocupado</p>
          <LuMessageCircleWarning className="mx-auto text-3xl" />
        </div>
      ) : (
        <div className="space-y-2">
          {calculateSchedule(filteredClientes, startTime, endTime).map(
            (slot, index) => (
              <div
                key={index}
                className={`p-3 rounded-md border ${
                  slot.type === "occupied"
                    ? "bg-red-100 border-red-300"
                    : "bg-green-100 border-green-300"
                }`}>
                <p className="text-sm font-medium">
                  {slot.start} - {slot.end} |{" "}
                  {slot.type === "occupied"
                    ? `Ocupado (Barbeiro: ${
                        filteredClientes.find(
                          (cliente) =>
                            cliente.time === slot.start &&
                            calculateEndTime(
                              cliente.time,
                              extractDuration(cliente.service)
                            ) === slot.end
                        )?.barber || "Desconhecido"
                      })`
                    : "Disponível"}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
};

export default PublicAgenda;
