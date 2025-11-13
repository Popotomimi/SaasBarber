"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cleave from "cleave.js/react";
import { scheduleSchema } from "../../lib/schema";
import { z } from "zod";
import { toast } from "react-toastify";
import { barbers } from "@/db/barbers";
import { checkAvailability } from "../utils/form/checkAvailability";
import { fetchClientes } from "../utils/form/fetchClientes";

// UI components
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Cliente from "@/interfaces/Cliente";
import PublicAgendaSelector from "../public-agenda/public-agenda";
import ServiceSelector from "../service-selector/service-selector";

const FormSchedule = () => {
  const [resetCounter, setResetCounter] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedService, setSelectedService] = useState<{
    name: string;
    duration: number;
    price: number;
  }>();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showAgenda, setShowAgenda] = useState(true);

  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      name: "",
      date: "",
      hora: "",
      service: "",
      barber: "",
      phoneNumber: "",
      price: 0,
      duration: 0,
    },
  });

  const barber = form.watch("barber");

  // Recuperar dados do localStorage
  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    const savedPhone = localStorage.getItem("userPhone");

    if (savedName) form.setValue("name", savedName);
    if (savedPhone) form.setValue("phoneNumber", savedPhone);
  }, [form]);

  // Atualiza exibição da agenda
  useEffect(() => {
    const shouldShow = !!(selectedService && barber && selectedDate);
    setShowAgenda((prev) => (prev !== shouldShow ? shouldShow : prev));
  }, [selectedService, barber, selectedDate]);

  const handleTimeSelect = useCallback(
    (time: string) => {
      form.setValue("hora", time);
    },
    [form]
  );

  // Enviar agendamento
  async function onSubmit(values: z.infer<typeof scheduleSchema>) {
    const {
      name,
      date,
      hora: time,
      service,
      barber,
      phoneNumber: phone,
      duration,
      price,
    } = values;

    if (!name || !date || !time || !service || !barber) {
      toast.warning("Preencha todos os campos.");
      return;
    }

    const conflictMessage = checkAvailability(
      clientes,
      date,
      time,
      service,
      barber
    );
    if (conflictMessage) {
      toast.warning(conflictMessage);
      return;
    }

    if (!duration || !price) {
      toast.warning("Serviço inválido.");
      return;
    }

    const payload = {
      name,
      date,
      time,
      service,
      duration,
      price,
      barber,
      phone,
    };

    try {
      setIsButtonDisabled(true);
      const res = await fetch("/api/cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Erro ao agendar.");
        return;
      }

      toast.success("Agendamento realizado com sucesso!");
      setResetCounter((prev) => prev + 1);
      localStorage.setItem("userName", name);
      localStorage.setItem("userPhone", phone);
      form.reset();
      setSelectedService(undefined);
      setSelectedDate("");
      setShowAgenda(false);
      window.dispatchEvent(new Event("agendaAtualizada"));
      fetchClientes().then(setClientes);
    } catch (error) {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsButtonDisabled(false);
    }
  }

  return (
    <section className="w-full px-6 py-12 flex justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-xl bg-[#1a1a1a] p-8 rounded-xl shadow-lg space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-400 text-center">
            Agende seu corte
          </h2>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">Nome</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition"
                    placeholder="Seu nome completo"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">Data</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedDate(e.target.value);
                    }}
                    className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ServiceSelector
            resetTrigger={resetCounter}
            onChange={(selected, totalPrice, totalDuration) => {
              const serviceNames = selected.map((s) => s.name).join(", ");
              form.setValue("service", serviceNames);
              form.setValue("price", totalPrice);
              form.setValue("duration", totalDuration);
              setSelectedService({
                name: serviceNames,
                price: totalPrice,
                duration: totalDuration,
              });
            }}
          />

          <FormField
            control={form.control}
            name="barber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Barbeiro
                </FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition">
                      <SelectValue placeholder="Escolha o barbeiro" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#1a1a1a] text-white">
                    {barbers.map((barber) => (
                      <SelectItem
                        key={barber.name}
                        value={barber.name}
                        className="hover:bg-[#333] cursor-pointer">
                        {barber.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {showAgenda && (
            <PublicAgendaSelector
              selectedService={selectedService}
              selectedBarber={barber}
              selectedDate={selectedDate}
              onTimeSelect={handleTimeSelect}
            />
          )}

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Número de telefone
                </FormLabel>
                <FormControl>
                  <Cleave
                    {...field}
                    options={{
                      delimiters: ["(", ") ", "-", ""],
                      blocks: [0, 2, 5, 4],
                      numericOnly: true,
                    }}
                    className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition"
                    placeholder="(11) 99999-9999"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full cursor-pointer font-semibold py-3 rounded-md transition
              ${
                isButtonDisabled
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-white text-black hover:bg-blue-400"
              }
  `}>
            {isButtonDisabled ? "Aguarde..." : "Agendar"}
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default FormSchedule;
