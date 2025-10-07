"use client";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Cliente from "../../interfaces/Cliente";
import { LuMessageCircleWarning } from "react-icons/lu";
import extractDuration from "../utils/agenda/extractDuration";
import calculateEndTime from "../utils/agenda/calculateEndTime";
import calculateSchedule from "../utils/agenda/calculateSchedule";
import { fetchClientes } from "../utils/form/fetchClientes";
import "react-calendar/dist/Calendar.css";

const PublicAgenda = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const startTime = "09:00";
  const endTime = "21:00";
  const selectedBarber = "Artista do Corte";

  // ✅ Corrigido: evita UTC e gera "YYYY-MM-DD" localmente
  const selectedDateStr =
    selectedDate.getFullYear() +
    "-" +
    String(selectedDate.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(selectedDate.getDate()).padStart(2, "0");

  useEffect(() => {
    fetchClientes().then(setClientes);

    const handleUpdate = () => {
      fetchClientes().then(setClientes);
    };

    window.addEventListener("agendaAtualizada", handleUpdate);

    return () => {
      window.removeEventListener("agendaAtualizada", handleUpdate);
    };
  }, []);

  const filteredClientes = clientes.filter((cliente) => {
    return (
      cliente.barber === selectedBarber && cliente.date === selectedDateStr
    );
  });

  return (
    <section className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Agenda</h2>

      <div className="mb-6 flex justify-center">
        <Calendar
          locale="pt-BR"
          onChange={(value) => {
            if (value instanceof Date) {
              setSelectedDate(value);
            }
          }}
          value={selectedDate}
          minDate={new Date()}
          className="react-calendar w-full max-w-md bg-[#1a1a1a] text-white rounded-lg p-4 shadow-md [&_.react-calendar__tile]:rounded-md [&_.react-calendar__tile]:p-2 [&_.react-calendar__tile]:text-sm [&_.react-calendar__tile]:text-gray-300 [&_.react-calendar__tile--active]:bg-blue-400 [&_.react-calendar__tile--active]:text-white [&_.react-calendar__tile:hover]:bg-[#333] [&_.react-calendar__navigation]:mb-4 [&_.react-calendar__navigation__label]:text-white [&_.react-calendar__navigation__arrow]:text-white [&_.react-calendar__month-view__weekdays]:text-gray-400 [&_.react-calendar__month-view__weekdays]:uppercase [&_.react-calendar__month-view__weekdays]:text-xs"
          tileClassName={({ date }) => {
            const dateStr =
              date.getFullYear() +
              "-" +
              String(date.getMonth() + 1).padStart(2, "0") +
              "-" +
              String(date.getDate()).padStart(2, "0");
            return dateStr === selectedDateStr
              ? "bg-blue-500 text-white rounded-md"
              : "hover:bg-blue-100 rounded-md";
          }}
        />
      </div>

      <p className="text-center text-sm mb-2 text-white">
        <strong>Horário de funcionamento:</strong> {startTime} às {endTime}
      </p>

      {filteredClientes.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="mb-2">Nenhum horário ocupado</p>
          <LuMessageCircleWarning className="mx-auto text-9xl text-blue-400" />
        </div>
      ) : (
        <div className="space-y-2 mb-7">
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
