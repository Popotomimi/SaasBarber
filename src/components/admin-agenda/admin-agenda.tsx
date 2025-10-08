"use client";
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Cliente from "../../interfaces/Cliente";
import { LuMessageCircleWarning } from "react-icons/lu";
import { fetchClientes } from "../utils/form/fetchClientes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import Modal from "../modal/modal";
import { barbers } from "@/db/barbers";

const parseDateLocal = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const AdminAgenda = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const selectedBarber = "Artista do Corte";
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    time: "",
    service: "",
    duration: 0,
    phone: "",
    barber: "",
  });

  const handleEdit = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setFormData({
      name: cliente.name,
      time: cliente.time,
      service: cliente.service,
      duration: cliente.duration,
      phone: cliente.phone,
      barber: cliente.barber,
    });
  };

  const handleSave = async () => {
    if (!clienteEditando) return;

    try {
      await fetch(`/api/cliente/${clienteEditando._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...clienteEditando, ...formData }),
      });

      toast.success("Agendamento atualizado com sucesso!");
      setClienteEditando(null);
      fetchClientes().then(setClientes);
    } catch (error) {
      toast.error("Erro ao atualizar agendamento.");
    }
  };

  const handleDelete = (id: string) => {
    toast.info(
      <div>
        <p className="mb-2">Tem certeza que deseja excluir este agendamento?</p>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              try {
                await fetch(`/api/cliente/${id}`, {
                  method: "DELETE",
                });
                setClientes((prev) => prev.filter((c) => c._id !== id));
                toast.dismiss();
                toast.success("Agendamento excluído com sucesso!");
              } catch (error) {
                toast.dismiss();
                toast.error("Erro ao excluir agendamento.");
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

  const filteredClientes = clientes.filter(
    (cliente) =>
      cliente.barber === selectedBarber && cliente.date === selectedDateStr
  );

  return (
    <section id="agenda" className="max-w-3xl mx-auto p-4">
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

      {filteredClientes.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="mb-2">Nenhum horário ocupado</p>
          <LuMessageCircleWarning className="mx-auto text-9xl text-blue-400" />
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold text-white text-center mb-2">
            Agendamentos do Dia
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {filteredClientes.map((cliente) => (
              <Card
                key={cliente._id}
                className="bg-[#1a1a1a] text-white border border-gray-700">
                <CardHeader>
                  <CardTitle>{cliente.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1 text-sm">
                  <p>
                    <strong>Data:</strong>{" "}
                    {parseDateLocal(cliente.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                  <p>
                    <strong>Horário:</strong> {cliente.time}
                  </p>
                  <p>
                    <strong>Serviço:</strong> {cliente.service}
                  </p>
                  <p>
                    <strong>Barbeiro:</strong> {cliente.barber}
                  </p>
                  <p>
                    <strong>Telefone:</strong> {cliente.phone}
                  </p>
                  <div className="flex justify-between mt-5 pt-5 border-t-1 border-gray-300">
                    <button
                      onClick={() => handleEdit(cliente)}
                      className="px-2 py-1 bg-blue-400 text-white rounded text-sm">
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(cliente._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm">
                      Excluir
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
      <Modal
        cliente={clienteEditando}
        formData={formData}
        setFormData={setFormData}
        onClose={() => setClienteEditando(null)}
        onSave={handleSave}
      />
    </section>
  );
};

export default AdminAgenda;
