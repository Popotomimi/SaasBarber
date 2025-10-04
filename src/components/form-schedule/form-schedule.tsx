"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Cleave from "cleave.js/react";
import { scheduleSchema } from "../../lib/schema";
import { z } from "zod";
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
import { barbers } from "@/db/barbers";
import { services } from "@/db/services";
import { toast } from "react-toastify";

const FormSchedule = () => {
  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      name: "",
      date: "",
      hora: "",
      service: "",
      barber: "",
      phoneNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof scheduleSchema>) {
    const payload = {
      name: values.name,
      date: values.date,
      time: values.hora,
      service: values.service,
      barber: values.barber,
      phone: values.phoneNumber,
    };

    try {
      const res = await fetch("/api/cliente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Erro ao agendar. Tente novamente.");
        return;
      }

      toast.success("Agendamento realizado com sucesso!");
      form.reset();
    } catch (error) {
      console.error("Erro ao enviar agendamento:", error);
      toast.error("Erro inesperado. Tente novamente mais tarde.");
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
                    className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hora"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">Hora</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="service"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">Serviço</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition">
                      <SelectValue placeholder="Escolha o serviço" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#1a1a1a] text-white">
                    {services.map((service) => (
                      <SelectItem
                        key={service.name}
                        value={service.name}
                        className="hover:bg-[#333] cursor-pointer">
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="barber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-300">
                  Barbeiro
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-[#222] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white transition">
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
            className="w-full cursor-pointer bg-white text-black font-semibold py-3 rounded-md hover:bg-blue-400 transition">
            Agendar
          </Button>
        </form>
      </Form>
    </section>
  );
};

export default FormSchedule;
